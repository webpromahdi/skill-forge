import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { GraduationCap, ArrowRight, BookOpen, TrendingUp, Lightbulb } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Personalized Paths",
    description: "AI-driven learning paths tailored to your goals and pace.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Visual dashboards to monitor your learning journey.",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description: "Get topic and practice suggestions based on your performance.",
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-foreground text-xl font-bold">
            SkillForge
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="text-sm font-medium"
          >
            Log in
          </Button>
          <Button
            variant="default"
            onClick={() => navigate("/signup")}
            className="text-sm font-medium"
          >
            Sign up
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Lightbulb className="w-4 h-4" />
            AI-Powered Learning
          </div>
          <h1 className="text-foreground mb-4 text-4xl md:text-5xl font-bold leading-[1.1]">
            Your Personalized
            <br />
            <span className="text-primary">Learning Journey</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg leading-relaxed">
            Get AI-driven recommendations, track progress, and follow a customized learning path
            designed just for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 rounded-xl text-base font-semibold px-7 py-6"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
              className="rounded-xl text-base font-medium px-7 py-6"
            >
              Log in
            </Button>
          </div>
        </motion.div>

        {/* Dashboard preview image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 w-full max-w-4xl"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1762330910399-95caa55acf04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGVkdWNhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcyNjE0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Learning dashboard preview"
              className="w-full h-auto object-cover border-0"
            />
          </div>
        </motion.div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground mb-2 text-base font-semibold">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-muted-foreground text-[0.8125rem]">
        &copy; 2026 SkillForge. All rights reserved. <br />
        Created by Mahdi
      </footer>
    </div>
  );
}
