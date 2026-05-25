import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects }     from "../../../redux-store/Projectslice";
import { fetchSkills }       from "../../../redux-store/SkillSlice";
import { fetchServices }     from "../../../redux-store/ServiceSlice";
import { fetchAchievements } from "../../../redux-store/AchievementSlice";
import { fetchAllBlogs }     from "../../../redux-store/BlogSlice"; //chage path to fetchAllBlogs


import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { FolderKanban, Lightbulb, Briefcase, FileText, Trophy } from "lucide-react";

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
  day: [0,5,10,15,20,25,30].includes(i)
    ? ["May 1","May 6","May 11","May 16","May 21","May 26","May 31"][[0,5,10,15,20,25,30].indexOf(i)]
    : "",
  projects:     55 + Math.round(Math.sin(i * 0.4) * 12 + i * 0.8),
  skills:       40 + Math.round(Math.sin(i * 0.5 + 1) * 8 + i * 0.5),
  services:     30 + Math.round(Math.sin(i * 0.3 + 2) * 6),
  blog:         20 + Math.round(Math.sin(i * 0.6) * 5 + i * 0.3),
  achievements: 10 + Math.round(Math.sin(i * 0.7) * 3),
}));

const trafficData = Array.from({ length: 31 }, (_, i) => ({
  day: [0,7,14,21,30].includes(i)
    ? ["May 1","May 8","May 15","May 22","May 31"][[0,7,14,21,30].indexOf(i)]
    : "",
  visits: 300 + Math.round(Math.sin(i * 0.4) * 150 + i * 18),
}));
function mayDate(i) {
  return new Date(2026, 4, i + 1).toLocaleDateString("en-IN", {
    month: "short", day: "numeric",
  });
}

function loadXLSX() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) return resolve(window.XLSX);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js";
    script.onload = () => resolve(window.XLSX);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
