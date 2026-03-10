import { useState, useRef } from "react";
import { Menu, Bell, Search } from "lucide-react";
import { NotificationPanel } from "../features/NotificationPanel";
import { useAuth } from "../../../contexts/AuthContext";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // ── Pull the authenticated user from context ──
  const { user } = useAuth();
  const displayName = user?.user_metadata?.name || user?.email || "User";
  // Build initials from the display name (e.g. "Jane Cooper" → "JC")
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border h-[69px]">
      <div className="flex items-center justify-between px-4 md:px-8 h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer text-foreground"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-foreground font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-muted rounded-lg px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-48 text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>

          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer text-foreground"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <NotificationPanel
              isOpen={notifOpen}
              onClose={() => setNotifOpen(false)}
            />
          </div>

          {/* ── Dynamic user info pulled from AuthContext ── */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="hidden sm:block text-right">
              <p className="text-foreground text-sm font-semibold">
                {displayName}
              </p>
              <p className="text-muted-foreground text-xs">
                {user?.email}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
