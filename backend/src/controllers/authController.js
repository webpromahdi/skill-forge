import supabase from "../database/supabaseClient.js";
import { registerSchema, loginSchema } from "../utils/authValidation.js";

// ─── registerUser ───────────────────────────────────────────────────────────
// POST /api/auth/register
//
// Flow:
//   1. Read the request body (name, email, password).
//   2. Validate with the Zod register schema.
//   3. If validation fails → return 400 with structured error array.
//   4. Call Supabase auth.signUp() to create the user account.
//      The user's display name is stored in user_metadata.
//   5. Return the newly created user data on success.
export const registerUser = async (req, res) => {
  try {
    // --- Step 1 & 2: Parse & validate input against the register schema ---
    const result = registerSchema.safeParse(req.body);

    // --- Step 3: Return validation errors if input is invalid ---
    if (!result.success) {
      // Zod's flatten() groups errors by field for easy client consumption
      const fieldErrors = result.error.flatten().fieldErrors;
      const errors = Object.entries(fieldErrors).map(([field, messages]) => ({
        field,
        message: messages[0], // Return the first error per field
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    const { name, email, password } = result.data;

    // --- Step 4: Create user via Supabase Auth ---
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Stored in user_metadata for later retrieval
      },
    });

    if (error) {
      // Log the real Supabase error server-side for debugging, but return
      // a generic message to prevent user-enumeration attacks (e.g. the
      // client should not learn whether an email is already registered).
      console.error("[REGISTER SUPABASE ERROR]", error.message);
      return res.status(400).json({
        success: false,
        message: "Unable to register user",
      });
    }

    // --- Step 5: Return success response with user data ---
    return res.status(201).json({
      success: true,
      data: {
        user: data.user,
      },
    });
  } catch (err) {
    console.error("[REGISTER ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ─── loginUser ──────────────────────────────────────────────────────────────
// POST /api/auth/login
//
// Flow:
//   1. Validate input with the Zod login schema.
//   2. Call Supabase auth.signInWithPassword() to authenticate.
//   3. Return the access_token (JWT) and user object on success.
export const loginUser = async (req, res) => {
  try {
    // --- Step 1: Validate email and password ---
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const errors = Object.entries(fieldErrors).map(([field, messages]) => ({
        field,
        message: messages[0],
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    const { email, password } = result.data;

    // --- Step 2: Authenticate with Supabase ---
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Return a generic auth error to avoid leaking whether the email exists
    if (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // --- Step 3: Return token and user data ---
    return res.status(200).json({
      success: true,
      data: {
        access_token: data.session.access_token,
        user: data.user,
      },
    });
  } catch (err) {
    console.error("[LOGIN ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ─── getCurrentUser ─────────────────────────────────────────────────────────
// GET /api/auth/me
//
// Reads the JWT from the Authorization header (Bearer <token>),
// verifies it with Supabase, and returns the authenticated user's data.
export const getCurrentUser = async (req, res) => {
  try {
    // --- Extract token from the Authorization header ---
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or malformed Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];

    // --- Verify the token with Supabase and retrieve the user ---
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // --- Return authenticated user data ---
    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    console.error("[GET USER ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
