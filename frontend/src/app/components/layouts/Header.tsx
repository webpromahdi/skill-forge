import { useState, useRef } from "react";
import { Menu, Bell, Search } from "lucide-react";
import { NotificationPanel } from "../features/NotificationPanel";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-[#0F172A]">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-48"
              style={{ fontSize: "0.875rem" }}
            />
          </div>

          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p style={{ fontSize: "0.875rem", fontWeight: 600 }} className="text-[#0F172A]">
                Jane Cooper
              </p>
              <p style={{ fontSize: "0.75rem" }} className="text-gray-500">
                Grade 2 &middot; Week of Jul 28
              </p>
            </div>
            <div
              className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white"
              style={{ fontSize: "0.75rem", fontWeight: 600 }}
            >
              JC
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
