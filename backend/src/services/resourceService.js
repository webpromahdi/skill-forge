// ─── Resource Service ────────────────────────────────────────────────────────
// Data-access layer for the resources table.
//
// Flow: frontend → resourceRoutes → resourceController → resourceService
//       → Supabase resources table → response

import supabase from "../database/supabaseClient.js";

// ─── getAllResources ────────────────────────────────────────────────────────
// Fetches resources with optional filtering by topic and/or type.
//
// @param {Object} filters - Optional query-string filters
// @param {string} [filters.topic]  - Filter by topic (case-insensitive, partial match)
// @param {string} [filters.type]   - Filter by resource type (videos, articles, etc.)
// @returns {Array} Matching resource rows
export async function getAllResources(filters = {}) {
  let query = supabase.from("resources").select("*");

  // Apply type filter if provided
  if (filters.type) {
    query = query.eq("type", filters.type.toLowerCase());
  }

  // Apply topic filter if provided (case-insensitive partial match)
  if (filters.topic) {
    query = query.ilike("topic", `%${filters.topic}%`);
  }

  // Order by rating descending for a sensible default sort
  query = query.order("rating", { ascending: false });

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}
