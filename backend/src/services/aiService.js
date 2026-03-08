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
//   • "ollama" — Ollama Cloud API or local Ollama instance (default)
//   • "glm"    — ZhipuAI GLM API (legacy)
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
  const provider = (process.env.AI_PROVIDER || "ollama").toLowerCase();

  if (provider === "glm") {
    return callGLM(prompt);
  }

  return callOllama(prompt);
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

// ─── Ollama (Cloud or Local) ────────────────────────────────────────────────
// Calls the Ollama API using the /api/chat endpoint.
//
// Cloud mode (default for this project):
//   OLLAMA_URL=https://ollama.com
//   OLLAMA_API_KEY=<your key from ollama.com/settings/keys>
//   OLLAMA_MODEL=glm-5:cloud
//
// Local mode:
//   OLLAMA_URL=http://localhost:11434  (or omit — it's the default)
//   OLLAMA_MODEL=llama3
//   No API key needed for local.
async function callOllama(prompt) {
  const baseUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "glm-5:cloud";
  const apiKey = process.env.OLLAMA_API_KEY;

  // Build headers — include Bearer token when an API key is configured
  // (required for Ollama Cloud at https://ollama.com)
  const headers = { "Content-Type": "application/json" };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI learning assistant. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      stream: false,
      options: { temperature: 0.7 },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content = data.message?.content;

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

// ─── getAIPhaseResources ────────────────────────────────────────────────────
// Sends phases to the AI model and gets structured learning resources back.
// Each phase returns 1 YouTube video resource and 1 blog/tutorial guide.
//
// @param {string} skill - The learning skill/goal name
// @param {string[]} phases - Array of phase titles/descriptions
// @returns {Array} Array of { title, resources: [{ type, source, title, url }] }
export async function getAIPhaseResources(skill, phases) {
  const provider = (process.env.AI_PROVIDER || "ollama").toLowerCase();

  const prompt = buildPhaseResourcePrompt(skill, phases);

  let content;
  if (provider === "glm") {
    content = await callGLMRaw(prompt);
  } else {
    content = await callOllamaRaw(prompt);
  }

  return parsePhaseResources(content, skill, phases);
}

// ─── buildPhaseResourcePrompt ───────────────────────────────────────────────
// Builds a prompt asking the AI to generate structured learning resources.
function buildPhaseResourcePrompt(skill, phases) {
  const phaseList = phases.map((p, i) => `${i + 1}. ${p}`).join("\n");

  return `You are an AI learning resource curator. Generate structured learning resources for the following skill and its phases.

Skill: ${skill}

Phases:
${phaseList}

For EACH phase, provide exactly:
- 1 YouTube learning resource (type: "video", source should include "YouTube" and channel name)
- 1 blog/tutorial guide (type: "article", from trusted sources like official docs, GeeksforGeeks, MDN, freeCodeCamp, HubSpot, etc.)

Return ONLY valid JSON (no markdown, no explanation) as an array with this exact format:
[
  {
    "title": "Phase Title",
    "resources": [
      {
        "type": "video",
        "source": "YouTube (Channel Name)",
        "title": "Video Title",
        "url": "https://www.youtube.com/watch?v=VIDEO_ID"
      },
      {
        "type": "article",
        "source": "Website Name",
        "title": "Article Title",
        "url": "https://example.com/article-url"
      }
    ]
  }
]

Rules:
- Each phase MUST have exactly 1 video and 1 article resource
- Resources must be relevant to the phase topic within ${skill}
- Use real, well-known educational resources and URLs
- Prefer trusted sources: official documentation, YouTube channels like freeCodeCamp, Traversy Media, Web Dev Simplified, GeeksforGeeks, MDN, etc.
- Return the array for ALL ${phases.length} phases`;
}

// ─── callGLMRaw ─────────────────────────────────────────────────────────────
// Calls GLM and returns raw content string (no parsing into recommendation format).
async function callGLMRaw(prompt) {
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
              "You are a helpful AI learning resource curator. Always respond with valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GLM API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("GLM returned an empty response");
  return content;
}

// ─── callOllamaRaw ─────────────────────────────────────────────────────────
// Calls Ollama and returns raw content string.
async function callOllamaRaw(prompt) {
  const baseUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "glm-5:cloud";
  const apiKey = process.env.OLLAMA_API_KEY;

  const headers = { "Content-Type": "application/json" };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI learning resource curator. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      stream: false,
      options: { temperature: 0.7 },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content = data.message?.content;
  if (!content) throw new Error("Ollama returned an empty response");
  return content;
}

// ─── parsePhaseResources ────────────────────────────────────────────────────
// Parses the AI response for phase resources. Falls back to provided resource
// data if the AI returns invalid JSON.
function parsePhaseResources(raw, skill, phases) {
  let cleaned = raw.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  try {
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      throw new Error("AI response is not an array");
    }

    // Validate each phase has the required structure
    return parsed.map((phase) => ({
      title: phase.title || "Unknown Phase",
      resources: (phase.resources || []).map((r) => ({
        type: r.type || "article",
        source: r.source || "",
        title: r.title || "",
        url: r.url || "",
      })),
    }));
  } catch (err) {
    console.error("[PARSE PHASE RESOURCES ERROR]", err.message);
    throw new Error(
      `AI returned invalid phase resources: ${cleaned.substring(0, 200)}`,
    );
  }
}
