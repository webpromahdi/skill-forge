import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { GraduationCap, ArrowRight, BookOpen, TrendingUp, Lightbulb } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const features = [
  {
    icon: BookOpen,
    title: "Personalized Paths",
    description: "AI-driven learning paths tailored to your goals and pace.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Visual dashboards to monitor your learning journey.",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description: "Get topic and practice suggestions based on your performance.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-[#0F172A]" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            SkillForge
          </span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 rounded-lg text-[#0F172A] hover:bg-gray-100 transition-colors cursor-pointer"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            Log in
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/signup")}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            Sign up
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl"
        >
          <div
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 mb-6"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            <Lightbulb className="w-4 h-4" />
            AI-Powered Learning
          </div>
          <h1
            className="text-[#0F172A] mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.1 }}
          >
            Your Personalized
            <br />
            <span className="text-blue-600">Learning Journey</span>
          </h1>
          <p
            className="text-gray-500 max-w-xl mx-auto mb-8"
            style={{ fontSize: "1.125rem", lineHeight: 1.6 }}
          >
            Get AI-driven recommendations, track progress, and follow a customized learning path
            designed just for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
              style={{ fontSize: "1rem", fontWeight: 600 }}
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className="px-7 py-3 rounded-xl border border-gray-200 text-[#0F172A] hover:bg-gray-50 transition-colors cursor-pointer"
              style={{ fontSize: "1rem", fontWeight: 500 }}
            >
              Log in
            </motion.button>
          </div>
        </motion.div>

        {/* Dashboard preview image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 w-full max-w-4xl"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1762330910399-95caa55acf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGVkdWNhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcyNjE0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Learning dashboard preview"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3
                className="text-[#0F172A] mb-2"
                style={{ fontSize: "1rem", fontWeight: 600 }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-500" style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-gray-400" style={{ fontSize: "0.8125rem" }}>
        &copy; 2026 SkillForge. All rights reserved. <br />
        Created by Mahdi
      </footer>
    </div>
  );
}
