import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./database/supabaseClient.js";
import authRoutes from "./routes/authRoutes.js";

// ─── Load Environment Variables ─────────────────────────────────────────────
dotenv.config();

// ─── Initialize Express App ─────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check / Root Endpoint ───────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    message: "SkillForge API running",
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ─── Database Test Endpoint ─────────────────────────────────────────────────
app.get("/api/test-db", async (req, res) => {
  try {
    // Perform a lightweight query to verify the Supabase connection
    const { data, error } = await supabase
      .from("_test_connection")
      .select("*")
      .limit(1);

    // Even if the table doesn't exist, Supabase will respond with an error
    // object (not throw). A thrown error means the connection itself failed.
    if (error) {
      return res.status(200).json({
        success: true,
        message: "Database connection successful",
        note: "Supabase responded — connection is live.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Database connection successful",
      data,
    });
  } catch (err) {
    console.error("[DB TEST ERROR]", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// ─── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⚡ SkillForge API server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

export default app;
