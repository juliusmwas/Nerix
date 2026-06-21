/**
 * Scan Service (Orchestrator)
 *
 * Purpose:
 * - Central security scanning engine
 * - Coordinates multiple scanners:
 *   1. HTTP Headers Scanner (Phase 1)
 *   2. SSL/TLS Scanner (Phase 2)
 *   3. DNS + Email Security Scanner (Phase 3)
 *   4. Redirect Chain Scanner (Phase 4)
 *
 * Flow:
 * Domain → HTTP Request → Headers → SSL → DNS → Redirects → Merge → Score → Response
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

// =========================
// PHASE 4: REDIRECT SCANNER
// =========================
import { scanRedirects } from "./redirect.scan.js";

/**
 * Main scanning function (Orchestrator)
 */
export async function scanDomain(domain) {
  try {
    /**
     * =========================
     * DOMAIN NORMALIZATION
     * =========================
     */
    const url = domain.startsWith("http") ? domain : `https://${domain}`;

    /**
     * =========================
     * BASE HTTP REQUEST
     * =========================
     * Used for:
     * - status code
     * - headers extraction
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
     */
    const dnsResult = await scanDNS(domain);

    /**
     * =========================
     * PHASE 4: REDIRECT SCAN
     * =========================
     */
    const redirectResult = await scanRedirects(domain);

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
      ...redirectResult.findings,
    ];

    /**
     * =========================
     * MERGE SCORE IMPACT
     * =========================
     */
    const scoreImpact =
      headerResult.scoreImpact +
      sslResult.scoreImpact +
      dnsResult.scoreImpact +
      redirectResult.scoreImpact;

    /**
     * =========================
     * FINAL RESPONSE OBJECT
     * =========================
     */
    return {
      domain,
      status: response.status,

      // raw HTTP headers (debug + future analytics)
      headers,

      // combined findings from all scanners
      findings,

      // total security score adjustment
      scoreImpact,

      /**
       * =========================
       * FULL BREAKDOWN (UI READY)
       * =========================
       * Used for frontend dashboards:
       * - per module scoring
       * - drill-down analysis
       */
      breakdown: {
        headers: headerResult,
        ssl: sslResult,
        dns: dnsResult,
        redirects: redirectResult,
      },
    };
  } catch (error) {
    /**
     * =========================
     * ERROR HANDLING
     * =========================
     */
    throw new Error("Scan failed: " + error.message);
  }
}
