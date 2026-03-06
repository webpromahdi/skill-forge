import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LearningPathPage } from "./pages/LearningPathPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { ProgressPage } from "./pages/ProgressPage";
import { AssessmentsPage } from "./pages/AssessmentsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { SettingsPage } from "./pages/SettingsPage";

// ─── Route Configuration ────────────────────────────────────────────────────
// RootLayout wraps the entire app with AuthProvider so every route —
// public or protected — has access to the global auth state via useAuth().
//
// Public routes: /, /login, /signup  — render regardless of auth state.
// Protected routes: /dashboard/**   — wrapped by ProtectedRoute which
//   checks the user from AuthContext; redirects to /login if not logged in.
export const router = createBrowserRouter([
  {
    // ── Root layout — provides AuthContext to the entire app ──
    Component: RootLayout,
    children: [
      { path: "/", Component: LandingPage },
      { path: "/login", Component: LoginPage },
      { path: "/signup", Component: SignupPage },
      {
        // ── Auth guard — redirects to /login when user is not authenticated ──
        Component: ProtectedRoute,
        children: [
          {
            path: "/dashboard",
            Component: DashboardLayout,
            children: [
              { index: true, Component: DashboardPage },
              { path: "learning-path", Component: LearningPathPage },
              { path: "recommendations", Component: RecommendationsPage },
              { path: "progress", Component: ProgressPage },
              { path: "assessments", Component: AssessmentsPage },
              { path: "resources", Component: ResourcesPage },
              { path: "settings", Component: SettingsPage },
            ],
          },
        ],
      },
    ],
  },
]);
