// ─── OnboardingModal ─────────────────────────────────────────────────────────
// Blocking modal shown to new users on their first dashboard visit.
// Collects phone_number, learning_goal, daily_learning_time, and motivation.
//
// Blocking rules:
//   • Escape key is intercepted and swallowed.
//   • Clicking outside the panel is intercepted and swallowed.
//   • The only way to dismiss is by submitting the form.
//
// On successful POST /api/profile the parent receives onComplete() and removes
// the modal, unlocking the full dashboard.

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { toast } from "sonner";
import {
  Target,
  Clock,
  Phone,
  Lightbulb,
  Rocket,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { createProfile } from "../../../services/userService";
import { LearningGoalAutocomplete } from "../ui/LearningGoalAutocomplete";

// ─── Types ────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

interface FormState {
  phone_number: string;
  motivation: string;
  learning_goal: string;
  /** stored as a string so the number input can be controlled */
  daily_learning_time: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OnboardingModal({ onComplete }: Props) {
  const { user } = useAuth();
  const displayName =
    user?.user_metadata?.name?.split(" ")[0] || user?.email || "there";

  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    phone_number: "",
    motivation: "",
    learning_goal: "",
    daily_learning_time: "60",
  });

  const patch = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const res = await createProfile({
      phone_number: form.phone_number || undefined,
      learning_goal: form.learning_goal,
      daily_learning_time: parseInt(form.daily_learning_time) || 60,
      motivation: form.motivation || undefined,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Profile saved! Welcome to SkillForge 🎉");
      onComplete();
    } else {
      toast.error(res.message || "Failed to save profile. Please try again.");
    }
  };

  return (
    // Root is always open — controlled entirely by the parent's state.
    <DialogPrimitive.Root open>
      <DialogPrimitive.Portal>
        {/* Backdrop */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />

        {/* Panel */}
        <DialogPrimitive.Content
          className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 outline-none"
          // ── Blocking: prevent all dismiss interactions ──
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          // Suppress Radix warning about missing description
          aria-describedby={undefined}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            {/* ── Header gradient banner ── */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 pt-8 pb-10 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className="text-blue-200"
                    style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                  >
                    Step {step} of 2
                  </span>
                </div>
                <h2
                  className="text-white mb-1"
                  style={{ fontSize: "1.375rem", fontWeight: 700 }}
                >
                  {step === 1
                    ? `Welcome, ${displayName}! 👋`
                    : "Personalize your learning"}
                </h2>
                <p className="text-blue-200" style={{ fontSize: "0.875rem" }}>
                  {step === 1
                    ? "Let's set up your profile before you start."
                    : "Tell us how you want to learn."}
                </p>
              </div>

              {/* Progress dots */}
              <div className="relative z-10 flex gap-2 mt-5">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step >= n ? "bg-white w-8" : "bg-white/30 w-4"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ── Form body ── */}
            <div className="px-6 py-6 space-y-4">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="ob-phone"
                        className="flex items-center gap-1.5 text-[#0F172A] mb-1.5"
                        style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                      >
                        <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone
                        Number{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="ob-phone"
                        type="tel"
                        value={form.phone_number}
                        onChange={(e) => patch("phone_number", e.target.value)}
                        placeholder="+1 555 000 0000"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        style={{ fontSize: "0.875rem" }}
                      />
                    </div>

                    {/* Motivation */}
                    <div>
                      <label
                        htmlFor="ob-motivation"
                        className="flex items-center gap-1.5 text-[#0F172A] mb-1.5"
                        style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-gray-400" /> What
                        motivates you to learn?{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="ob-motivation"
                        value={form.motivation}
                        onChange={(e) => patch("motivation", e.target.value)}
                        rows={3}
                        placeholder="e.g. I want to land my first dev job..."
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                        style={{ fontSize: "0.875rem" }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Learning goal — typeahead autocomplete */}
                    <div>
                      <label
                        htmlFor="ob-goal"
                        className="flex items-center gap-1.5 text-[#0F172A] mb-1.5"
                        style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                      >
                        <Target className="w-3.5 h-3.5 text-gray-400" />{" "}
                        Learning Goal
                      </label>
                      <LearningGoalAutocomplete
                        inputId="ob-goal"
                        value={form.learning_goal}
                        onChange={(v) => patch("learning_goal", v)}
                      />
                    </div>

                    {/* Daily time */}
                    <div>
                      <label
                        htmlFor="ob-time"
                        className="flex items-center gap-1.5 text-[#0F172A] mb-1.5"
                        style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                      >
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> Daily
                        Learning Time
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="ob-time"
                          type="number"
                          min={1}
                          max={720}
                          value={form.daily_learning_time}
                          onChange={(e) => {
                            const v = Math.max(
                              1,
                              Math.min(720, parseInt(e.target.value) || 1),
                            );
                            patch("daily_learning_time", String(v));
                          }}
                          className="w-24 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-center"
                          style={{ fontSize: "0.875rem" }}
                        />
                        <span
                          className="text-gray-500"
                          style={{ fontSize: "0.875rem" }}
                        >
                          minutes per day
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer actions ── */}
            <div className="px-6 pb-6 flex items-center justify-between gap-3">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ fontSize: "0.875rem", fontWeight: 500 }}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer ml-auto"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
                  style={{ fontSize: "0.875rem", fontWeight: 600 }}
                >
                  <Rocket className="w-4 h-4" />
                  {isSubmitting ? "Saving…" : "Start Learning"}
                </motion.button>
              )}
            </div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
