import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiHome,
  HiUser,
  HiCode,
  HiFolderOpen,
  HiBriefcase,
  HiDocumentText,
} from "react-icons/hi";
import { Contact } from "lucide-react";

const navItems = [
  { name: "Home", icon: HiHome, path: "/", sectionId: "home" },
  { name: "About", icon: HiUser, path: "/about", sectionId: "about" },
  { name: "Skills", icon: HiCode, path: "/skills", sectionId: "skills" },
  {
    name: "Services",
    icon: HiFolderOpen,
    path: "/services",
    sectionId: "services",
  },
  { name: "Work", icon: HiBriefcase, path: "/work", sectionId: "work" },
  { name: "Blog", icon: HiDocumentText, path: "/blog", sectionId: "blogs" },
];

export default function SideNavigation() {
  const [open, setOpen] = useState(false);
  const [scrollActive, setScrollActive] = useState("home");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === "/";
  useEffect(() => {
    if (!isHome) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setScrollActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    navItems.forEach(({ sectionId }) => {
      const el = document.getElementById(sectionId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  const activeId = isHome
    ? scrollActive
    : (navItems.find(
        (item) => item.path !== "/" && pathname.startsWith(item.path),
      )?.sectionId ?? "home");

  const handleNavClick = (e, item) => {
    if (isHome) {
      e.preventDefault();
      document
        .getElementById(item.sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    } else if (item.path === "/") {
      e.preventDefault();
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(item.sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <>
      {/* Desktop — hover to expand */}
      <motion.aside
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        animate={{ width: open ? 180 : 64 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="
          hidden lg:flex
          fixed left-6 top-1/2 -translate-y-1/2 z-50
          min-h-[300px] max-h-[calc(100vh-4rem)]
          rounded-4xl
          bg-black/70 backdrop-blur-xl
          border border-white/10
          shadow-2xl
          flex-col py-4
        "
      >
        <NavItems open={open} activeId={activeId} onNavClick={handleNavClick} />
      </motion.aside>

      {/* Tablet — always collapsed */}
      <aside
        className="
          hidden md:flex lg:hidden
          fixed left-4 top-1/2 -translate-y-1/2 z-50
          w-16 min-h-[300px] max-h-[calc(100vh-4rem)]
          rounded-4xl
          bg-black/70 backdrop-blur-xl
          border border-white/10
          shadow-2xl
          flex-col py-4
        "
      >
        <NavItems
          open={false}
          activeId={activeId}
          onNavClick={handleNavClick}
        />
      </aside>

      {/* Mobile — bottom bar */}
      <nav className="md:hidden fixed bottom-4 inset-x-0 z-50 flex justify-center px-2">
        <div
          className="
          bg-black/80 backdrop-blur-xl
          border border-white/10 shadow-2xl
          rounded-full px-4 py-2
          flex items-center gap-3
          max-w-[95vw] overflow-hidden
        "
        >
          {navItems.map((item) => (
            <NavLink
              key={item.sectionId}
              to={item.path}
              onClick={(e) => handleNavClick(e, item)}
              className={`p-3 rounded-full transition
                ${
                  activeId === item.sectionId
                    ? "bg-white/20 text-white"
                    : "text-white/40 hover:text-white"
                }`}
            >
              <item.icon size={20} />
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

function NavItems({ open, activeId, onNavClick }) {
  return (
    <nav className="flex flex-col gap-1 w-full px-2">
      {navItems.map((item) => (
        <NavLink
          key={item.sectionId}
          to={item.path}
          onClick={(e) => onNavClick(e, item)}
          className={`flex items-center gap-4 px-3 py-3 rounded-full font-JetBrainsMono
            transition-all duration-300
            ${
              activeId === item.sectionId
                ? "bg-white/15 text-white shadow-inner"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
        >
          <item.icon size={20} className="min-w-[20px]" />
          {open && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium whitespace-nowrap"
            >
              {item.name}
            </motion.span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}