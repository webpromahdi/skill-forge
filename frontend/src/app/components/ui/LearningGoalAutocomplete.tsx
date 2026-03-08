// ─── LearningGoalAutocomplete ─────────────────────────────────────────────────
// Reusable typeahead input for selecting / typing a learning goal.
// Used by both OnboardingModal and SettingsPage.
// Loads goals dynamically from GET /api/learning-path/goals (Supabase).

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";
import { getGoals } from "../../../services/learningPathService";

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** id forwarded to the underlying <input> — used by associated <label> */
  inputId?: string;
}

export function LearningGoalAutocomplete({
  value,
  onChange,
  inputId = "goal-autocomplete",
}: Props) {
  const [input, setInput] = useState(value);
  const [open, setOpen] = useState(false);
  const [goalNames, setGoalNames] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep input in sync when the parent sets value externally (e.g. on profile load)
  useEffect(() => {
    setInput(value);
  }, [value]);

  // Fetch goals from Supabase on mount
  useEffect(() => {
    async function loadGoals() {
      const res = await getGoals();
      if (res.success && res.data.length > 0) {
        setGoalNames(res.data.map((g) => g.name));
      }
    }
    loadGoals();
  }, []);

  const trimmed = input.trim().toLowerCase();
  const suggestions =
    trimmed.length > 0
      ? goalNames.filter((i) => i.toLowerCase().includes(trimmed)).slice(0, 20)
      : [];

  // Close dropdown when user clicks outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  }

  function handleSelect(interest: string) {
    setInput(interest);
    onChange(interest);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          id={inputId}
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={() => input.trim().length > 0 && setOpen(true)}
          placeholder="e.g. Frontend Developer"
          autoComplete="off"
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          style={{ fontSize: "0.875rem" }}
        />
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
            role="listbox"
          >
            {suggestions.map((s) => (
              <li
                key={s}
                role="option"
                aria-selected={s === value}
                onMouseDown={() => handleSelect(s)}
                className={`px-4 py-2.5 cursor-pointer transition-colors ${
                  s === value
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                style={{ fontSize: "0.875rem" }}
              >
                {s}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
