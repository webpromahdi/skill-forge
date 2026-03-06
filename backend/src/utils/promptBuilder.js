// ─── Prompt Builder ──────────────────────────────────────────────────────────
// Constructs a structured prompt for the AI model from user learning data.
//
// AI Recommendation Workflow:
//   1. recommendationController receives POST /api/recommendations/generate
//   2. recommendationService gathers user data (progress, quiz scores, etc.)
//   3. promptBuilder.buildPrompt() turns that data into a textual prompt
//   4. aiService sends the prompt to the AI model and returns parsed JSON
//   5. The recommendation is saved and the matching resources are fetched
//
// The prompt asks the AI to return a JSON object:
//   { next_topic, reason, difficulty, match_score }

// ─── buildPrompt ────────────────────────────────────────────────────────────
// Accepts aggregated user learning data and returns a plain-text prompt
// string suitable for any LLM.
//
// @param {Object} userData
// @param {string}   userData.goal            - e.g. "Frontend Developer"
// @param {string[]} userData.completedTopics - topics at 100 %
// @param {Object[]} userData.currentProgress - { name, progress } for in-progress topics
// @param {Object[]} userData.quizScores      - { topic, scorePercentage }
// @returns {string} The full prompt text
export function buildPrompt(userData) {
  const {
    goal = "General Web Development",
    completedTopics = [],
    currentProgress = [],
    quizScores = [],
  } = userData;

  // ── Completed topics section ───────────────────────────────────────
  const completedSection =
    completedTopics.length > 0
      ? completedTopics.map((t) => `- ${t}`).join("\n")
      : "- None yet";

  // ── Current progress section ───────────────────────────────────────
  const progressSection =
    currentProgress.length > 0
      ? currentProgress.map((p) => `- ${p.name}: ${p.progress}%`).join("\n")
      : "- No topics in progress";

  // ── Quiz performance section ───────────────────────────────────────
  const quizSection =
    quizScores.length > 0
      ? quizScores.map((q) => `- ${q.topic}: ${q.scorePercentage}%`).join("\n")
      : "- No quizzes taken yet";

  // ── Assemble the full prompt ───────────────────────────────────────
  return `You are an AI learning assistant for a web-development learning platform.

Student goal: ${goal}.

Completed topics:
${completedSection}

Current progress:
${progressSection}

Quiz performance:
${quizSection}

Based on the student's completed topics, current progress, and quiz performance, suggest the single best next topic they should learn.

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "next_topic": "<topic name>",
  "reason": "<1-2 sentence explanation of why this topic is recommended>",
  "difficulty": "<Beginner | Intermediate | Advanced>",
  "match_score": <integer 0-100 representing how strongly this matches the student's needs>
}`;
}
