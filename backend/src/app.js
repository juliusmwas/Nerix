/**
 * Nerix Backend Application
 *
 * Responsibilities:
 * - Configure Express server
 * - Apply security middleware
 * - Enable request parsing
 * - Enable cookie-based authentication
 * - Mount API routes
 * - Handle errors and unknown routes
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// Routes
import authRoutes from "./routes/auth.routes.js";

const app = express();

/**
 * =========================
 * SECURITY MIDDLEWARE
 * =========================
 */
app.use(helmet());

/**
 * =========================
 * CORS CONFIGURATION
 * =========================
 * Allows frontend to communicate with backend securely
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // IMPORTANT for cookies
  }),
);

/**
 * =========================
 * PARSERS
 * =========================
 * Enable JSON body parsing
 * Enable cookie parsing (CRITICAL for JWT auth)
 */
app.use(express.json());
app.use(cookieParser());

/**
 * =========================
 * API ROUTES
 * =========================
 */
app.use("/api/auth", authRoutes);

/**
 * =========================
 * HEALTH CHECK ROUTE
 * =========================
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
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
