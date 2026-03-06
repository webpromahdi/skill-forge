// ─── AI Service ──────────────────────────────────────────────────────────────
// Sends a text prompt to an AI model and returns the parsed JSON response.
//
// AI Recommendation Workflow (this file handles step 4):
//   1. Controller triggers recommendation generation
//   2. Service gathers user data
//   3. promptBuilder produces the prompt text
//   4. ★ aiService.getAIRecommendation() sends prompt → receives JSON ★
//   5. Recommendation is saved to the database
//
// Supported backends (selected via AI_PROVIDER env var):
//   • "glm"    — ZhipuAI GLM API (default)
//   • "ollama" — local Ollama instance
//
// If the AI call fails, the service throws so the controller can handle
// the error gracefully and return a fallback response.

// ─── getAIRecommendation ────────────────────────────────────────────────────
// Sends the prompt to the configured AI provider and returns the parsed
// recommendation object { next_topic, reason, difficulty, match_score }.
//
// @param {string} prompt - The fully-built prompt from promptBuilder
// @returns {Object} Parsed recommendation JSON from the AI model
// @throws {Error}  If the AI call fails or the response is not valid JSON
export async function getAIRecommendation(prompt) {
  const provider = (process.env.AI_PROVIDER || "glm").toLowerCase();

  if (provider === "ollama") {
    return callOllama(prompt);
  }

  return callGLM(prompt);
}

// ─── GLM (ZhipuAI) ─────────────────────────────────────────────────────────
// Calls the ZhipuAI GLM-4-flash model via their OpenAI-compatible endpoint.
// Requires GLM_API_KEY in .env.
async function callGLM(prompt) {
  const apiKey = process.env.GLM_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GLM_API_KEY is not set. Add it to backend/.env or switch to AI_PROVIDER=ollama.",
    );
  }

  const response = await fetch(
    "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "glm-4-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI learning assistant. Always respond with valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GLM API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("GLM returned an empty response");
  }

  return parseAIResponse(content);
}

// ─── Ollama (local) ─────────────────────────────────────────────────────────
// Calls a locally-running Ollama instance. Defaults to the "llama3" model.
// Requires Ollama running on OLLAMA_URL (default: http://localhost:11434).
async function callOllama(prompt) {
  const baseUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3";

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: { temperature: 0.7 },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content = data.response;

  if (!content) {
    throw new Error("Ollama returned an empty response");
  }

  return parseAIResponse(content);
}

// ─── parseAIResponse ────────────────────────────────────────────────────────
// Extracts valid JSON from the AI model's text output.
// Handles cases where the model wraps JSON in markdown code fences.
//
// @param {string} raw - Raw text from the AI model
// @returns {Object} { next_topic, reason, difficulty, match_score }
// @throws {Error} If no valid JSON can be extracted
function parseAIResponse(raw) {
  // Strip markdown code fences if present (```json ... ```)
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  try {
    const parsed = JSON.parse(cleaned);

    // Validate required fields
    if (!parsed.next_topic || !parsed.reason) {
      throw new Error(
        "AI response missing required fields (next_topic, reason)",
      );
    }

    return {
      next_topic: parsed.next_topic,
      reason: parsed.reason,
      difficulty: parsed.difficulty || "Intermediate",
      match_score: Math.min(
        100,
        Math.max(0, parseInt(parsed.match_score, 10) || 85),
      ),
    };
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`AI returned invalid JSON: ${cleaned.substring(0, 200)}`);
    }
    throw err;
  }
}
