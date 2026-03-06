import rateLimit from "express-rate-limit";

// ─── Login Rate Limiter ─────────────────────────────────────────────────────
// Limits login attempts to 5 requests per minute per IP address.
// This protects the POST /api/auth/login endpoint against brute-force
// password-guessing attacks.
//
// When the limit is exceeded the client receives a 429 response with a
// structured JSON body so the frontend can display a user-friendly message.
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1-minute sliding window
  max: 5, // allow at most 5 login attempts per window
  standardHeaders: true, // send RateLimit-* headers (draft-6)
  legacyHeaders: false, // disable X-RateLimit-* headers

  // Return a JSON body that matches the project's standard error format
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again later.",
    });
  },
});
