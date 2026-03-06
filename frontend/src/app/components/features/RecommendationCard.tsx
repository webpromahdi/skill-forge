import { useState, useEffect } from "react";
import { DashboardCard } from "../ui/DashboardCard";
import { Lightbulb, Clock, Code, ArrowRight, Sparkles } from "lucide-react";
import { Skeleton } from "../ui/Skeleton";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  getRecommendations,
  type Recommendation,
} from "../../../services/recommendationService";

export function RecommendationCard() {
  // ── Dynamic data from GET /api/recommendations ──
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getRecommendations();
      if (res.success) {
        setRec(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Build display items from API data (dynamic)
  const items = rec
    ? [
        {
          icon: Code,
          title: "Next Topic",
          value: rec.topic,
          color: "bg-blue-100 text-blue-600",
        },
        {
          icon: Lightbulb,
          title: "Match Score",
          value: `${rec.match_score}%`,
          color: "bg-purple-100 text-purple-600",
        },
        {
          icon: Clock,
          title: "Resources",
          value: `${rec.resources.length} available`,
          color: "bg-green-100 text-green-600",
        },
      ]
    : [
        {
          icon: Sparkles,
          title: "No Recommendation Yet",
          value: "Generate one on the Recommendations page",
          color: "bg-gray-100 text-gray-500",
        },
      ];

  return (
    <DashboardCard delay={0.1}>
      <div className="flex items-center justify-between mb-5">
        <h3
          className="text-[#0F172A]"
          style={{ fontSize: "1.125rem", fontWeight: 600 }}
        >
          Recommendations
        </h3>
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => navigate("/recommendations")}
          className="flex items-center gap-1 text-blue-600 cursor-pointer"
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          View all <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="w-20 h-3 mb-1" />
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>
                  {item.title}
                </p>
                <p
                  className="text-[#0F172A]"
                  style={{ fontSize: "0.9375rem", fontWeight: 600 }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
