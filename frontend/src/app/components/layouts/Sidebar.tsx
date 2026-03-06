import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Route,
  Lightbulb,
  TrendingUp,
  ClipboardCheck,
  BookOpen,
  Settings,
  X,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Route, label: "Learning Path", path: "/dashboard/learning-path" },
  {
    icon: Lightbulb,
    label: "Recommendations",
    path: "/dashboard/recommendations",
  },
  { icon: TrendingUp, label: "Progress", path: "/dashboard/progress" },
  {
    icon: ClipboardCheck,
    label: "Assessments",
    path: "/dashboard/assessments",
  },
  { icon: BookOpen, label: "Resources", path: "/dashboard/resources" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Pull the authenticated user + logout handler from context ──
  const { user, handleLogout } = useAuth();
  const displayName = user?.user_metadata?.name || user?.email || "User";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F172A] text-white">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span
          className="tracking-tight"
          style={{ fontSize: "1.125rem", fontWeight: 600 }}
        >
          SkillForge
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);

          return (
            <motion.button
              key={item.path}
              onClick={() => handleNav(item.path)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
              aria-label={item.label}
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* ── Dynamic user info + logout button ── */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
            style={{ fontSize: "0.75rem", fontWeight: 600 }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="truncate"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              {displayName}
            </p>
            <p
              className="text-gray-400 truncate"
              style={{ fontSize: "0.75rem" }}
            >
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 w-64 h-screen z-50 lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
