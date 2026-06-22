/**
 * Nerix Backend Entry Point
 *
 * Responsibilities:
 * 1. Load environment variables
 * 2. Connect to PostgreSQL
 * 3. Initialize required database tables
 * 4. Start the Express server
 */

import app from "./src/app.js";
import dotenv from "dotenv";
import { pool } from "./src/config/db.js";
import { createUsersTable } from "./src/models/user.model.js";
import { createScansTable } from "./src/models/scan.model.js";

// Load variables from .env
dotenv.config();

/**
 * Application Port
 */
const PORT = process.env.PORT || 5000;

/**
 * Initialize application services before
 * accepting incoming requests.
 */
async function startServer() {
  try {
    console.log("🔄 Connecting to PostgreSQL...");

    /**
     * Simple connection test
     */
    await pool.query("SELECT NOW()");

    console.log("✅ PostgreSQL connected successfully");

    console.log("🔄 Initializing database tables...");

    /**
     * Create required tables if they do not exist
     */
    await createUsersTable();
    await createScansTable();

    console.log("✅ Database tables ready");

    /**
     * Start Express server
     */
    app.listen(PORT, () => {
      console.log(`🚀 Nerix backend running on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);

    process.exit(1);
  }
}

/**
 * Start the application
 */
startServer();
