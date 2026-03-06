import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { LearningPathPage } from "./pages/LearningPathPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { ProgressPage } from "./pages/ProgressPage";
import { AssessmentsPage } from "./pages/AssessmentsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/login", Component: LoginPage },
  { path: "/signup", Component: SignupPage },
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
]);
