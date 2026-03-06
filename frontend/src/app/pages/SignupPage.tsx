import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

export function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[#0F172A]" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Create your account
          </h1>
          <p className="text-gray-500 mt-1" style={{ fontSize: "0.875rem" }}>
            Start your personalized learning journey today
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-[#0F172A] mb-1.5"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Cooper"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                style={{ fontSize: "0.875rem" }}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[#0F172A] mb-1.5"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                style={{ fontSize: "0.875rem" }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[#0F172A] mb-1.5"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all pr-11"
                  style={{ fontSize: "0.875rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
              style={{ fontSize: "0.875rem", fontWeight: 600 }}
            >
              Sign up
            </motion.button>
          </form>

          <p className="text-center text-gray-500 mt-6" style={{ fontSize: "0.8125rem" }}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              Log in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
