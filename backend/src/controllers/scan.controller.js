/**

* Scan Controller
*
* Purpose:
* * Handles scan requests from authenticated users
* * Executes scan engine
* * Persists scan results to PostgreSQL
* * Returns structured response for frontend
*
* Flow:
* Client → Auth Middleware → Controller → Scan Engine → DB → Response
  */

import { scanDomain } from "../services/scanner/scan.service.js";
import { createScan } from "../models/scan.model.js";

/**

* Run Security Scan
* Endpoint: POST /api/scan
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
  * INPUT VALIDATION
  * =========================
    */
    if (!domain || typeof domain !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid domain is required",
      });
    }

    /**

  * =========================
  * AUTH USER (REQUIRED)
  * =========================
  * Comes from auth.middleware.js
    */
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /**

  * =========================
  * RUN SCAN ENGINE
  * =========================
    */
    const result = await scanDomain(domain);

    /**

  * =========================
  * SAFETY CHECK
  * =========================
    */
    if (!result || !result.findings) {
      return res.status(500).json({
        success: false,
        message: "Scan engine failed",
      });
    }

    /**

  * =========================
  * SAVE TO DATABASE
  * =========================
    */
    const savedScan = await createScan({
      userId: user.id,
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
    return res.status(201).json({
      success: true,
      message: "Scan completed successfully",
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
