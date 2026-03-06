import { useState } from "react";
import { motion } from "motion/react";
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
} from "lucide-react";

type ResourceType = "all" | "videos" | "articles" | "projects" | "tutorials";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "videos" | "articles" | "projects" | "tutorials";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  tags: string[];
  rating: number;
  author: string;
}

const resources: Resource[] = [
  {
    id: "1",
    title: "HTML Crash Course for Beginners",
    description: "Learn the fundamentals of HTML including tags, elements, forms, and semantic markup.",
    type: "videos",
    difficulty: "Beginner",
    duration: "45 min",
    tags: ["HTML", "Web Basics"],
    rating: 4.8,
    author: "CodeAcademy",
  },
  {
    id: "2",
    title: "Understanding CSS Box Model",
    description: "Deep dive into margins, padding, borders, and how elements are sized in CSS.",
    type: "articles",
    difficulty: "Beginner",
    duration: "15 min read",
    tags: ["CSS", "Layout"],
    rating: 4.6,
    author: "MDN Web Docs",
  },
  {
    id: "3",
    title: "Build a Responsive Portfolio",
    description: "Create a personal portfolio website using HTML, CSS, and JavaScript from scratch.",
    type: "projects",
    difficulty: "Intermediate",
    duration: "2 hours",
    tags: ["HTML", "CSS", "Project"],
    rating: 4.9,
    author: "FreeCodeCamp",
  },
  {
    id: "4",
    title: "JavaScript Functions & Scope",
    description: "Step-by-step tutorial on functions, closures, hoisting, and scope chains.",
    type: "tutorials",
    difficulty: "Intermediate",
    duration: "30 min",
    tags: ["JavaScript", "Functions"],
    rating: 4.7,
    author: "JavaScript.info",
  },
  {
    id: "5",
    title: "Flexbox Complete Guide",
    description: "Visual guide to CSS Flexbox: alignment, distribution, ordering, and wrapping.",
    type: "videos",
    difficulty: "Beginner",
    duration: "25 min",
    tags: ["CSS", "Flexbox"],
    rating: 4.9,
    author: "CSS Tricks",
  },
  {
    id: "6",
    title: "Build a Todo App with Vanilla JS",
    description: "Practice DOM manipulation by building a full CRUD todo application.",
    type: "projects",
    difficulty: "Intermediate",
    duration: "1.5 hours",
    tags: ["JavaScript", "DOM", "Project"],
    rating: 4.5,
    author: "Traversy Media",
  },
  {
    id: "7",
    title: "Async JavaScript Patterns",
    description: "Learn callbacks, promises, and async/await for handling asynchronous operations.",
    type: "articles",
    difficulty: "Advanced",
    duration: "20 min read",
    tags: ["JavaScript", "Async"],
    rating: 4.8,
    author: "Dev.to",
  },
  {
    id: "8",
    title: "CSS Grid Layout Tutorial",
    description: "Complete walkthrough of CSS Grid including template areas and auto-placement.",
    type: "tutorials",
    difficulty: "Intermediate",
    duration: "40 min",
    tags: ["CSS", "Grid"],
    rating: 4.7,
    author: "Wes Bos",
  },
  {
    id: "9",
    title: "React Hooks Explained",
    description: "Comprehensive guide to useState, useEffect, useContext, and custom hooks.",
    type: "videos",
    difficulty: "Advanced",
    duration: "55 min",
    tags: ["React", "Hooks"],
    rating: 4.9,
    author: "Fireship",
  },
];

const typeFilters: { value: ResourceType; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: Filter },
  { value: "videos", label: "Videos", icon: Video },
  { value: "articles", label: "Articles", icon: FileText },
  { value: "projects", label: "Projects", icon: Code },
  { value: "tutorials", label: "Tutorials", icon: BookOpen },
];

const typeIcons: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  videos: { icon: Play, bg: "bg-red-100", color: "text-red-600" },
  articles: { icon: FileText, bg: "bg-blue-100", color: "text-blue-600" },
  projects: { icon: Code, bg: "bg-green-100", color: "text-green-600" },
  tutorials: { icon: BookOpen, bg: "bg-purple-100", color: "text-purple-600" },
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-red-100 text-red-700",
};

export function ResourcesPage() {
  const [activeType, setActiveType] = useState<ResourceType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = resources.filter((r) => {
    const matchesType = activeType === "all" || r.type === activeType;
    const matchesSearch =
      searchQuery === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
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
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Resource Library</h2>
        </div>
        <p className="text-rose-100" style={{ fontSize: "0.875rem" }}>
          Curated learning materials to support your learning journey. Browse videos, articles, projects, and tutorials.
        </p>
      </motion.div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 gap-2 flex-1">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search resources by title or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full"
            style={{ fontSize: "0.875rem" }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {typeFilters.map((filter) => (
            <motion.button
              key={filter.value}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveType(filter.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeType === filter.value
                  ? "bg-[#0F172A] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
              style={{ fontSize: "0.8125rem", fontWeight: 500 }}
            >
              <filter.icon className="w-3.5 h-3.5" />
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-gray-500" style={{ fontSize: "0.8125rem" }}>
        Showing {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((resource, i) => {
          const typeInfo = typeIcons[resource.type];
          const TypeIcon = typeInfo.icon;

          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeInfo.bg}`}>
                  <TypeIcon className={`w-5 h-5 ${typeInfo.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-600" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                    {resource.rating}
                  </span>
                </div>
              </div>

              <h3 className="text-[#0F172A] mb-1" style={{ fontSize: "1rem", fontWeight: 600 }}>
                {resource.title}
              </h3>
              <p className="text-gray-400 mb-1" style={{ fontSize: "0.6875rem" }}>
                by {resource.author}
              </p>
              <p className="text-gray-500 mb-4 flex-1" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
                {resource.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span
                  className={`px-2 py-0.5 rounded-full ${difficultyColors[resource.difficulty]}`}
                  style={{ fontSize: "0.6875rem", fontWeight: 500 }}
                >
                  {resource.difficulty}
                </span>
                {resource.tags.map((tag) => (
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
                <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: "0.75rem" }}>
                  <Clock className="w-3.5 h-3.5" /> {resource.duration}
                </span>
                <motion.button
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-1 text-blue-600 cursor-pointer"
                  style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                >
                  Open <ExternalLink className="w-3.5 h-3.5" />
                </motion.button>
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
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500" style={{ fontSize: "0.9375rem", fontWeight: 500 }}>
            No resources found
          </p>
          <p className="text-gray-400 mt-1" style={{ fontSize: "0.8125rem" }}>
            Try adjusting your search or filters.
          </p>
        </motion.div>
      )}
    </div>
  );
}
