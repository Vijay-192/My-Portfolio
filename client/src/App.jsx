import { Outlet, useLocation, useNavigate, ScrollRestoration } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import NavigationBar from "./Components/Navigation/NavigationBar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import AppLoader from "./Components/Loader/Loader.jsx";
import PageTransition from "./Components/animate-ui/PageTransition.jsx";
import ScrollIndicator from "./Components/animate-ui/ScrollIndicator.jsx";

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const location                        = useLocation();
  const navigate                        = useNavigate();
  const pendingPath                     = useRef(location.pathname + location.search);

  useEffect(() => {
    if (!isAppLoading) return;
    pendingPath.current = location.pathname + location.search;
    navigate("/", { replace: true });
  }, [location.pathname, location.search]);

  useEffect(() => {
    const body = document.body;
    if (isAppLoading) {
      const scrollY        = window.scrollY;
      body.style.overflow  = "hidden";
      body.style.position  = "fixed";
      body.style.top       = `-${scrollY}px`;
      body.style.width     = "100%";
      body.dataset.scrollY = scrollY;
    } else {
      const scrollY       = parseInt(body.dataset.scrollY || "0", 10);
      body.style.overflow = "";
      body.style.position = "";
      body.style.top      = "";
      body.style.width    = "";
      delete body.dataset.scrollY;
      window.scrollTo(0, scrollY);
    }
    return () => {
      body.style.overflow = "";
      body.style.position = "";
      body.style.top      = "";
      body.style.width    = "";
    };
  }, [isAppLoading]);

  const handleLoadComplete = useCallback(() => {
    setIsAppLoading(false);
    navigate(pendingPath.current, { replace: true });
  }, [navigate]);

  const hideLayoutRoutes = [
    "/admin/login",
    "/admin/register",
    "/book-discovery-call",
    "/view-blog",
    "/privacy-policy",
    "/terms-of-use",
    "gallery",
    "/contact"
  ];

  const hideStaticLayout  = hideLayoutRoutes.includes(location.pathname);
  const hideDynamicLayout =
    location.pathname.startsWith("/view-work/") ||
    location.pathname.startsWith("/view-blog/") ||
    location.pathname.startsWith("/view-blog/all/") ||
    location.pathname.startsWith("/contact") ||
    location.pathname.startsWith("/gallery");

  const hideLayout = hideStaticLayout || hideDynamicLayout;

  const isHomePage = location.pathname === "/";

  if (isAppLoading) {
    return <AppLoader onLoadComplete={handleLoadComplete} />;
  }

  return (
    <>
      <ScrollRestoration getKey={(location) => location.pathname} />
      {isHomePage && <ScrollIndicator />}
      {!hideLayout && <NavigationBar />}
      <PageTransition>
        <Outlet />
      </PageTransition>
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;