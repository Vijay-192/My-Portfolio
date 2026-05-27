
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects }     from "../../../redux-store/Projectslice";
import { fetchSkills }       from "../../../redux-store/SkillSlice";
import { fetchServices }     from "../../../redux-store/ServiceSlice";
import { fetchAchievements } from "../../../redux-store/AchievementSlice";
import { fetchAllBlogs }     from "../../../redux-store/BlogSlice";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { FolderKanban, Lightbulb, Briefcase, FileText, Trophy, TrendingUp, Download, Menu, X } from "lucide-react";

const P  = "#0C4733";
const PA = "#4E9C79";

const COLORS = {
  projects:     P,
  skills:       "#1D9E75",
  services:     "#185FA5",
  blog:         "#BA7517",
  achievements: "#993556",
};

const spark = (seed) =>
  Array.from({ length: 7 }, (_, i) => ({
    v: Math.max(5, seed - 5 + Math.round(Math.sin(i + seed) * 4 + i * 1.2)),
  }));

const overviewData = Array.from({ length: 31 }, (_, i) => ({
  day: [0, 5, 10, 15, 20, 25, 30].includes(i)
    ? ["May 1","May 6","May 11","May 16","May 21","May 26","May 31"][[0,5,10,15,20,25,30].indexOf(i)]
    : "",
  projects:     55 + Math.round(Math.sin(i * 0.4) * 12 + i * 0.8),
  skills:       40 + Math.round(Math.sin(i * 0.5 + 1) * 8 + i * 0.5),
  services:     30 + Math.round(Math.sin(i * 0.3 + 2) * 6),
  blog:         20 + Math.round(Math.sin(i * 0.6) * 5 + i * 0.3),
  achievements: 10 + Math.round(Math.sin(i * 0.7) * 3),
}));

const trafficData = Array.from({ length: 31 }, (_, i) => ({
  day: [0, 7, 14, 21, 30].includes(i)
    ? ["May 1","May 8","May 15","May 22","May 31"][[0,7,14,21,30].indexOf(i)]
    : "",
  visits: 300 + Math.round(Math.sin(i * 0.4) * 150 + i * 18),
}));

function mayDate(i) {
  return new Date(2026, 4, i + 1).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function loadXLSX() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) return resolve(window.XLSX);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js";
    script.onload  = () => resolve(window.XLSX);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
