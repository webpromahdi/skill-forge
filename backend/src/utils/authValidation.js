import { z } from "zod";

// ─── Password Validation Regex ──────────────────────────────────────────────
// Requires at least:
//   • one lowercase letter  (?=.*[a-z])
//   • one uppercase letter  (?=.*[A-Z])
//   • one digit             (?=.*\d)
//   • one special character (?=.*[\W_])   (any non-word char or underscore)
//   • minimum 8 characters  .{8,}
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// ─── Register Schema ────────────────────────────────────────────────────────
// Validates the request body for user registration.
// • name  – required, at least 2 characters
// • email – must be a syntactically valid email address
// • password – must satisfy the complexity regex above
export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Must be a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      PASSWORD_REGEX,
      "Password must include an uppercase letter, a lowercase letter, a number, and a special character",
    ),
});

// ─── Login Schema ───────────────────────────────────────────────────────────
// Validates the request body for user login.
// Both email and password are required; no further complexity checks on login
// because the password was already validated at registration time.
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Must be a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});
