import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

/**
 * SECURITY MIDDLEWARE
 * Protects against common web vulnerabilities
 */
app.use(helmet());

/**
 * CORS CONFIGURATION
 * Allows frontend (React) to talk to backend
 */
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
    credentials: true,
  }),
);

/**
 * PARSE JSON REQUESTS
 * Allows backend to read JSON from frontend
 */
app.use(express.json());

/**
 * BASIC TEST ROUTE
 * Confirms backend is running
 */
app.get("/", (req, res) => {
  res.json({
    message: "Nerix API is running 🚀",
  });
});

export default app;
