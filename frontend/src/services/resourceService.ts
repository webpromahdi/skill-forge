// ─── Resource Service (Frontend) ─────────────────────────────────────────────
// Handles resource-related API calls from the frontend.
//
// Flow:
//   1. ResourcesPage mounts → getResources() → GET /api/resources
//      Backend returns all resources from the Supabase resources table.
//
//   2. User clicks a category filter → getResources({ type: "videos" })
//      → GET /api/resources?type=videos
//      Backend filters and returns matching resources.
//
//   3. Search filtering is handled client-side for instant feedback
//      (no extra API call needed).

import { apiFetch } from "../lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Resource {
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

interface SuccessResponse {
  success: true;
  data: Resource[];
}

interface ErrorResponse {
  success: false;
  message: string;
}

type ResourceResponse = SuccessResponse | ErrorResponse;

// ─── getResources ───────────────────────────────────────────────────────────
// Fetches resources from the backend, optionally filtered by type and/or topic.
//
// Examples:
//   getResources()                    → all resources
//   getResources({ type: "videos" }) → only videos
//   getResources({ topic: "css" })   → only CSS resources
export async function getResources(
  filters: { type?: string; topic?: string } = {},
): Promise<ResourceResponse> {
  try {
    // Build query string from non-empty filters
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.topic) params.set("topic", filters.topic);

    const qs = params.toString();
    const endpoint = `/resources${qs ? `?${qs}` : ""}`;

    return await apiFetch<ResourceResponse>(endpoint);
  } catch {
    return { success: false, message: "Network error — please try again" };
  }
}
