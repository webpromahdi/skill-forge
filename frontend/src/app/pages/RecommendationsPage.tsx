import { useState } from "react";
import { motion } from "motion/react";
import {
  Code,
  Palette,
  Layers,
  Zap,
  BookOpen,
  Play,
  Clock,
  Star,
  ArrowRight,
  Filter,
  Sparkles,
  TrendingUp,
  Info,
} from "lucide-react";

type Category = "all" | "topics" | "practice" | "resources";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "topics" | "practice" | "resources";
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xp: number;
  matchScore: number;
  tags: string[];
}

const recommendations: Recommendation[] = [
  {
    id: "2",
    title: "Build a Todo App",
    description: "Practice DOM skills by creating a fully functional task management application.",
    category: "practice",
    icon: Layers,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    duration: "60 min",
    difficulty: "Intermediate",
    xp: 200,
    matchScore: 95,
    tags: ["Project", "JavaScript"],
  },
  {
    id: "3",
    title: "CSS Grid Deep Dive",
    description: "Master two-dimensional layouts with Grid template areas and auto-placement.",
    category: "topics",
    icon: Palette,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    duration: "35 min",
    difficulty: "Intermediate",
    xp: 100,
    matchScore: 92,
    tags: ["CSS", "Layout"],
  },
  {
    id: "4",
    title: "JavaScript Design Patterns",
    description: "Explore common patterns like Module, Observer, and Factory for cleaner code.",
    category: "resources",
    icon: BookOpen,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    duration: "90 min",
    difficulty: "Advanced",
    xp: 250,
    matchScore: 88,
    tags: ["JavaScript", "Architecture"],
  },
  {
    id: "5",
    title: "Responsive Image Gallery",
    description: "Build a masonry-style photo gallery that adapts to any screen size.",
    category: "practice",
    icon: Palette,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    duration: "50 min",
    difficulty: "Beginner",
    xp: 150,
    matchScore: 85,
    tags: ["CSS", "Project"],
  },
  {
    id: "6",
    title: "Async/Await & Promises",
    description: "Understand asynchronous JavaScript patterns for API calls and data fetching.",
    category: "topics",
    icon: Zap,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    duration: "40 min",
    difficulty: "Intermediate",
    xp: 130,
    matchScore: 82,
    tags: ["JavaScript", "Async"],
  },
];

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "topics", label: "Topics" },
  { value: "practice", label: "Practice" },
  { value: "resources", label: "Resources" },
];

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-red-100 text-red-700",
};

export function RecommendationsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered =
    activeCategory === "all"
      ? recommendations
      : recommendations.filter((r) => r.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* AI suggestion banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div className="flex-1">
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Personalized for You</h2>
            <p className="text-purple-200 mt-1" style={{ fontSize: "0.875rem" }}>
              Based on your progress in CSS Fundamentals, we recommend focusing on DOM Manipulation next.
              Your match scores reflect how well each topic aligns with your learning goals.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-white text-purple-700 px-5 py-2.5 rounded-lg shrink-0 cursor-pointer"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            <TrendingUp className="w-4 h-4" /> View Learning Plan
          </motion.button>
        </div>
      </motion.div>

      {/* Next Recommended Topic — large highlighted card */}
      <div>
        <h2 className="text-[#0F172A] mb-4" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
          Next Recommended Topic
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left accent */}
            <div className="w-full md:w-2 h-2 md:h-auto bg-blue-600 shrink-0" />

            <div className="flex-1 p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Code className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[#0F172A]" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                          DOM Manipulation
                        </h3>
                        <span
                          className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ fontSize: "0.6875rem", fontWeight: 600 }}
                        >
                          <Star className="w-3 h-3" /> 98% match
                        </span>
                      </div>
                      <p className="text-gray-500 mt-0.5" style={{ fontSize: "0.875rem" }}>
                        Learn to dynamically create, modify, and remove HTML elements using JavaScript.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap mt-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full ${difficultyColors["Intermediate"]}`}
                      style={{ fontSize: "0.75rem", fontWeight: 500 }}
                    >
                      Intermediate
                    </span>
                    <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: "0.8125rem" }}>
                      <Clock className="w-4 h-4" /> 45 min
                    </span>
                    <span className="flex items-center gap-1 text-yellow-500" style={{ fontSize: "0.8125rem" }}>
                      <Zap className="w-4 h-4" /> 120 XP
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500" style={{ fontSize: "0.6875rem" }}>
                      JavaScript
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500" style={{ fontSize: "0.6875rem" }}>
                      Web API
                    </span>
                  </div>

                  {/* Why recommended */}
                  <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                        Why this is recommended
                      </span>
                    </div>
                    <p className="text-blue-600" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
                      Because you recently completed CSS Fundamentals and your JavaScript progress is
                      still low, we recommend learning DOM Manipulation next. This topic bridges your
                      CSS knowledge with interactive JavaScript skills.
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl shrink-0 cursor-pointer self-start"
                  style={{ fontSize: "0.9375rem", fontWeight: 600 }}
                >
                  <Play className="w-5 h-5" /> Start Learning
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* More Recommendations */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-[#0F172A]" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
            More Recommendations
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeCategory === cat.value
                    ? "bg-[#0F172A] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
                style={{ fontSize: "0.8125rem", fontWeight: 500 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${rec.iconBg}`}>
                  <rec.icon className={`w-5 h-5 ${rec.iconColor}`} />
                </div>
                <div
                  className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full"
                  style={{ fontSize: "0.6875rem", fontWeight: 600 }}
                >
                  <Star className="w-3 h-3" />
                  {rec.matchScore}% match
                </div>
              </div>

              <h3 className="text-[#0F172A] mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>
                {rec.title}
              </h3>
              <p className="text-gray-500 mb-4 flex-1" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
                {rec.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span
                  className={`px-2 py-0.5 rounded-full ${difficultyColors[rec.difficulty]}`}
                  style={{ fontSize: "0.6875rem", fontWeight: 500 }}
                >
                  {rec.difficulty}
                </span>
                {rec.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
                    style={{ fontSize: "0.6875rem" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: "0.75rem" }}>
                    <Clock className="w-3.5 h-3.5" /> {rec.duration}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500" style={{ fontSize: "0.75rem" }}>
                    <Zap className="w-3.5 h-3.5" /> {rec.xp} XP
                  </span>
                </div>
                <motion.button
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-1 text-blue-600 cursor-pointer"
                  style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                >
                  <Play className="w-3.5 h-3.5" /> Start
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
