import supabase from "../database/supabaseClient.js";

// ─── Profile Service ─────────────────────────────────────────────────────────
// Data-access layer for the user_profiles table.
// Name and email live in Supabase auth.users (user_metadata) and are
// never duplicated here — only app-specific fields are stored.

// ─── getProfile ──────────────────────────────────────────────────────────────
// Returns the profile row for the given user, or null when none exists yet.
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return data; // null when no row exists
}

// ─── upsertProfile ───────────────────────────────────────────────────────────
// Creates or updates the profile row for the given user.
// Always sets onboarding_completed = true and refreshes updated_at.
export async function upsertProfile(userId, fields) {
  const { phone_number, learning_goal, daily_learning_time, motivation } =
    fields;

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        user_id: userId,
        phone_number,
        learning_goal,
        daily_learning_time,
        motivation,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ─── updateProfile ───────────────────────────────────────────────────────────
// Partial update — only the supplied fields are written.
// Caller is responsible for omitting auth-only fields (name, email).
export async function updateProfile(userId, fields) {
  const { phone_number, learning_goal, daily_learning_time, motivation } =
    fields;

  // Build the update object with only the fields that were provided
  const updates = { updated_at: new Date().toISOString() };
  if (phone_number !== undefined) updates.phone_number = phone_number;
  if (learning_goal !== undefined) updates.learning_goal = learning_goal;
  if (daily_learning_time !== undefined)
    updates.daily_learning_time = daily_learning_time;
  if (motivation !== undefined) updates.motivation = motivation;

  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
