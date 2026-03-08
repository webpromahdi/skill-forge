// ─── RootLayout ─────────────────────────────────────────────────────────────
// Top-level layout route that wraps the entire application in AuthProvider.
// This ensures every page — public or protected — can access the auth state
// via the useAuth() hook.
//
// Because this is a route-level component, react-router's context (and
// therefore useNavigate) is available inside AuthProvider.

import { Outlet } from "react-router";
import { AuthProvider } from "../../../contexts/AuthContext";
import { Toaster } from "../ui/sonner";

export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
