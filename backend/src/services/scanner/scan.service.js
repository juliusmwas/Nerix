/**
 * Scan Service (Orchestrator)
 *
 * Purpose:
 * - Acts as the central scanning engine
 * - Coordinates multiple security scanners:
 *   1. HTTP Headers Scanner (Phase 1)
 *   2. SSL/TLS Scanner (Phase 2)
 *   3. DNS + Email Security Scanner (Phase 3)
 *
 * Flow:
 * Domain → HTTP Request → Headers Scan → SSL Scan → DNS Scan → Merge Results → Return API Response
 */

import axios from "axios";

// =========================
// PHASE 1: HEADERS SCANNER
// =========================
import { scanHeaders } from "./headers.scan.js";

// =========================
// PHASE 2: SSL SCANNER
// =========================
import { scanSSL } from "./ssl.scan.js";

// =========================
// PHASE 3: DNS SCANNER
// =========================
import { scanDNS } from "./dns.scan.js";

/**
 * Main scanning function (Orchestrator)
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
     * Used to extract:
     * - status code
     * - response headers
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
     */
    const sslResult = await scanSSL(domain);

    /**
     * =========================
     * PHASE 3: DNS SCAN
     * =========================
     * IMPORTANT:
     * DNS may fail independently → handled safely
     */
    const dnsResult = await scanDNS(domain);

    /**
     * =========================
     * MERGE FINDINGS
     * =========================
     * Combine all security issues
     */
    const findings = [
      ...headerResult.findings,
      ...sslResult.issues,
      ...dnsResult.findings,
    ];

    /**
     * =========================
     * MERGE SCORE IMPACT
     * =========================
     * Total security penalty from all scanners
     */
    const scoreImpact =
      headerResult.scoreImpact + sslResult.scoreImpact + dnsResult.scoreImpact;

    /**
     * =========================
     * FINAL RESPONSE OBJECT
     * =========================
     */
    return {
      domain,
      status: response.status,

      // raw HTTP response headers
      headers,

      // security issues combined from all scanners
      findings,

      // total score adjustment
      scoreImpact,

      // full breakdown for frontend analytics UI
      breakdown: {
        headers: headerResult,
        ssl: sslResult,
        dns: dnsResult,
      },
    };
  } catch (error) {
    /**
     * =========================
     * ERROR HANDLING
     * =========================
     * Prevents backend crash on scan failure
     */
    throw new Error("Scan failed: " + error.message);
  }
}
