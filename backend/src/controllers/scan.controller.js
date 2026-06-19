/**
 * Scan Controller (Phase 1)
 *
 * Purpose:
 * - Acts as the HTTP interface for the scan system
 * - Receives domain input from frontend
 * - Calls scan service (core engine)
 * - Calculates final security score
 * - Returns structured scan results
 *
 * Flow:
 * Client → Controller → Scan Service → Score Engine → Response
 */

import { scanDomain } from "../services/scanner/scan.service.js";
import { calculateScore } from "../utils/score.utils.js";

/**
 * Run Security Scan
 *
 * Endpoint:
 * POST /api/scan
 *
 * Body:
 * {
 *   domain: "example.com"
 * }
 */
export async function runScan(req, res) {
  try {
    /**
     * =========================
     * INPUT EXTRACTION
     * =========================
     * Extract domain from request body
     */
    const { domain } = req.body;

    /**
     * =========================
     * INPUT VALIDATION
     * =========================
     * Ensure domain is provided
     */
    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "Domain is required",
      });
    }

    /**
     * =========================
     * CORE SCAN EXECUTION
     * =========================
     * Calls scan engine (service layer)
     * - fetches domain
     * - analyzes headers (Phase 1)
     */
    const result = await scanDomain(domain);

    /**
     * =========================
     * SCORE CALCULATION
     * =========================
     * Converts scan findings into
     * a numerical security score (0–100)
     */
    const score = calculateScore(result);

    /**
     * =========================
     * RESPONSE STRUCTURE
     * =========================
     * Return standardized API response
     */
    return res.json({
      success: true,
      data: {
        domain: result.domain,
        status: result.status,
        score,
        findings: result.findings,
      },
    });
  } catch (error) {
    /**
     * =========================
     * ERROR HANDLING
     * =========================
     * Handles unexpected failures
     */
    console.error("Scan Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Scan failed",
    });
  }
}
