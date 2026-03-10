import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { loginUser, type FieldError } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ── Error & loading state for the login flow ──
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Use the global login() from AuthContext ──
  // login(token) stores the JWT, fetches the user from GET /auth/me,
  // and navigates to /dashboard — all in one call.
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors([]);
    setLoading(true);

    // Call the backend POST /api/auth/login endpoint
    const result = await loginUser(email, password);
    setLoading(false);

    if (!result.success) {
      // Surface validation or authentication errors to the user
      if (result.errors) {
        setFieldErrors(result.errors);
      }
      setError(result.message);
      return;
    }

    // Hand the token to AuthContext — it stores it, fetches the user,
    // and redirects to /dashboard automatically.
    await login(result.data.access_token);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-foreground text-2xl font-bold">
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in to continue your learning journey
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-8">
          {/* ── Display general or authentication errors ── */}
          {error && (
            <div className="mb-4 p-3 text-[0.8125rem] rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              {error}
            </div>
          )}

          {/* ── Display per-field validation errors from the backend ── */}
          {fieldErrors.length > 0 && (
            <ul className="mb-4 p-3 text-[0.8125rem] rounded-lg bg-destructive/10 border border-destructive/20 text-destructive list-disc list-inside">
              {fieldErrors.map((fe) => (
                <li key={fe.field}>
                  <span className="font-medium capitalize">{fe.field}</span>:{" "}
                  {fe.message}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-foreground mb-1.5 text-sm font-medium"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-foreground mb-1.5 text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg text-sm font-semibold p-6"
            >
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6 text-[0.8125rem]">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary hover:underline cursor-pointer font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
