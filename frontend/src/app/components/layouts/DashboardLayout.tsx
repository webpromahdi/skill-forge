import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/learning-path": "Learning Path",
  "/dashboard/recommendations": "Recommendations",
  "/dashboard/progress": "Progress",
  "/dashboard/assessments": "Assessments",
  "/dashboard/resources": "Resources",
  "/dashboard/settings": "Settings",
};

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
