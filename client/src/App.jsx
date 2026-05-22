

import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import NavigationBar from "./Components/Navigation/NavigationBar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import AppLoader from "./Components/Loader/Loader.jsx";

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (isAppLoading) {
      document.body.classList.add('loading');
    } else {
      document.body.classList.remove('loading');
    }
  }, [isAppLoading]);

  const hideLayoutRoutes = [
    "/admin/login",
    "/admin/register",
    "/book-discovery-call",
    "/view-blog",
  ];

  const hideStaticLayout = hideLayoutRoutes.includes(location.pathname);
  const hideDynamicLayout =
    location.pathname.startsWith("/view-work/") ||
    location.pathname.startsWith("/view-blog/") ||   
    location.pathname.startsWith("/view-blog/all/");

  const hideLayout = hideStaticLayout || hideDynamicLayout;

  if (isAppLoading) {
    return <AppLoader onLoadComplete={() => setIsAppLoading(false)} />;
  }

  return (
    <>
      {!hideLayout && <NavigationBar />}
      <Outlet />
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;