import supabase from "../database/supabaseClient.js";

// ─── Learning Path Service ──────────────────────────────────────────────────
// Data-access layer for learning_goals and skill_paths tables.

// ─── getAllGoals ────────────────────────────────────────────────────────────
// Returns every learning goal from the learning_goals table.
export async function getAllGoals() {
  const { data, error } = await supabase
    .from("learning_goals")
    .select("id, name, description")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

// ─── getSkillPath ──────────────────────────────────────────────────────────
// Returns the learning path (skill, duration, phases) for the given skill name.
export async function getSkillPath(skill) {
  const { data, error } = await supabase
    .from("skill_paths")
    .select("id, skill, duration, phases")
    .eq("skill", skill)
    .maybeSingle();

  if (error) throw error;
  return data;
}
