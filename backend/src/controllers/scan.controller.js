/**

* Scan Controller
*
* Purpose:
* * Handles incoming scan requests
* * Executes scan engine
* * Stores results in PostgreSQL
* * Returns structured response
*
* Flow:
* Client → Auth Middleware → Controller → Scan Service → DB → Response
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
  * VALIDATION
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
  * AUTH USER (FROM MIDDLEWARE)
  * =========================
    */
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;

    /**

  * =========================
  * RUN SCAN ENGINE
  * =========================
    */
    const result = await scanDomain(domain);

    /**

  * =========================
  * VALIDATE SCAN RESULT
  * =========================
  * Prevents saving corrupted scan data
    */
    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Scan engine failed to return results",
      });
    }

    /**

  * =========================
  * SAVE TO DATABASE
  * =========================
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