async function generateTrafficReport(trafficData) {
  const XLSX = await loadXLSX();
  const totalVisits = trafficData.reduce((a, b) => a + b.visits, 0);
  const avgVisits   = Math.round(totalVisits / trafficData.length);
  const summaryRows = [
    { "Metric": "Total Visits",  "Value": totalVisits },
    { "Metric": "Daily Average", "Value": avgVisits   },
    { "Metric": "Peak Day",      "Value": Math.max(...trafficData.map(d => d.visits)) },
    { "Metric": "Lowest Day",    "Value": Math.min(...trafficData.map(d => d.visits)) },
  ];
  const dailyRows = trafficData.map((d, i) => ({ "#": i + 1, "Date": mayDate(i), "Visits": d.visits }));
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(summaryRows); ws1["!cols"] = [{ wch: 20 }, { wch: 14 }];
  const ws2 = XLSX.utils.json_to_sheet(dailyRows);   ws2["!cols"] = [{ wch: 6  }, { wch: 14 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, ws1, "Monthly Summary");
  XLSX.utils.book_append_sheet(wb, ws2, "Daily Traffic");
  XLSX.writeFile(wb, "Traffic_Overview_May2026.xlsx");
}
async function generateOverviewReport(counts, overviewData, donutData) {
  const XLSX = await loadXLSX();
  const total = donutData.reduce((a, b) => a + b.value, 0);
  const summaryRows = donutData.map(d => ({ "Category": d.name, "Count": d.value, "Share %": +((d.value / total) * 100).toFixed(1) }));
  const dailyRows   = overviewData.map((d, i) => ({ "Date": mayDate(i), "Projects": d.projects, "Skills": d.skills, "Services": d.services, "Blog": d.blog, "Achievements": d.achievements }));
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(summaryRows);
  const ws2 = XLSX.utils.json_to_sheet(dailyRows);
  XLSX.utils.book_append_sheet(wb, ws1, "Content Summary");
  XLSX.utils.book_append_sheet(wb, ws2, "Daily Analytics");
  XLSX.writeFile(wb, "Overview_Analytics_May2026.xlsx");
}
function Sk({ h = "h-4", w = "w-full", extra = "" }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${h} ${w} ${extra}`} />;
}
function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}
function StatCard({ label, count, pct, color, Icon, loading, compact = false }) {
  const data = spark(count || 10);
  if (compact) {
    /* xs/sm: compact horizontal strip */
    return (
      <div
        className="bg-white dark:bg-gray-900 rounded-xl px-4 py-3 flex items-center gap-3
                   shadow border border-gray-100 dark:border-gray-800
                   hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: color + "18", color }}
        >
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 leading-none mb-1 truncate">{label}</p>
          {loading
            ? <Sk h="h-6" w="w-12" />
            : <p className="text-xl font-extrabold text-gray-900 dark:text-gray-50 leading-none">{count ?? 0}</p>
          }
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[10px] font-extrabold text-green-600 dark:text-green-500">↑{pct}%</span>
        </div>
      </div>
    );
  }
  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl p-5 flex flex-col gap-3
                 shadow-lg hover:shadow-xl border-2 border-gray-100 dark:border-gray-800
                 hover:border-gray-200 dark:hover:border-gray-700
                 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1.5 truncate">{label}</p>
          {loading
            ? <Sk h="h-9" w="w-16" />
            : <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 leading-none">{count ?? 0}</p>
          }
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                     shadow group-hover:shadow-md transition-all duration-300 group-hover:scale-110"
          style={{ background: color + "20", color }}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <span className="text-xs font-extrabold text-green-600 dark:text-green-500">↑ {pct}%</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
        <div className="ml-auto w-20 h-7">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
function SectionHeader({ title, badge, onBadgeClick, badgeHref }) {
  const handleClick = () => {
    if (badgeHref) window.location.href = badgeHref;
    else if (onBadgeClick) onBadgeClick();
  };
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-1 h-5 rounded-full" style={{ background: P }} />
        <h2 className="text-sm font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider">{title}</h2>
      </div>
      {badge && (
        <button
          onClick={handleClick}
          className="text-[11px] font-bold px-3 py-1 rounded-full
                     bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                     text-gray-600 dark:text-gray-400 flex items-center gap-1
                     hover:border-green-500 dark:hover:border-green-500
                     hover:text-green-700 dark:hover:text-green-400
                     hover:bg-green-50 dark:hover:bg-green-950
                     cursor-pointer transition-all duration-200 select-none"
        >
          {badge.includes("Month") && <Download size={10} strokeWidth={3} />}
          {badge} →
        </button>
      )}
    </div>
  );
}
const TYPE_STYLE = {
  Project:     { bg: "#EEF6F2", text: "#0C4733", border: "#C8E6D7" },
  Skill:       { bg: "#E1F5EE", text: "#0F6E56", border: "#B3E5D4" },
  Service:     { bg: "#E6F1FB", text: "#185FA5", border: "#C1DFF5" },
  Blog:        { bg: "#FAEEDA", text: "#854F0B", border: "#F5D9A8" },
  Achievement: { bg: "#FBEAF0", text: "#993556", border: "#F5CAD9" },
};
const TYPE_ICON_MAP = { Project: FolderKanban, Skill: Lightbulb, Service: Briefcase, Blog: FileText, Achievement: Trophy };
function RecentRow({ name, type, time, loading }) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <Sk h="h-8" w="w-8" extra="rounded-lg flex-shrink-0" />
        <Sk h="h-4" w="w-40" />
        <div className="ml-auto"><Sk h="h-5" w="w-16" extra="rounded-full" /></div>
      </div>
    );
  }
  const s = TYPE_STYLE[type] || TYPE_STYLE.Project;
  const IconC = TYPE_ICON_MAP[type] || FolderKanban;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0
                    group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 rounded-lg transition-all duration-200">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200 group-hover:scale-105"
        style={{ color: s.text, backgroundColor: s.bg, borderColor: s.border }}
      >
        <IconC size={14} strokeWidth={2.5} />
      </div>
      <span className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-300 truncate
                       group-hover:text-green-800 dark:group-hover:text-green-400 transition-colors min-w-0">
        {name}
      </span>
      <span
        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 border whitespace-nowrap hidden sm:inline-flex"
        style={{ background: s.bg, color: s.text, borderColor: s.border }}
      >{type}</span>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">{time}</span>
    </div>
  );
}
function SkillBar({ name, level = 75, loading }) {
  if (loading) {
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1.5"><Sk h="h-3.5" w="w-24" /><Sk h="h-3.5" w="w-8" /></div>
        <Sk h="h-2" w="w-full" extra="rounded-full" />
      </div>
    );
  }
  return (
    <div className="mb-4 group">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate pr-2">{name}</span>
        <span className="text-sm font-extrabold flex-shrink-0" style={{ color: P }}>{level}%</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${level}%`, background: `linear-gradient(90deg, ${PA}, ${P})` }}
        />
      </div>
    </div>
  );
}
function DonutLabel({ viewBox, total }) {
  const { cx, cy } = viewBox || {};
  return (
    <>
      <text x={cx} y={cy - 5} textAnchor="middle" style={{ fontSize: 24, fontWeight: 800, fill: "#111827" }}>{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontSize: 10, fontWeight: 600, fill: "#6b7280" }}>Total Items</text>
    </>
  );
}
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl px-3 py-2.5 text-xs max-w-[180px]">
      {label && <p className="font-bold text-gray-700 dark:text-gray-300 mb-1.5 truncate">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="capitalize text-gray-600 dark:text-gray-300">{p.name}:</span>
          <span className="font-extrabold text-gray-900 dark:text-gray-50 ml-auto pl-1">{p.value}</span>
        </div>
      ))}
    </div>
  );
};
function TabNav({ tabs, active, onChange }) {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-5 gap-1">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 truncate
            ${active === t.key
              ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 shadow"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
        >
          <t.Icon size={13} strokeWidth={2.5} className="flex-shrink-0" />
          <span className="truncate hidden xs:inline sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function MainDashboardPage() {
  const dispatch = useDispatch();
  const width    = useWindowWidth();
  const [activeTab, setActiveTab] = useState("recent");
  const [mobileChartTab, setMobileChartTab] = useState("overview");
  const isMobile  = width < 640;
  const isTablet  = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;
  const { projects,         loading: lp  } = useSelector((s) => s.projects);
  const { skills,           loading: ls  } = useSelector((s) => s.skills);
  const { services,         loading: lsv } = useSelector((s) => s.services);
  const { achievements,     loading: la  } = useSelector((s) => s.achievements);
  const { blogs: blogPosts, loading: lb  } = useSelector((s) => s.blogs);
  const loading = lp || ls || lsv || la || lb;

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchSkills());
    dispatch(fetchServices());
    dispatch(fetchAchievements());
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const counts = useMemo(() => ({
    projects:     projects?.length     ?? 0,
    skills:       skills?.length       ?? 0,
    services:     services?.length     ?? 0,
    achievements: achievements?.length ?? 0,
    blogPosts:    blogPosts?.length    ?? 0,
  }), [projects, skills, services, achievements, blogPosts]);

  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0) || 79;

  const donutData = [
    { name: "Projects",     value: counts.projects     || 24, color: COLORS.projects     },
    { name: "Skills",       value: counts.skills       || 18, color: COLORS.skills       },
    { name: "Services",     value: counts.services     || 12, color: COLORS.services     },
    { name: "Blog Posts",   value: counts.blogPosts    || 16, color: COLORS.blog         },
    { name: "Achievements", value: counts.achievements ||  9, color: COLORS.achievements },
  ];

  const topSkills = useMemo(() => {
    const base = [
      { name: "JavaScript",   level: 90 },
      { name: "React.js",     level: 85 },
      { name: "Node.js",      level: 75 },
      { name: "UI/UX Design", level: 70 },
      { name: "TypeScript",   level: 65 },
    ];
    if (!skills?.length) return base;
    return skills.slice(0, 5).map((s, i) => ({
      name:  s.name || s.title || `Skill ${i + 1}`,
      level: s.level ?? s.proficiency ?? (90 - i * 5),
    }));
  }, [skills]);
  const recentItems = useMemo(() => {
    const merge = (arr, type) =>
      (arr || []).slice(0, 2).map((x) => ({
        name: x.title || x.name || "Untitled",
        type,
        time: x.createdAt
          ? new Date(x.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
          : "—",
      }));
    const all = [
      ...merge(projects,     "Project"),
      ...merge(skills,       "Skill"),
      ...merge(services,     "Service"),
      ...merge(blogPosts,    "Blog"),
      ...merge(achievements, "Achievement"),
    ];
    if (!all.length) return [
      { name: "Personal Portfolio Website", type: "Project",     time: "May 23" },
      { name: "React.js",                   type: "Skill",       time: "May 23" },
      { name: "Web Development",            type: "Service",     time: "May 22" },
      { name: "Why UI/UX Matters",          type: "Blog",        time: "May 21" },
      { name: "Best Developer Award 2024",  type: "Achievement", time: "May 20" },
    ];
    return all.slice(0, 5);
  }, [projects, skills, services, achievements, blogPosts]);

  const STAT_CARDS = [
    { label: "Projects",     key: "projects",     fallback: 24, pct: 12.5, color: COLORS.projects,     Icon: FolderKanban },
    { label: "Skills",       key: "skills",       fallback: 18, pct:  8.3, color: COLORS.skills,       Icon: Lightbulb    },
    { label: "Services",     key: "services",     fallback: 12, pct: 10.2, color: COLORS.services,     Icon: Briefcase    },
    { label: "Blog Posts",   key: "blogPosts",    fallback: 16, pct: 14.7, color: COLORS.blog,         Icon: FileText     },
    { label: "Achievements", key: "achievements", fallback:  9, pct: 15.3, color: COLORS.achievements, Icon: Trophy       },
  ];

  const bottomTabs = [
    { key: "recent",   label: "Recent",  Icon: TrendingUp  },
    { key: "skills",   label: "Skills",  Icon: Lightbulb   },
    { key: "traffic",  label: "Traffic", Icon: TrendingUp  },
  ];
  const chartH = isMobile ? 200 : isTablet ? 220 : 240;

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-5 lg:p-6 transition-colors duration-300">
      <div className={`
        grid gap-3 mb-5
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-5
      `}>
        {STAT_CARDS.map(({ label, key, fallback, pct, color, Icon }) => (
          <StatCard
            key={key}
            label={label}
            count={counts[key] || fallback}
            pct={pct}
            color={color}
            Icon={Icon}
            loading={loading}
            compact={isMobile}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Overview Analytics */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6
                        shadow-xl border-2 border-gray-100 dark:border-gray-800
                        hover:shadow-2xl transition-all duration-300">
          <SectionHeader
            title="Overview Analytics"
            badge="This Month"
            onBadgeClick={() => generateOverviewReport(counts, overviewData, donutData)}
          />
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            {Object.entries(COLORS).map(([k, c]) => (
              <div key={k} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-semibold capitalize">
                <span className="w-2.5 h-2.5 rounded-full inline-block border border-white dark:border-gray-900" style={{ background: c }} />
                {k === "blog" ? "Blog" : k}
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={chartH}>
            <LineChart data={overviewData} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.8} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: isMobile ? 9 : 11, fill: "#6b7280", fontWeight: 600 }}
                tickLine={false} axisLine={false} interval={0}
              />
              <YAxis
                tick={{ fontSize: isMobile ? 9 : 11, fill: "#6b7280", fontWeight: 600 }}
                tickLine={false} axisLine={false}
                domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]}
                width={28}
              />
              <Tooltip content={<ChartTooltip />} />
              {Object.entries(COLORS).map(([k, c]) => (
                <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={isMobile ? 2 : 3} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content Summary / Donut */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6
                        shadow-xl border-2 border-gray-100 dark:border-gray-800
                        hover:shadow-2xl transition-all duration-300">
          <SectionHeader title="Content Summary" />

          {/* On mobile show donut smaller, on tablet+ normal */}
          <div className={`flex ${isMobile ? "flex-row items-center gap-4" : "flex-col"}`}>
            <ResponsiveContainer width={isMobile ? "45%" : "100%"} height={isMobile ? 140 : 180}>
              <PieChart>
                <Pie
                  data={donutData} cx="50%" cy="50%"
                  innerRadius={isMobile ? 38 : 55}
                  outerRadius={isMobile ? 58 : 82}
                  paddingAngle={4} dataKey="value" labelLine={false}
                >
                  {donutData.map((d, i) => <Cell key={i} fill={d.color} stroke="#fff" strokeWidth={2} />)}
                  <DonutLabel total={totalItems} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend list */}
            <div className={`${isMobile ? "flex-1" : "mt-3 pt-3 border-t border-gray-100 dark:border-gray-800"} space-y-2`}>
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs
                                              hover:bg-gray-50 dark:hover:bg-gray-800/50
                                              -mx-1 px-1 py-1 rounded transition-all duration-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white dark:border-gray-900" style={{ background: d.color }} />
                    <span className="text-gray-700 dark:text-gray-300 font-semibold truncate">{d.name}</span>
                  </div>
                  <span className="font-extrabold text-gray-900 dark:text-gray-50 pl-2 flex-shrink-0">
                    {d.value}
                    <span className="font-normal text-gray-500 dark:text-gray-400 text-[10px] ml-0.5">
                      ({totalItems ? ((d.value / totalItems) * 100).toFixed(0) : 0}%)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isMobile && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border-2 border-gray-100 dark:border-gray-800">
          <TabNav tabs={bottomTabs} active={activeTab} onChange={setActiveTab} />

          {activeTab === "recent" && (
            <>
              <SectionHeader title="Recent Items" />
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <RecentRow key={i} loading />)
                : recentItems.map((item, i) => <RecentRow key={i} {...item} />)
              }
            </>
          )}

          {activeTab === "skills" && (
            <>
              <SectionHeader title="Top Skills" badge="View All" badgeHref="/dashboard/skills" />
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkillBar key={i} loading />)
                : topSkills.map((s, i) => <SkillBar key={i} name={s.name} level={s.level} />)
              }
            </>
          )}

          {activeTab === "traffic" && (
            <>
              <SectionHeader title="Traffic Overview" badge="Export" onBadgeClick={() => generateTrafficReport(trafficData)} />
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trafficData} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tgm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={P} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={P} stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.8} />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#6b7280", fontWeight: 600 }} tickLine={false} axisLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 9, fill: "#6b7280", fontWeight: 600 }} tickLine={false} axisLine={false} domain={[0,1000]} ticks={[0,200,400,600,800,1000]} width={28} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="visits" stroke={P} strokeWidth={2} fill="url(#tgm)"
                    dot={false} activeDot={{ r: 5, fill: PA, strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      )}
      {isTablet && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
              <SectionHeader title="Recent Items" />
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <RecentRow key={i} loading />)
                : recentItems.map((item, i) => <RecentRow key={i} {...item} />)
              }
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
              <SectionHeader title="Top Skills" badge="View All" badgeHref="/dashboard/skills" />
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkillBar key={i} loading />)
                : topSkills.map((s, i) => <SkillBar key={i} name={s.name} level={s.level} />)
              }
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
            <SectionHeader title="Traffic Overview" badge="This Month" onBadgeClick={() => generateTrafficReport(trafficData)} />
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trafficData} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="tgt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={P} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={P} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.8} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 600 }} tickLine={false} axisLine={false} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 600 }} tickLine={false} axisLine={false} domain={[0,1000]} ticks={[0,200,400,600,800,1000]} width={30} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="visits" stroke={P} strokeWidth={3} fill="url(#tgt)"
                  dot={false} activeDot={{ r: 6, fill: PA, strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              {[
                { label: "Total Visits", value: trafficData.reduce((a,b)=>a+b.visits,0).toLocaleString() },
                { label: "Daily Avg",    value: Math.round(trafficData.reduce((a,b)=>a+b.visits,0)/trafficData.length).toLocaleString() },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-lg font-extrabold text-gray-900 dark:text-gray-50">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {isDesktop && (
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
            <SectionHeader title="Recent Items" />
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <RecentRow key={i} loading />)
              : recentItems.map((item, i) => <RecentRow key={i} {...item} />)
            }
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
            <SectionHeader title="Top Skills" badge="View All" badgeHref="/dashboard/skills" />
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkillBar key={i} loading />)
              : topSkills.map((s, i) => <SkillBar key={i} name={s.name} level={s.level} />)
            }
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
            <SectionHeader title="Traffic Overview" badge="This Month" onBadgeClick={() => generateTrafficReport(trafficData)} />
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trafficData} margin={{ left: -10, right: 4, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="tgd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={P} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={P} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.8} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} tickLine={false} axisLine={false} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} tickLine={false} axisLine={false} domain={[0,1000]} ticks={[0,200,400,600,800,1000]} width={32} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="visits" stroke={P} strokeWidth={3} fill="url(#tgd)"
                  dot={{ r: 4, fill: P, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: PA, strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}
    </div>
  );
}