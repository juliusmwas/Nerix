/**
 * Scan Service (Orchestrator) - Phase 2
 *
 * Purpose:
 * - Acts as the central scanning engine
 * - Coordinates multiple security scanners:
 *   1. HTTP Headers Scanner (Phase 1)
 *   2. SSL/TLS Scanner (Phase 2)
 *
 * Flow:
 * Domain → HTTP Request → Headers Scan → SSL Scan → Merge Results → Return API Response
 */

import axios from "axios";

// Phase 1 scanner
import { scanHeaders } from "./headers.scan.js";

// Phase 2 scanner
import { scanSSL } from "./ssl.scan.js";

/**
 * Main scanning function
 */
export async function scanDomain(domain) {
  try {
    /**
     * =========================
     * DOMAIN NORMALIZATION
     * =========================
     * Ensures consistent URL format
     */
    const url = domain.startsWith("http") ? domain : `https://${domain}`;

    /**
     * =========================
     * HTTP REQUEST (BASE LAYER)
     * =========================
     * We fetch the domain to:
     * - get HTTP status code
     * - extract response headers
     */
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true,
    });

    const headers = response.headers;

    /**
     * =========================
     * PHASE 1: HEADERS SCAN
     * =========================
     */
    const headerResult = scanHeaders(headers);

    /**
     * =========================
     * PHASE 2: SSL SCAN
     * =========================
     * Runs TLS certificate analysis
     */
    const sslResult = await scanSSL(domain);

    /**
     * =========================
     * MERGE RESULTS
     * =========================
     * Combine all findings and score impacts
     */
    const findings = [...headerResult.findings, ...sslResult.issues];

    const scoreImpact = headerResult.scoreImpact + sslResult.scoreImpact;

    /**
     * =========================
     * FINAL OUTPUT
     * =========================
     */
    return {
      domain,
      status: response.status,

      // raw data (useful for debugging / future expansion)
      headers,

      // security findings from all scanners
      findings,

      // total security score impact from all modules
      scoreImpact,

      // optional detailed breakdown (VERY useful later for UI)
      breakdown: {
        headers: headerResult,
        ssl: sslResult,
      },
    };
  } catch (error) {
    /**
     * =========================
     * ERROR HANDLING
     * =========================
     * Ensures scanner never crashes the server
     */
    throw new Error("Scan failed: " + error.message);
  }
}
