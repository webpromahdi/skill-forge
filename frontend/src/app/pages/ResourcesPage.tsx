// ─── Resources Page ──────────────────────────────────────────────────────────
// Displays curated learning resources fetched from the backend API.
//
// Flow:
//   1. Page mounts → getResources() → GET /api/resources → resource cards
//   2. Category filter clicked → getResources({ type }) → GET /api/resources?type=videos
//   3. Search input → client-side filtering by title or topic (instant)

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Skeleton } from "../components/ui/Skeleton";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Search,
  Filter,
  Play,
  FileText,
  Code,
  BookOpen,
  Clock,
  ExternalLink,
  Star,
  Video,
  Loader2,
} from "lucide-react";
import { getResources, type Resource } from "../../services/resourceService";

type ResourceType = "all" | "video" | "article" | "project" | "tutorial";

const typeFilters: {
  value: ResourceType;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "all", label: "All", icon: Filter },
  { value: "video", label: "Videos", icon: Video },
  { value: "article", label: "Articles", icon: FileText },
  { value: "project", label: "Projects", icon: Code },
  { value: "tutorial", label: "Tutorials", icon: BookOpen },
];

const typeIcons: Record<
  string,
  { icon: React.ElementType; bg: string; color: string }
> = {
  video: { icon: Play, bg: "bg-red-100", color: "text-red-600" },
  article: { icon: FileText, bg: "bg-blue-100", color: "text-blue-600" },
  project: { icon: Code, bg: "bg-green-100", color: "text-green-600" },
  tutorial: { icon: BookOpen, bg: "bg-purple-100", color: "text-purple-600" },
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-red-100 text-red-700",
};

export function ResourcesPage() {
  const [activeType, setActiveType] = useState<ResourceType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch resources when the active type filter changes ────────────
  // Flow: frontend → GET /api/resources(?type=xxx) → backend
  //       → resourceService → Supabase resources table → response
  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      setError(null);

      const filters: { type?: string } =
        activeType !== "all" ? { type: activeType } : {};

      const res = await getResources(filters);
      if (res.success) {
        setResources(res.data);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }
    fetchResources();
  }, [activeType]);

  // ── Client-side search filtering for instant feedback ──────────────
  // Filters by title or topic — no extra API call needed.
  const filtered = resources.filter((r) => {
    if (searchQuery === "") return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-xl font-bold">
            Resource Library
          </h2>
        </div>
        <p className="text-rose-100 text-sm">
          Curated learning materials to support your learning journey. Browse
          videos, articles, projects, and tutorials.
        </p>
      </motion.div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center bg-card border border-border rounded-lg px-3 gap-2 flex-1 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            type="text"
            placeholder="Search resources by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none shadow-none focus-visible:ring-0 bg-transparent px-0 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {typeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeType === filter.value ? "default" : "outline"}
              onClick={() => setActiveType(filter.value)}
              className={`flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] font-medium ${
                activeType !== filter.value
                  ? "bg-card text-muted-foreground hover:bg-muted"
                  : ""
              }`}
            >
              <filter.icon className="w-3.5 h-3.5" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-12 h-4 rounded" />
              </div>
              <Skeleton className="w-3/4 h-5 mb-2" />
              <Skeleton className="w-1/3 h-3 mb-2" />
              <Skeleton className="w-full h-4 mb-1" />
              <Skeleton className="w-2/3 h-4 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="w-16 h-5 rounded-full" />
                <Skeleton className="w-12 h-5 rounded-full" />
              </div>
              <Skeleton className="w-full h-8 mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-destructive mb-3">{error}</p>
          <Button
            variant="link"
            onClick={() => window.location.reload()}
            className="text-rose-600 hover:text-rose-700 p-0 h-auto text-sm"
          >
            Try again
          </Button>
        </div>
      )}

      {/* Results count + resource grid */}
      {!loading && !error && (
        <>
          <p className="text-muted-foreground text-[0.8125rem]">
            Showing {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((resource, i) => {
              const typeInfo = typeIcons[resource.type] || typeIcons.articles;
              const TypeIcon = typeInfo.icon;
              // Split topic into tags for display
              const tags = resource.topic.split(",").map((t) => t.trim());

              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{
                    y: -3,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                  }}
                  className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeInfo.bg}`}
                    >
                      <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-muted-foreground text-xs font-semibold">
                        {resource.rating}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-foreground mb-1 text-base font-semibold">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground mb-1 text-[0.6875rem]">
                    by {resource.author}
                  </p>
                  <div className="mb-4 flex-1" />

                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[0.6875rem] font-medium ${difficultyColors[resource.difficulty] || ""}`}
                    >
                      {resource.difficulty}
                    </span>
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[0.6875rem]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="w-3.5 h-3.5" /> {resource.duration}
                    </span>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline text-[0.8125rem] font-semibold"
                    >
                      Open <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-[0.9375rem] font-medium">
                No resources found
              </p>
              <p className="text-muted-foreground mt-1 text-[0.8125rem]">
                Try adjusting your search or filters.
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
