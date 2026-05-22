import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiHome,
  HiUser,
  HiCode,
  HiFolderOpen,
  HiBriefcase,
  HiDocumentText,
  HiMail,
} from "react-icons/hi";


const navItems = [
  { name: "Home", icon: HiHome, path: "/", id: "home" },
  { name: "About", icon: HiUser, path: "/about", id: "about" },
  { name: "Skills", icon: HiCode, path: "/skills", id: "skills" },
  { name: "Services", icon: HiFolderOpen, path: "/services", id: "services" },
  { name: "Work", icon: HiBriefcase, path: "/work", id: "work" },
  { name: "Blog", icon: HiDocumentText, path: "/blog", id: "blogs" },
];

export default function SideNavigation() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
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
        <NavItems open={open} activeSection={activeSection} />
      </motion.aside>

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
        <NavItems open={false} activeSection={activeSection} />
      </aside>

      <nav
        className="
          md:hidden
          fixed bottom-4 inset-x-0 z-50
          flex justify-center
          px-2
        "
      >
        <div
          className="
            bg-black/80 backdrop-blur-xl
            border border-white/10 shadow-2xl
            rounded-full
            px-4 py-2
            flex items-center gap-3
            max-w-[95vw]
            overflow-hidden
          "
        >
          {navItems.map(({ icon: Icon, id,path }) => (
            <NavLink
              key={id}
              to={path}
              onClick={() =>
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`p-3 rounded-full transition 
                ${
                  activeSection === id
                    ? "bg-white/20 text-white"
                    : "text-white/40 hover:text-white"
                }`}
            >
              <Icon size={20} />
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

function NavItems({ open, activeSection }) {
  return (
    
    <nav className="flex flex-col gap-1 w-full px-2">
      {navItems.map(({ name, icon: Icon, id,path }) => (
        <NavLink
          key={id}
          to={path}
          onClick={() => {
            // e.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
          }}
          className={`flex items-center gap-4 px-3 py-3 rounded-full font-JetBrainsMono
            transition-all duration-300
            ${
              activeSection === id
                ? "bg-white/15 text-white shadow-inner"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
        >
          <Icon size={20} className="min-w-[20px]" />

          {open && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium whitespace-nowrap"
            >
              {name}
            </motion.span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
