// ─── AuthContext ─────────────────────────────────────────────────────────────
// Provides global authentication state to the entire application.
//
// Authentication flow:
//   1. On app startup the provider checks localStorage for a saved JWT.
//   2. If a token exists it calls GET /auth/me to verify it and load the user.
//      • If the token is invalid/expired the token is cleared and user stays null.
//      • If the call succeeds the user object is stored in state.
//   3. If no token exists the provider simply sets loading = false so public
//      pages (landing, login, signup) render immediately.
//   4. The login(token) function is called after a successful POST /auth/login.
//      It persists the token, fetches the user profile, and navigates to
//      /dashboard.
//   5. handleLogout() clears the token, resets user state, and redirects to
//      /login.
//
// Token storage:
//   The JWT is stored in localStorage under the key "token".  The apiFetch
//   helper (src/lib/api.ts) reads this key automatically for every request.
//
// User loading process:
//   While the initial GET /auth/me request is in-flight, `loading` is true.
//   Components should check `loading` before rendering user-dependent UI.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { getCurrentUser, type User } from "../services/userService";
import {
  setToken as persistToken,
  logout as clearToken,
  getToken,
} from "../utils/auth";

// ─── Context shape ──────────────────────────────────────────────────────────
interface AuthContextValue {
  /** The authenticated user — null when logged out or still loading */
  user: User | null;
  /** True while the initial token verification request is in-flight */
  loading: boolean;
  /** Save token, fetch user, and navigate to /dashboard */
  login: (token: string) => Promise<void>;
  /** Clear token, reset user state, and redirect to /login */
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  handleLogout: () => {},
});

// ─── useAuth hook ───────────────────────────────────────────────────────────
// Convenience hook so consumers don't need to import AuthContext directly.
export function useAuth() {
  return useContext(AuthContext);
}

// ─── AuthProvider ───────────────────────────────────────────────────────────
// Wraps the entire application so every route (public and protected) can
// access user state via useAuth().
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Startup: verify existing token ─────────────────────────────────────
  // Runs once on mount.  If a token is present we validate it server-side.
  // If no token exists we simply mark loading as done so public pages render.
  useEffect(() => {
    async function loadUser() {
      const token = getToken();

      if (!token) {
        // No token → nothing to verify; allow public routes to render
        setLoading(false);
        return;
      }

      // Token found → verify it by fetching the user profile
      const result = await getCurrentUser();

      if (result.success) {
        setUser(result.data.user);
      } else {
        // Token is stale or invalid — clean it up
        clearToken();
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  // ── login(token) ──────────────────────────────────────────────────────
  // Called by the LoginPage after a successful POST /auth/login.
  // Persists the JWT, fetches the user profile, and redirects to /dashboard.
  const login = useCallback(
    async (token: string) => {
      persistToken(token);

      const result = await getCurrentUser();

      if (result.success) {
        setUser(result.data.user);
        navigate("/dashboard", { replace: true });
      } else {
        // Unlikely: token was just issued but is already invalid
        clearToken();
      }
    },
    [navigate],
  );

  // ── handleLogout ──────────────────────────────────────────────────────
  // Removes the JWT from localStorage, resets user state, and redirects
  // to the login page.
  const handleLogout = useCallback(() => {
    clearToken();
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, login, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
