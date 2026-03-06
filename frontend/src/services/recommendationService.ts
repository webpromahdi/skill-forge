// ─── Recommendation Service (Frontend) ───────────────────────────────────────
// Handles recommendation-related API calls from the frontend.
//
// AI Recommendation Workflow — frontend layer:
//   1. RecommendationsPage mounts → getRecommendations()
//      → GET /api/recommendations
//      Backend returns the user's latest AI recommendation with resources.
//
//   2. User clicks "Generate" → generateRecommendation()
//      → POST /api/recommendations/generate
//      Backend runs the AI pipeline and returns a new recommendation.
//
//   3. If the AI service is unavailable (503), the error is surfaced
//      so the UI can show a fallback message instead of crashing.

import { apiFetch } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface RecommendationResource {
  id: string;
  title: string;
  topic: string;
  type: "video" | "article" | "project" | "tutorial";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  author: string;
  url: string;
}

export interface Recommendation {
  id: string;
  topic: string;
  reason: string;
  match_score: number;
  difficulty?: string;
  created_at?: string;
  resources: RecommendationResource[];
}

interface SuccessResponse {
  success: true;
  data: Recommendation | null;
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

type RecommendationResponse = SuccessResponse | ErrorResponse;

// ─── getRecommendations ─────────────────────────────────────────────────────
// Fetches the user's latest recommendation from the backend.
// Returns null inside data if the user has no recommendations yet.
export async function getRecommendations(): Promise<RecommendationResponse> {
  try {
    return await apiFetch<RecommendationResponse>("/recommendations");
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}

// ─── generateRecommendation ─────────────────────────────────────────────────
// Triggers the AI recommendation pipeline on the backend.
// Returns the newly generated recommendation with matching resources.
export async function generateRecommendation(): Promise<RecommendationResponse> {
  try {
    return await apiFetch<RecommendationResponse>("/recommendations/generate", {
      method: "POST",
    });
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
