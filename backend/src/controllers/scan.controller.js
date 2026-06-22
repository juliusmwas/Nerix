/**

* Scan Controller (Phase 2 - Database Persistence)
*
* Purpose:
* * Executes scan engine
* * Receives results
* * Stores scan in PostgreSQL
* * Returns persisted scan response
*
* Flow:
* Client → Controller → Scan Service → DB Save → Response
  */

import { scanDomain } from "../services/scanner/scan.service.js";
import { createScan } from "../models/scan.model.js";

/**

* Run Security Scan
*
* Endpoint:
* POST /api/scan
  */
export async function runScan(req, res) {
  try {
    /**

  * =========================
  * INPUT EXTRACTION
  * =========================
    */
    const { domain } = req.body;

    /**

  * =========================
  * VALIDATION
  * =========================
    */
    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "Domain is required",
      });
    }

    /**

  * 
  * USER CONTEXT (TEMP)
  * =========================
  * Later replaced by auth middleware
    */
    const userId = req.user?.id || null;

    /**

  * =========================
  * RUN SCAN ENGINE
  * =========================
    */
    const result = await scanDomain(domain);

    /**

  * =========================
  * SAVE TO DATABASE
  * =========================
  * Persist scan result for history/dashboard
    */
    const savedScan = await createScan({
      userId,
      domain: result.domain,
      score: result.score,
      grade: result.grade,
      risk: result.risk,
      findings: result.findings,
    });

    /**

  * =========================
  * RESPONSE
  * =========================
    */
    return res.json({
      success: true,
      data: {
        scan: savedScan,
        breakdown: result.breakdown,
      },
    });
  } catch (error) {
    console.error("Scan Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Scan failed",
    });
  }
}
