import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux-store/store/store.js";
import "./index.css";

// Layouts
import App from "./App.jsx";
import AdminDashboard from "./Components/Dashboard/Admin/AdminDashboard.jsx";

// Public Pages
import HomeSection from "./Components/Home/HomeSection.jsx";
import ProjectSection from "./Components/Project/ProjectSection.jsx";
import ViewWork from "./Components/Project/ViewWork.jsx";
import AboutSection from "./Components/About/AboutSection.jsx";
import SkillsSection from "./Components/Skills/SkillSection.jsx";
import BlogSection from "./Components/Blog/BlogSection.jsx";
import ViewSingleBlog from "./Components/Blog/ViewSingleBlog.jsx";
import ViewAllBlog from "./Components/Blog/ViewAllBlog.jsx";
import GallerySection from "./Components/Gallery/GallerySection.jsx";

// Dashboard Pages
import MainDashboardPage from "./Components/Dashboard/Pages/MainDashboardPage.jsx";
import ProjectsPage from "./Components/Dashboard/Pages/ProjectPage.jsx";
import BlogsPage from "./Components/Dashboard/Pages/DashboardBlog/BlogsPage.jsx";
import ServicesPage from "./Components/Dashboard/Pages/ServicesPage.jsx";
import EducationPage from "./Components/Dashboard/Pages/EducationPage.jsx";
import SkillsPage from "./Components/Dashboard/Pages/SkillsPage.jsx";
import AchievementPage from "./Components/Dashboard/Pages/AchievementPage.jsx";

// Guards
import ProtectedRoute from "./Components/Dashboard/Auth/RoleGuard.jsx";
import ThemeProvider from "./Components/Dashboard/Admin/ThemeProvider.jsx";

import UserManagement from "./Components/Dashboard/Auth/UserManagemnt.jsx";
import ForgotPassword from "./Components/Dashboard/Auth/ForgotPassword.jsx";
import Register from "./Components/Dashboard/Auth/Register.jsx";
import Login from "./Components/Dashboard/Auth/Login.jsx";
import AboutPage from "./Components/Dashboard/Pages/AboutPage.jsx";
import BookACall from "./Components/Project/BookACall.jsx";
import BookingPage from "./Components/BokingPage/BookingPage.jsx";
import AllBlog from "./Components/Dashboard/Pages/DashboardBlog/AllBlog.jsx";
import BookCallNotify from "./Components/Dashboard/Pages/BookCallNotify.jsx";
import Terms from "./Components/other/Terms.jsx";
import PrivacyPolicy from "./Components/other/PrivacyPolicy.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomeSection /> },
      { path: "work", element: <ProjectSection /> },
      { path: "view-work/:id", element: <ViewWork /> },
      { path: "services", element: <SkillsSection /> }, //chage element
      { path: "about", element: <AboutSection /> },
      { path: "skills", element: <SkillsSection /> },
      { path: "blog", element: <BlogSection /> },
      { path: "view-blog/:id", element: <ViewSingleBlog /> },
      { path: "view-blog/all", element: <ViewAllBlog /> },
      { path: "gallery", element: <GallerySection /> },
      { path: "book-a-call", element: <BookACall /> },
      { path: "book-discovery-call", element: <BookingPage /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms-of-use", element: <Terms /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <MainDashboardPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "blogs", element: <BlogsPage /> },
      { path: "writing-blogs", element: <AllBlog /> },
      { path: "about", element: <AboutPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "education", element: <EducationPage /> },
      { path: "skills", element: <SkillsPage /> },
      { path: "achievements", element: <AchievementPage /> },
      { path: "book-call-notifications", element: <BookCallNotify /> },
      {
        path: "users",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </Provider>,
);
