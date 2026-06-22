import express from "express";
import { runScan, getScanHistory } from "../controllers/scan.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Run new scan (protected)
 */
router.post("/scan", authenticateUser, runScan);

/**
 * Get scan history (protected)
 */
router.get("/history", authenticateUser, getScanHistory);

export default router;
