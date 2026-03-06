// ─── ProtectedRoute ─────────────────────────────────────────────────────────
// Route guard that prevents unauthenticated users from accessing protected
// pages (e.g. /dashboard/**).
//
// How it works:
//   1. Read `user` and `loading` from the global AuthContext.
//   2. While the initial token verification is in-flight → show a spinner.
//   3. Once loading finishes:
//      • If `user` is set → render child routes via <Outlet />.
//      • If `user` is null → redirect to /login.
//
// AuthProvider is mounted at the RootLayout level so it wraps the entire
// app.  This component just reads from context — it does NOT create its
// own provider.

import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  // ── Loading: show spinner while GET /auth/me is in-flight ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500" style={{ fontSize: "0.875rem" }}>
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  // ── No user: redirect to login ──
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ── Authenticated: render protected child routes ──
  return <Outlet />;
}
