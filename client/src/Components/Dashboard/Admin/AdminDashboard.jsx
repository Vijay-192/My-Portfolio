
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../../redux-store/hooks";
import Header from "../Layout/Header";
import Sidebar from "../Layout/Sidebar";

const AdminDashboard = () => {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main
          className={`flex-1 p-4 md:p-6 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"
            }`}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;