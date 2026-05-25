import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Layers,
  GraduationCap,
  Trophy,
  Zap,
  X,
  ChevronLeft,
  LogOut,
  Info,
  CalendarCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../redux-store/hooks";
import {
  toggleSidebar,
  setSidebarOpen,
} from "../../../redux-store/ColorUiSlice";
import { logoutThunk } from "../../../redux-store/authSlice";

const menu = [
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

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen flex flex-col
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-700
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-20"}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          {sidebarOpen && (
            <div className="flex items-center gap-2.5">
              <div
                className="w-1.5 h-7 rounded-full"
                style={{ background: "var(--edu-primary)" }}
              />
              <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                Admin Panel
              </span>
            </div>
          )}

          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition ml-auto"
          >
            <X
              size={18}
              className="md:hidden text-gray-500 dark:text-gray-400"
            />
            <ChevronLeft
              size={18}
              className={`
                hidden md:block text-gray-500 dark:text-gray-400
                transition-transform duration-300
                ${!sidebarOpen ? "rotate-180" : ""}
              `}
            />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menu.map(({ name, path, icon: Icon, end }) => (
            <li key={path} className="relative group list-none">
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm
                  ${sidebarOpen ? "px-3" : "justify-center px-0"}
                  ${
                    isActive
                      ? "text-white shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`
                }
                style={({ isActive }) =>
                  isActive ? { background: "var(--edu-primary)" } : {}
                }
              >
                <Icon size={19} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{name}</span>}
              </NavLink>

              {!sidebarOpen && (
                <div
                  className="
                    absolute left-full top-1/2 -translate-y-1/2 ml-3
                    px-3 py-1.5 text-sm font-medium
                    bg-gray-900 dark:bg-white
                    text-white dark:text-gray-900
                    rounded-lg shadow-xl
                    opacity-0 scale-95 invisible
                    group-hover:opacity-100 group-hover:visible group-hover:scale-100
                    transition-all duration-200 whitespace-nowrap z-50
                  "
                >
                  {name}
                  <div className="absolute top-1/2 -left-1 w-2 h-2 bg-gray-900 dark:bg-white rotate-45 -translate-y-1/2" />
                </div>
              )}
            </li>
          ))}
        </nav>

        <div
          className="mx-4 mb-2 h-px"
          style={{ background: "var(--edu-light)" }}
        />

        <div className="p-3 pb-2 flex-shrink-0">
          {sidebarOpen ? (
            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: "var(--edu-light)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
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
          ) : (
            <div className="flex justify-center">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ background: "var(--edu-primary)" }}
              >
                {user?.firstName?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 pb-4 flex-shrink-0">
          <li className="relative group list-none">
            <button
              onClick={handleLogout}
              disabled={loading}
              className={`
                  cursor-pointer
                flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm w-full
                ${sidebarOpen ? "px-3" : "justify-center px-0"}
                text-gray-600 dark:text-gray-400 
                hover:text-[var(--edu-primary)]
                hover:bg-[var(--edu-light)]
                dark:hover:bg-gray-800
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <LogOut size={19} className="flex-shrink-0" />
              {sidebarOpen && <span className="truncate">Logout</span>}
            </button>

            {!sidebarOpen && (
              <div
                className="
              
                  absolute left-full top-1/2 -translate-y-1/2 ml-3
                  px-3 py-1.5 text-sm font-medium
                  bg-gray-900 dark:bg-white
                  text-white dark:text-gray-900
                  rounded-lg shadow-xl
                  opacity-0 scale-95 invisible
                  group-hover:opacity-100 group-hover:visible group-hover:scale-100
                  transition-all duration-200 whitespace-nowrap z-50
                "
              >
                Logout
                <div className="absolute top-1/2 -left-1 w-2 h-2 bg-gray-900 dark:bg-white rotate-45 -translate-y-1/2" />
              </div>
            )}
          </li>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
