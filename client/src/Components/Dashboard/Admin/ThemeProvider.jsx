// Components/ThemeProvider.jsx
import { useEffect } from "react";
import { useAppSelector } from "../../../redux-store/hooks";

const ThemeProvider = ({ children }) => {
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  useEffect(() => {
    // Apply dark class to HTML element
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return <>{children}</>;
};

export default ThemeProvider;