import { NavLink, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Bell,
  Calendar,
  Clock,
  ChevronRight,
  LayoutDashboard,
  FolderKanban,
  Layers,
  GraduationCap,
  Trophy,
  Zap,
  BookOpen,
  Info,
  CalendarCheck,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../redux-store/hooks";
import { toggleDarkMode } from "../../../redux-store/themeSlice";
import { toggleSidebar } from "../../../redux-store/ColorUiSlice";
import {
  fetchAllBookings,
  selectAllBookings,
  selectListLoading,
} from "../../../redux-store/Bookingslice.js";
import { useEffect, useState, useRef, useCallback } from "react";
import sound from "../../../../public/sound/sound.mp3";
const MENU = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, end: true },
  { name: "Projects Manage", path: "/dashboard/projects", icon: FolderKanban },
  { name: "Services Manage", path: "/dashboard/services", icon: Layers },
  { name: "Skills Manage", path: "/dashboard/skills", icon: Zap },
  {
    name: "Education Manage",
    path: "/dashboard/education",
    icon: GraduationCap,
  },
  {
    name: "Achievements Manage",
    path: "/dashboard/achievements",
    icon: Trophy,
  },
  { name: "Blogs Manage", path: "/dashboard/blogs", icon: BookOpen },
  { name: "About Manage", path: "/dashboard/about", icon: Info },
  {
    name: "Book Call Notifications",
    path: "/dashboard/book-call-notifications",
    icon: CalendarCheck,
  },
];

const AVATAR_COLORS = [
  { bg: "#EEF6F2", color: "#0C4733", border: "#4E9C79" },
  { bg: "#ede9fe", color: "#5b21b6", border: "#8b5cf6" },
  { bg: "#fef3c7", color: "#92400e", border: "#f59e0b" },
  { bg: "#fce7f3", color: "#9d174d", border: "#ec4899" },
  { bg: "#dbeafe", color: "#1e3a8a", border: "#3b82f6" },
];

