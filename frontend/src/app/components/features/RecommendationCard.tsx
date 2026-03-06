import { DashboardCard } from "../ui/DashboardCard";
import { Lightbulb, Clock, Code, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const recommendations = [
  {
    icon: Code,
    title: "Next Topic",
    value: "DOM Manipulation",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Lightbulb,
    title: "Suggested Practice",
    value: "Build a Todo App",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Clock,
    title: "Estimated Time",
    value: "45 minutes",
    color: "bg-green-100 text-green-600",
  },
];

export function RecommendationCard() {
  return (
    <DashboardCard delay={0.1}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[#0F172A]" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
          Recommendations
        </h3>
        <motion.button
          whileHover={{ x: 4 }}
          className="flex items-center gap-1 text-blue-600 cursor-pointer"
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          View all <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {recommendations.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>
                {item.title}
              </p>
              <p className="text-[#0F172A]" style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
