import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { OnboardingModal } from "../features/OnboardingModal";
import { getProfile } from "../../../services/userService";

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

  // ── Onboarding gate ──────────────────────────────────────────────────────
  // null = still loading (don't flash the modal before we know the status)
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkOnboarding() {
      const res = await getProfile();
      if (res.success) {
        // Show modal only when profile exists but onboarding not yet completed,
        // or when no profile row exists yet (onboarding_completed defaults to false)
        setShowOnboarding(res.data.onboarding_completed !== true);
      } else {
        // API error — fail open so existing users are never blocked
        setShowOnboarding(false);
      }
    }
    checkOnboarding();
  }, []);

  // Prevent flash: render nothing until we know the onboarding status
  if (showOnboarding === null) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Blocking onboarding modal — only rendered once we know status */}
      {showOnboarding === true && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}
