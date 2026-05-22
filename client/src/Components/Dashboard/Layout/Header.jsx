import { Sun, Moon, Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../redux-store/hooks";
import { toggleDarkMode } from "../../../redux-store/themeSlice";
import { toggleSidebar } from "../../../redux-store/ColorUiSlice";
import { useEffect, useState, useRef } from "react";
import sound from "../../../../public/sound/sound.mp3";

const Header = () => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  const toggleSound = useRef(null);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    dispatch(toggleDarkMode());

    if (toggleSound.current) {
      toggleSound.current.currentTime = 0;
      toggleSound.current.play();
    }
  };

  const getISTTime = () => {
    return time.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };


  const getISTDate = () => {
    return time.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">

      {/* Hidden Audio */}
      <audio ref={toggleSound} src={sound} preload="auto" />

      <div className="flex items-center justify-between h-16 px-4 md:px-6">

        {/* Sidebar Toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu size={24} className="text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex-1" />

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* 🇮🇳 CLOCK + DATE (THEME MATCHED) */}
          <div
            className="hidden md:flex flex-col items-end px-3 py-1 rounded-lg 
            bg-[var(--edu-light)] 
            dark:bg-[var(--edu-primary)]/90 dark:backdrop-blur-md
            text-[var(--edu-primary)] dark:text-white
            font-mono text-xs leading-tight shadow-sm"
          >
            {/* TIME */}
            <div className="flex items-center gap-2 text-sm tracking-wider">
              🇮🇳 <span>{getISTTime()}</span>
            </div>

            {/* DATE */}
            <div className="text-[10px] opacity-90 mt-0.5">
              {getISTDate()}
            </div>
          </div>

          {/* DARK MODE TOGGLE */}
          <button
            onClick={handleToggle}
            className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 
              ${darkMode ? "bg-[var(--edu-primary)]" : "bg-gray-300"}`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform duration-300 flex items-center justify-center
                ${darkMode ? "translate-x-7" : "translate-x-0"}`}
            >
              {darkMode ? (
                <Moon size={12} className="text-[var(--edu-primary)]" />
              ) : (
                <Sun size={12} className="text-yellow-500" />
              )}
            </div>
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;