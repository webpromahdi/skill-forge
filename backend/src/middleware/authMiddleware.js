import supabase from "../database/supabaseClient.js";

// ─── authMiddleware ─────────────────────────────────────────────────────────
// Express middleware that protects routes behind JWT authentication.
//
// How it works:
//   1. Reads the Authorization header from the incoming request.
//      Expected format:  Authorization: Bearer <token>
//
//   2. Extracts the raw JWT string after "Bearer ".
//
//   3. If the header is missing or malformed → responds with 401.
//
//   4. Passes the token to supabase.auth.getUser(token) which validates it
//      server-side against the Supabase Auth service.  This guarantees the
//      token hasn't expired and corresponds to a real user.
//
//   5. If verification fails (expired / tampered / revoked) → 401.
//
//   6. On success the full Supabase user object is attached to req.user
//      so downstream controllers can access user.id, user.email,
//      user.user_metadata, etc. without another round-trip.
//
//   7. Calls next() so the request continues to the route handler.
//
// ─── Usage example ──────────────────────────────────────────────────────────
//
//   import authMiddleware from "../middleware/authMiddleware.js";
//
//   router.get("/progress", authMiddleware, getProgress);
//
// ─── Example protected request ──────────────────────────────────────────────
//
//   GET /api/progress
//   Headers:
//     Authorization: Bearer eyJhbGciOiJIUzI1NiIs…
//
// ─────────────────────────────────────────────────────────────────────────────

const authMiddleware = async (req, res, next) => {
  try {
    // ── 1. Read & validate the Authorization header ──────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    // ── 2. Extract the token (everything after "Bearer ") ────────────
    const token = authHeader.split(" ")[1];

    // ── 3. Verify the token with Supabase ────────────────────────────
    // supabase.auth.getUser() decodes and validates the JWT against
    // the Supabase Auth service, returning the associated user record.
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

    // ── 4. Attach the verified user to the request object ────────────
    // Downstream route handlers can now access req.user.id,
    // req.user.email, req.user.user_metadata, etc.
    req.user = user;

    // ── 5. Continue to the next middleware / route handler ────────────
    next();
  } catch (err) {
    console.error("[AUTH MIDDLEWARE ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default authMiddleware;
