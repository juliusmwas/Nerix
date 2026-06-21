/**
 * Scan Service (Orchestrator)
 *
 * Purpose:
 * - Central security scanning engine
 * - Coordinates all scanners:
 *   1. HTTP Headers Scanner (Phase 1)
 *   2. SSL/TLS Scanner (Phase 2)
 *   3. DNS + Email Security Scanner (Phase 3)
 *   4. Redirect Chain Scanner (Phase 4)
 *   5. Vulnerability Heuristics Scanner (Phase 5)
 *
 * Flow:
 * Domain → HTTP Request → Headers → SSL → DNS → Redirects → Vulnerability → Merge → Score → Response
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

// =========================
// PHASE 5: VULNERABILITY SCANNER
// =========================
import { scanVulnerabilities } from "./vuln.scan.js";

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
     * PHASE 5: VULNERABILITY SCAN
     * =========================
     * Uses headers + combined context signals
     */
    const vulnResult = scanVulnerabilities(headers);

    /**
     * =========================
     * MERGE FINDINGS
     * =========================
     * Combine all security issues from all scanners
     */
    const findings = [
      ...headerResult.findings,
      ...sslResult.issues,
      ...dnsResult.findings,
      ...redirectResult.findings,
      ...vulnResult.findings,
    ];

    /**
     * =========================
     * MERGE SCORE IMPACT
     * =========================
     * Total security penalty from all modules
     */
    const scoreImpact =
      headerResult.scoreImpact +
      sslResult.scoreImpact +
      dnsResult.scoreImpact +
      redirectResult.scoreImpact +
      vulnResult.scoreImpact;

    /**
     * =========================
     * FINAL RESPONSE OBJECT
     * =========================
     */
    return {
      domain,
      status: response.status,

      // raw HTTP headers (debug + analytics)
      headers,

      // all security findings combined
      findings,

      // total security score adjustment
      scoreImpact,

      /**
       * =========================
       * FULL BREAKDOWN (UI READY)
       * =========================
       */
      breakdown: {
        headers: headerResult,
        ssl: sslResult,
        dns: dnsResult,
        redirects: redirectResult,
        vulnerabilities: vulnResult,
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