async function generateTrafficReport(trafficData) {
  const XLSX = await loadXLSX();

  const totalVisits = trafficData.reduce((a, b) => a + b.visits, 0);
  const avgVisits   = Math.round(totalVisits / trafficData.length);
  const maxVisits   = Math.max(...trafficData.map(d => d.visits));
  const minVisits   = Math.min(...trafficData.map(d => d.visits));

  const summaryRows = [
    { "Metric": "Total Visits",  "Value": totalVisits },
    { "Metric": "Daily Average", "Value": avgVisits   },
    { "Metric": "Peak Day",      "Value": maxVisits   },
    { "Metric": "Lowest Day",    "Value": minVisits   },
  ];

  const dailyRows = trafficData.map((d, i) => ({
    "#":      i + 1,
    "Date":   mayDate(i),
    "Visits": d.visits,
  }));

  const wb = XLSX.utils.book_new();

  const ws1 = XLSX.utils.json_to_sheet(summaryRows);
  ws1["!cols"] = [{ wch: 20 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws1, "Monthly Summary");

  const ws2 = XLSX.utils.json_to_sheet(dailyRows);
  ws2["!cols"] = [{ wch: 6 }, { wch: 14 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Daily Traffic");

  XLSX.writeFile(wb, "Traffic_Overview_May2026.xlsx");
}
async function generateOverviewReport(counts, overviewData, donutData) {
  const XLSX = await loadXLSX();

  const total = donutData.reduce((a, b) => a + b.value, 0);

  const summaryRows = donutData.map(d => ({
    "Category": d.name,
    "Count":    d.value,
    "Share %":  +((d.value / total) * 100).toFixed(1),
  }));

  const dailyRows = overviewData.map((d, i) => ({
    "Date":         mayDate(i),
    "Projects":     d.projects,
    "Skills":       d.skills,
    "Services":     d.services,
    "Blog":         d.blog,
    "Achievements": d.achievements,
  }));

  const wb = XLSX.utils.book_new();

  const ws1 = XLSX.utils.json_to_sheet(summaryRows);
  ws1["!cols"] = [{ wch: 16 }, { wch: 10 }, { wch: 10 }];
  XLSX.utils.book_append_sheet(wb, ws1, "Content Summary");

  const ws2 = XLSX.utils.json_to_sheet(dailyRows);
  ws2["!cols"] = [{ wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Daily Analytics");

  XLSX.writeFile(wb, "Overview_Analytics_May2026.xlsx");
}
function Sk({ h = "h-4", w = "w-full", extra = "" }) {
  return <div className={`sk rounded-lg ${h} ${w} ${extra}`} />;
}
function StatCard({ label, count, pct, color, Icon, loading }) {
  const data = spark(count || 10);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 flex flex-col gap-4 shadow-lg hover:shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-2">{label}</p>
          {loading
            ? <Sk h="h-10" w="w-20" />
            : <p className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">{count ?? 0}</p>
          }
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110"
          style={{ background: color + "20", color }}
        >
          <Icon size={22} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        <span className="text-xs font-extrabold text-green-600 dark:text-green-500">↑ {pct}%</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
        <div className="ml-auto w-24 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
function SectionHeader({ title, badge, onBadgeClick, badgeHref }) {
  const handleClick = () => {
    if (badgeHref) {
      window.location.href = badgeHref;
    } else if (onBadgeClick) {
      onBadgeClick();
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full shadow-sm" style={{ background: P }} />
        <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wide">{title}</h2>
      </div>
      {badge && (
        <span
          onClick={handleClick}
          className="text-xs font-bold px-4 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-500 dark:hover:border-green-500 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md select-none"
        >
          {badge} →
        </span>
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

const TYPE_ICON_MAP = {
  Project: FolderKanban,
  Skill: Lightbulb,
  Service: Briefcase,
  Blog: FileText,
  Achievement: Trophy,
};

function RecentRow({ name, type, time, loading }) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 py-4 border-b-2 border-gray-100 dark:border-gray-800 last:border-0">
        <Sk h="h-6" w="w-6" extra="rounded-lg flex-shrink-0" />
        <Sk h="h-4" w="w-48" />
        <div className="ml-auto"><Sk h="h-6" w="w-20" extra="rounded-full" /></div>
      </div>
    );
  }
  const s = TYPE_STYLE[type] || TYPE_STYLE.Project;
  const IconComponent = TYPE_ICON_MAP[type] || FolderKanban;
  return (
    <div className="flex items-center gap-3 py-4 border-b-2 border-gray-100 dark:border-gray-800 last:border-0 group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 rounded-lg transition-all duration-200">
      <div
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center shadow-sm border-2 transition-all duration-200 group-hover:shadow-md group-hover:scale-105"
        style={{ color: s.text, backgroundColor: s.bg, borderColor: s.border }}
      >
        <IconComponent size={16} strokeWidth={2.5} />
      </div>
      <span className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-300 truncate group-hover:text-green-800 dark:group-hover:text-green-400 transition-colors">{name}</span>
      <span
        className="text-[11px] font-bold px-3 py-1 rounded-full flex-shrink-0 border-2 shadow-sm"
        style={{ background: s.bg, color: s.text, borderColor: s.border }}
      >{type}</span>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">{time}</span>
    </div>
  );
}
function SkillBar({ name, level = 75, loading }) {
  if (loading) {
    return (
      <div className="mb-5">
        <div className="flex justify-between mb-2"><Sk h="h-4" w="w-28" /><Sk h="h-4" w="w-10" /></div>
        <Sk h="h-2.5" w="w-full" extra="rounded-full" />
      </div>
    );
  }
  return (
    <div className="mb-5 group">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{name}</span>
        <span className="text-sm font-extrabold" style={{ color: P }}>{level}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
        <div
          className="h-full rounded-full transition-all duration-700 shadow-sm"
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
      <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontSize: 28, fontWeight: 800, fill: "#111827" }}>{total}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, fill: "#6b7280" }}>Total Items</text>
    </>
  );
}
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl px-4 py-3 text-xs">
      {label && <p className="font-bold text-gray-700 dark:text-gray-300 mb-2">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: p.color }} />
          <span className="capitalize text-gray-600 dark:text-gray-300 font-medium">{p.name}:</span>
          <span className="font-extrabold text-gray-900 dark:text-gray-50">{p.value}</span>
        </div>
      ))}
    </div>
  );
};
export default function MainDashboardPage() {
  const dispatch = useDispatch();

  const { projects,          loading: lp  } = useSelector((s) => s.projects);
  const { skills,            loading: ls  } = useSelector((s) => s.skills);
  const { services,          loading: lsv } = useSelector((s) => s.services);
  const { achievements,      loading: la  } = useSelector((s) => s.achievements);
  const { blogs: blogPosts,  loading: lb  } = useSelector((s) => s.blogs);

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
    { label: "Total Projects", key: "projects",     fallback: 24, pct: 12.5, color: COLORS.projects,     Icon: FolderKanban },
    { label: "Skills",         key: "skills",       fallback: 18, pct:  8.3, color: COLORS.skills,       Icon: Lightbulb    },
    { label: "Services",       key: "services",     fallback: 12, pct: 10.2, color: COLORS.services,     Icon: Briefcase    },
    { label: "Blog Posts",     key: "blogPosts",    fallback: 16, pct: 14.7, color: COLORS.blog,         Icon: FileText     },
    { label: "Achievements",   key: "achievements", fallback:  9, pct: 15.3, color: COLORS.achievements, Icon: Trophy       },
  ];

  return (
    <div className="min-h-screen p-6 transition-colors duration-300">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 mb-6">
        {STAT_CARDS.map(({ label, key, fallback, pct, color, Icon }) => (
          <StatCard
            key={key}
            label={label}
            count={counts[key] || fallback}
            pct={pct}
            color={color}
            Icon={Icon}
            loading={loading}
          />
        ))}
      </div>

      {/*  Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">

        {/* Overview Analytics */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
          <SectionHeader
            title="Overview Analytics"
            badge="This Month"
            onBadgeClick={() => generateOverviewReport(counts, overviewData, donutData)}
          />
          <div className="flex flex-wrap gap-x-6 gap-y-3 mb-5 pb-4 border-b-2 border-gray-100 dark:border-gray-800">
            {Object.entries(COLORS).map(([k, c]) => (
              <div key={k} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-semibold capitalize">
                <span className="w-3 h-3 rounded-full inline-block shadow-sm border-2 border-white dark:border-gray-900" style={{ background: c }} />
                {k === "blog" ? "Blog" : k}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.8} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} tickLine={false} axisLine={false} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} tickLine={false} axisLine={false} domain={[0,100]} ticks={[0,20,40,60,80,100]} />
              <Tooltip content={<ChartTooltip />} />
              {Object.entries(COLORS).map(([k, c]) => (
                <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={3} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Content Summary  */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
          <SectionHeader title="Content Summary" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%" cy="50%"
                innerRadius={58} outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                labelLine={false}
              >
                {donutData.map((d, i) => <Cell key={i} fill={d.color} stroke="#fff" strokeWidth={3} />)}
                <DonutLabel total={totalItems} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-3 pt-4 border-t-2 border-gray-100 dark:border-gray-800">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs group hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 py-1.5 rounded-lg transition-all duration-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm border-2 border-white dark:border-gray-900" style={{ background: d.color }} />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">{d.name}</span>
                </div>
                <span className="font-extrabold text-gray-900 dark:text-gray-50">
                  {d.value}&nbsp;
                  <span className="font-semibold text-gray-500 dark:text-gray-400">
                    ({totalItems ? ((d.value / totalItems) * 100).toFixed(1) : 0}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*  Bottom Row  */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* Recent Items — NO badge */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
          <SectionHeader title="Recent Items" />
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <RecentRow key={i} loading />)
            : recentItems.map((item, i) => <RecentRow key={i} {...item} />)
          }
        </div>

        {/* Top Skills */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
          <SectionHeader
            title="Top Skills"
            badge="View All"
            badgeHref="/dashboard/skills"
          />
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkillBar key={i} loading />)
            : topSkills.map((s, i) => <SkillBar key={i} name={s.name} level={s.level} />)
          }
        </div>

        {/* Traffic Overview  */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-7 shadow-xl border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-300">
          <SectionHeader
            title="Traffic Overview"
            badge="This Month"
            onBadgeClick={() => generateTrafficReport(trafficData)}
          />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={P} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={P} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.8} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} tickLine={false} axisLine={false} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 600 }} tickLine={false} axisLine={false} domain={[0,1000]} ticks={[0,200,400,600,800,1000]} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="visits"
                stroke={P}
                strokeWidth={3}
                fill="url(#tg)"
                dot={{ r: 4, fill: P, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: PA, strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}