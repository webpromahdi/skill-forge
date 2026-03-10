import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { registerUser, type FieldError } from "../../services/authService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ── Error & loading state for the registration flow ──
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors([]);
    setLoading(true);

    // Call the backend POST /api/auth/register endpoint
    const result = await registerUser(name, email, password);
    setLoading(false);

    if (!result.success) {
      // If the backend returned field-level validation errors, display them
      if (result.errors) {
        setFieldErrors(result.errors);
      }
      setError(result.message);
      return;
    }

    // Registration succeeded — redirect to login so the user can sign in
    navigate("/login");
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
            Create your account
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Start your personalized learning journey today
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-8">
          {/* ── Display general or network errors ── */}
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
                htmlFor="name"
                className="block text-foreground mb-1.5 text-sm font-medium"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Cooper"
                className="w-full"
              />
            </div>

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
                  placeholder="Create a password"
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
              {loading ? "Creating account…" : "Sign up"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6 text-[0.8125rem]">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline cursor-pointer font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
