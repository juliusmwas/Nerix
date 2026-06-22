/**

* Scan Routes
*
* Purpose:
* * Defines all scan-related API endpoints
* * Protects routes using authentication middleware
* * Connects controllers to Express router
*
* Base Path (recommended in app.js):
* /api
  */

import express from "express";

// Controllers
import {
  runScan,
  getScanHistory,
  getSingleScan,
  deleteScan,
} from "../controllers/scan.controller.js";

// Middleware
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

/**

* =========================
* RUN NEW SCAN
* =========================
* POST /api/scan
* Creates a new security scan
  */
router.post("/scan", authenticateUser, runScan);

/**

* =========================
* SCAN HISTORY
* =========================
* GET /api/history
* Returns all scans for logged-in user
  */
router.get("/history", authenticateUser, getScanHistory);

/**

* =========================
* SINGLE SCAN
* =========================
* GET /api/scans/:id
* Fetch one scan by ID
  */
router.get("/scans/:id", authenticateUser, getSingleScan);

/**

* =========================
* DELETE SCAN
* =========================
* DELETE /api/scans/:id
* Remove scan from history
  */
router.delete("/scans/:id", authenticateUser, deleteScan);

export default router;