const STATUS_MAP = {
  confirmed: { label: "Confirmed", dot: "#16a34a" },
  pending: { label: "Pending", dot: "#d97706" },
  cancelled: { label: "Cancelled", dot: "#dc2626" },
};
const INITIALS = (f, l) => `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase();

const parseBookingDate = (dateStr, timeStr) => {
  try {
    if (!dateStr || !timeStr) return null;
    const [timePart, meridiem] = timeStr.trim().split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
    const d = new Date(dateStr);
    d.setHours(hours, minutes, 0, 0);
    return d;
  } catch {
    return null;
  }
};

const NotificationDropdown = ({ bookings, loading, onNavigate }) => {
  const now = new Date();

  const sorted = [...bookings].sort((a, b) => {
    const da = parseBookingDate(a.date, a.time);
    const db = parseBookingDate(b.date, b.time);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    const upA = da > now,
      upB = db > now;
    if (upA && !upB) return -1;
    if (!upA && upB) return 1;
    return da - db;
  });

  const preview = sorted.slice(0, 5);
  const upcomingCount = bookings.filter((b) => {
    const dt = parseBookingDate(b.date, b.time);
    return dt && dt > now;
  }).length;

  return (
    <div
      className="absolute right-0 top-full mt-2.5 w-[min(340px,calc(100vw-1.5rem))]
                 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden z-50"
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header gradient */}
      <div
        className="px-4 py-3.5 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg,#0C4733 0%,#1D9E75 100%)",
        }}
      >
        <div>
          <p className="text-white text-[13px] font-bold leading-tight">
            Booking Notifications
          </p>
          <p className="text-white/65 text-[11px] mt-0.5">
            {loading
              ? "Loading…"
              : `${bookings.length} total · ${upcomingCount} upcoming`}
          </p>
        </div>
        {upcomingCount > 0 && (
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white
                           border border-white/25 flex-shrink-0 ml-2"
          >
            {upcomingCount} upcoming
          </span>
        )}
      </div>

      {/* List */}
      <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
        {loading &&
          bookings.length === 0 &&
          [1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-28 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                <div className="h-2.5 w-36 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
              </div>
            </div>
          ))}

        {!loading && bookings.length === 0 && (
          <div className="py-10 text-center">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              No bookings yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              New bookings will appear here
            </p>
          </div>
        )}

        {preview.map((b, idx) => {
          const av = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const dt = parseBookingDate(b.date, b.time);
          const isUp = dt && dt > now;
          const st = STATUS_MAP[b.status] ?? STATUS_MAP.confirmed;
          return (
            <div
              key={b._id}
              onClick={onNavigate}
              className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors
                          hover:bg-gray-50 dark:hover:bg-gray-800/60
                          ${isUp ? "bg-[#EEF6F2]/50 dark:bg-[#0C4733]/10" : ""}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                           text-[10px] font-bold border mt-0.5"
                style={{
                  background: av.bg,
                  color: av.color,
                  borderColor: av.border,
                }}
              >
                {INITIALS(b.firstName, b.lastName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {b.firstName} {b.lastName}
                  </span>
                  {isUp && (
                    <span
                      className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5
                                     rounded-full bg-[#EEF6F2] text-[#0C4733] border border-[#C8E6D7] flex-shrink-0"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#0C4733] animate-pulse inline-block" />
                      upcoming
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: st.dot }}
                  />
                  <span>{st.label}</span>
                  <span className="text-gray-200 dark:text-gray-700">·</span>
                  <Calendar size={10} className="flex-shrink-0" />
                  <span>{b.date}</span>
                  <Clock size={10} className="flex-shrink-0" />
                  <span>{b.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {bookings.length > 0 && (
        <div
          onClick={onNavigate}
          className="px-4 py-3 flex items-center justify-between cursor-pointer
                     hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors
                     border-t border-gray-100 dark:border-gray-800 group"
        >
          <span className="text-[12px] font-semibold text-[#0C4733] dark:text-[#4E9C79]">
            View all {bookings.length} bookings
          </span>
          <ChevronRight
            size={14}
            className="text-[#0C4733] dark:text-[#4E9C79] group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      )}
    </div>
  );
};

const MobileMenuPanel = ({ open, onClose, user }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authLoading = useAppSelector((state) => state.auth.loading);
  const [visible, setVisible] = useState(open);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setLeaving(false);
    } else if (visible) {
      setLeaving(true);
      const t = setTimeout(() => setVisible(false), 240);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleLogout = async () => {
    onClose();
    await dispatch({ type: "auth/logoutThunk" });
    navigate("/login");
  };

  if (!visible) return null;

  const panelItems = MENU.filter(
    (m) =>
      ![
        "/dashboard",
        "/dashboard/projects",
        "/dashboard/services",
        "/dashboard/book-call-notifications",
      ].includes(m.path),
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`
          fixed bottom-[64px] left-0 right-0 z-[70]
          bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl
          max-h-[70vh] overflow-y-auto
          ${leaving ? "mobile-menu-leave" : "mobile-menu-enter"}
        `}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>

        <div
          className="mx-4 mt-2 mb-3 flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: "var(--edu-light)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: "var(--edu-primary)" }}
          >
            {user?.firstName?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.firstName || "Admin"} {user?.lastName || "User"}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "var(--edu-accent)" }}
            >
              {user?.email || "admin@example.com"}
            </p>
          </div>
        </div>

        <p className="px-5 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          All Sections
        </p>
        <div className="px-3 pb-3 grid grid-cols-3 gap-2">
          {panelItems.map(({ name, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all text-center
                 ${
                   isActive
                     ? "text-white shadow-md"
                     : "text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                 }`
              }
              style={({ isActive }) =>
                isActive ? { background: "var(--edu-primary)" } : {}
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="text-[10px] font-semibold leading-tight">
                {name.replace(" Manage", "")}
              </span>
            </NavLink>
          ))}
        </div>
        <div className="px-4 pb-5 pt-1">
          <div className="h-px bg-gray-100 dark:bg-gray-800 mb-3" />
          <button
            onClick={handleLogout}
            disabled={authLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl
                       text-sm font-semibold
                       text-gray-600 dark:text-gray-400
                       bg-gray-50 dark:bg-gray-800
                       hover:text-[var(--edu-primary)] hover:bg-[var(--edu-light)]
                       dark:hover:bg-gray-700
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};
const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const user = useAppSelector((state) => state.auth.user);
  const bookings = useAppSelector(selectAllBookings);
  const loading = useAppSelector(selectListLoading);

  const toggleSoundRef = useRef(null);
  const dropdownRef = useRef(null);

  const [time, setTime] = useState(new Date());
  const [dropOpen, setDropOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [hasNew, setHasNew] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);
  useEffect(() => {
    const id = setInterval(() => dispatch(fetchAllBookings()), 60_000);
    return () => clearInterval(id);
  }, [dispatch]);
  useEffect(() => {
    if (bookings.length > prevCount && prevCount !== 0) {
      setHasNew(true);
      setAnimateBell(true);
      setTimeout(() => setAnimateBell(false), 800);
    }
    setPrevCount(bookings.length);
  }, [bookings.length]);

  useEffect(() => {
    if (!dropOpen) return;
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [dropOpen]);
  useEffect(() => {
    if (!dropOpen) return;
    const fn = (e) => {
      if (e.key === "Escape") setDropOpen(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [dropOpen]);

  const handleToggleDark = () => {
    dispatch(toggleDarkMode());
    if (toggleSoundRef.current) {
      toggleSoundRef.current.currentTime = 0;
      toggleSoundRef.current.play();
    }
  };

  const handleBellClick = useCallback(() => {
    setDropOpen((p) => !p);
    setHasNew(false);
  }, []);

  const handleNotifNavigate = useCallback(() => {
    setDropOpen(false);
    navigate("/dashboard/book-call-notifications");
  }, [navigate]);

  const getISTTime = () =>
    time.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const getISTDate = () =>
    time.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const now = new Date();
  const hasUpcoming = bookings.some((b) => {
    const dt = parseBookingDate(b.date, b.time);
    return dt && dt > now;
  });
  const BellButton = ({ size = 16, btnSize = "w-9 h-9" }) => (
    <button
      onClick={handleBellClick}
      aria-label="Booking notifications"
      aria-expanded={dropOpen}
      className={`
        relative ${btnSize} rounded-xl flex items-center justify-center
        border transition-all duration-200
        ${
          dropOpen
            ? "bg-[#EEF6F2] dark:bg-[#0C4733]/30 border-[#4E9C79] text-[#0C4733] dark:text-[#4E9C79]"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[#4E9C79] hover:text-[#0C4733] hover:bg-[#EEF6F2] dark:hover:text-[#4E9C79] dark:hover:bg-[#0C4733]/20"
        }
        ${hasUpcoming && !dropOpen ? "bell-glow" : ""}
        ${animateBell ? "bell-ring" : ""}
      `}
    >
      <Bell
        size={size}
        style={{
          fill: hasUpcoming ? "currentColor" : "none",
          fillOpacity: hasUpcoming ? 0.18 : 0,
        }}
      />
      {bookings.length > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] px-[3px]
                     flex items-center justify-center rounded-full text-[9px]
                     font-extrabold text-white leading-none badge-pop"
          style={{
            background: hasNew ? "#dc2626" : "var(--edu-primary, #0C4733)",
            boxShadow: "0 0 0 2px white",
          }}
        >
          {bookings.length > 99 ? "99+" : bookings.length}
        </span>
      )}
    </button>
  );
  const DarkToggle = ({ compact = false }) => (
    <button
      onClick={handleToggleDark}
      aria-label={darkMode ? "Light mode" : "Dark mode"}
      className={`
        relative flex-shrink-0
        ${compact ? "w-10 h-[20px]" : "w-11 h-[22px] sm:w-12 sm:h-6"}
        flex items-center rounded-full p-0.5
        transition-all duration-300 border
        ${darkMode ? "border-[#0C4733]" : "bg-gray-200 border-gray-300"}
      `}
      style={darkMode ? { background: "var(--edu-primary, #0C4733)" } : {}}
    >
      <div
        className={`
          ${compact ? "w-[16px] h-[16px]" : "w-[18px] h-[18px] sm:w-5 sm:h-5"}
          bg-white rounded-full shadow-md
          flex items-center justify-center
          transition-transform duration-300
          ${
            darkMode
              ? compact
                ? "translate-x-[20px]"
                : "translate-x-[22px] sm:translate-x-6"
              : "translate-x-0"
          }
        `}
      >
        {darkMode ? (
          <Moon
            size={compact ? 9 : 10}
            style={{ color: "var(--edu-primary, #0C4733)" }}
          />
        ) : (
          <Sun size={compact ? 9 : 10} className="text-yellow-500" />
        )}
      </div>
    </button>
  );
  return (
    <>
      <audio ref={toggleSoundRef} src={sound} preload="auto" />
      <header
        className="sticky top-0 z-30
                   bg-white/95 dark:bg-gray-900/95 backdrop-blur-md
                   border-b border-gray-200 dark:border-gray-800
                   transition-all duration-300"
      >
        <div
          className="transition-all duration-300 hidden md:block"
          style={{ marginLeft: sidebarOpen ? "256px" : "80px" }}
        >
          <div className="flex items-center h-14 sm:h-16 px-3 sm:px-5 md:px-6 gap-2 sm:gap-3">
            {/* Brand */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div
                className="flex-shrink-0 w-[3px] h-6 sm:h-7 rounded-full"
                style={{ background: "var(--edu-primary, #0C4733)" }}
              />
              <div className="min-w-0">
                <h1
                  className="text-[14px] sm:text-[15px] md:text-base font-extrabold leading-none truncate capitalize"
                  style={{ color: "var(--edu-primary, #0C4733)" }}
                >
                  PMS SYSTEM
                </h1>
                <p className="hidden sm:block text-[10px] text-gray-400 dark:text-white font-medium mt-0.5 leading-none truncate tracking-wide">
                  Portfolio Management System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
              <div
                className="hidden lg:flex flex-col items-end px-3 py-1.5 rounded-xl border
                            bg-[#EEF6F2] dark:bg-[#0C4733]/25
                            border-[#C8E6D7] dark:border-[#0C4733]/50
                            text-[#0C4733] dark:text-[#4E9C79]
                            font-mono leading-tight"
              >
                <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-bold tracking-wider">
                  🇮🇳 <span>{getISTTime()}</span>
                </div>
                <div className="text-[9px] sm:text-[10px] opacity-75 mt-0.5 font-sans tracking-wide">
                  {getISTDate()}
                </div>
              </div>
              <div
                className="hidden md:flex lg:hidden items-center gap-1.5 px-2.5 py-2 rounded-xl border
                            bg-[#EEF6F2] dark:bg-[#0C4733]/25
                            border-[#C8E6D7] dark:border-[#0C4733]/50
                            text-[#0C4733] dark:text-[#4E9C79]
                            font-mono text-[12px] font-bold tracking-wide"
              >
                🇮🇳 <span>{getISTTime()}</span>
              </div>

              {/* Bell + dropdown */}
              <div className="relative" ref={dropdownRef}>
                <BellButton size={16} btnSize="w-8 h-8 sm:w-9 sm:h-9" />
                {dropOpen && (
                  <NotificationDropdown
                    bookings={bookings}
                    loading={loading}
                    onNavigate={handleNotifNavigate}
                  />
                )}
              </div>

              <DarkToggle />
            </div>
          </div>
        </div>
        <div className="flex md:hidden items-center h-14 px-3 gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className="w-[3px] h-5 rounded-full flex-shrink-0"
              style={{ background: "var(--edu-primary, #0C4733)" }}
            />
            <h1
              className="text-[14px] font-extrabold leading-none truncate capitalize"
              style={{ color: "var(--edu-primary, #0C4733)" }}
            >
              PMS SYSTEM
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <BellButton size={15} btnSize="w-8 h-8" />
              {dropOpen && (
                <div className="absolute right-0 top-full mt-2">
                  <NotificationDropdown
                    bookings={bookings}
                    loading={loading}
                    onNavigate={handleNotifNavigate}
                  />
                </div>
              )}
            </div>
            <DarkToggle compact />
          </div>
        </div>
      </header>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50
                   md:hidden
                   bg-white/95 dark:bg-gray-900/95 backdrop-blur-md
                   border-t border-gray-200 dark:border-gray-700
                   safe-area-pb"
      >
        <div className="flex items-end justify-around h-16 px-1">
          {/* Projects */}
          <NavLink
            to="/dashboard/projects"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full pt-1 pb-1 transition-all
               ${isActive ? "text-[var(--edu-primary)]" : "text-gray-400 dark:text-gray-500"}`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-[#EEF6F2] dark:bg-[#0C4733]/25" : ""}`}
                >
                  <FolderKanban size={18} />
                </div>
                <span className="text-[9px] font-semibold">Projects</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[var(--edu-primary)]" />
                )}
              </>
            )}
          </NavLink>

          {/* Services */}
          <NavLink
            to="/dashboard/services"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full pt-1 pb-1 transition-all
               ${isActive ? "text-[var(--edu-primary)]" : "text-gray-400 dark:text-gray-500"}`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-[#EEF6F2] dark:bg-[#0C4733]/25" : ""}`}
                >
                  <Layers size={18} />
                </div>
                <span className="text-[9px] font-semibold">Services</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[var(--edu-primary)]" />
                )}
              </>
            )}
          </NavLink>
          <NavLink
            to="/dashboard"
            end
            className="flex flex-col items-center justify-center flex-1 h-full -mt-4"
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg
                              transition-all duration-200 text-white
                              ${isActive ? "scale-110" : "opacity-80"}`}
                  style={{ background: "var(--edu-primary)" }}
                >
                  <LayoutDashboard size={20} />
                </div>
                <span
                  className={`text-[9px] font-bold ${
                    isActive
                      ? "text-[var(--edu-primary)]"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  Dashboard
                </span>
              </div>
            )}
          </NavLink>
          <NavLink
            to="/dashboard/book-call-notifications"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full pt-1 pb-1 transition-all
               ${isActive ? "text-[var(--edu-primary)]" : "text-gray-400 dark:text-gray-500"}`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`relative p-1.5 rounded-xl transition-all ${isActive ? "bg-[#EEF6F2] dark:bg-[#0C4733]/25" : ""}`}
                >
                  <CalendarCheck size={18} />
                  {bookings.length > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 min-w-[13px] h-[13px] px-[2px]
                                 flex items-center justify-center rounded-full text-[7px]
                                 font-extrabold text-white leading-none"
                      style={{
                        background: "var(--edu-primary)",
                        boxShadow: "0 0 0 1.5px white",
                      }}
                    >
                      {bookings.length > 9 ? "9+" : bookings.length}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-semibold">Bookings</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[var(--edu-primary)]" />
                )}
              </>
            )}
          </NavLink>

          {/* More */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full pt-1 pb-1
                        transition-all
                        ${
                          mobileMenuOpen
                            ? "text-[var(--edu-primary)]"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                mobileMenuOpen ? "bg-[#EEF6F2] dark:bg-[#0C4733]/25" : ""
              }`}
            >
              <MoreHorizontal size={18} />
            </div>
            <span className="text-[9px] font-semibold">More</span>
          </button>
        </div>
      </nav>
      <MobileMenuPanel
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
      />
    </>
  );
};

export default Header;
