/**
 * Nerix Backend Application
 *
 * Responsibilities:
 * - Configure Express server
 * - Apply global middleware (security, CORS, JSON parsing)
 * - Mount API routes
 * - Define base API structure
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";

// Routes
import authRoutes from "./routes/auth.routes.js";

const app = express();

/**
 * =========================
 * SECURITY MIDDLEWARE
 * =========================
 * helmet() sets secure HTTP headers
 * to protect against common attacks
 */
app.use(helmet());

/**
 * =========================
 * CORS CONFIGURATION
 * =========================
 * Allows frontend (React) to communicate with backend
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/**
 * =========================
 * BODY PARSER
 * =========================
 * Enables reading JSON request bodies
 */
app.use(express.json());

/**
 * =========================
 * API ROUTES
 * =========================
 * All API routes are prefixed with /api
 */

/**
 * AUTH ROUTES
 * Handles:
 * - Register
 * - Login (future)
 * - Logout (future)
 */
app.use("/api/auth", authRoutes);

/**
 * =========================
 * HEALTH CHECK ROUTE
 * =========================
 * Used to confirm backend is running
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Nerix API is running 🚀",
  });
});

/**
 * =========================
 * GLOBAL 404 HANDLER
 * =========================
 * Handles unknown routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
