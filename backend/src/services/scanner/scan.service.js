/**
 * Scan Service (Orchestrator)
 *
 * Purpose:
 * - Central security scanning engine
 * - Runs all scanners (Phase 1–5)
 * - Uses centralized scoring engine (Phase 6)
 *
 * Flow:
 * Domain → Scan Layers → Findings → Score Engine → Grade → Response
 */

import axios from "axios";

// =========================
// SCANNERS (PHASE 1–5)
// =========================
import { scanHeaders } from "./headers.scan.js";
import { scanSSL } from "./ssl.scan.js";
import { scanDNS } from "./dns.scan.js";
import { scanRedirects } from "./redirect.scan.js";
import { scanVulnerabilities } from "./vuln.scan.js";

// =========================
// SCORING ENGINE (PHASE 6)
// =========================
import {
  calculateSecurityScore,
  getSecurityGrade,
  getRiskLabel,
} from "../utils/score.engine.js";

/**
 * Main scanning function
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
     */
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true,
    });

    const headers = response.headers;

    /**
     * =========================
     * RUN ALL SCANNERS
     * =========================
     */
    const headerResult = scanHeaders(headers);
    const sslResult = await scanSSL(domain);
    const dnsResult = await scanDNS(domain);
    const redirectResult = await scanRedirects(domain);
    const vulnResult = scanVulnerabilities(headers);

    /**
     * =========================
     * MERGE FINDINGS
     * =========================
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
     * PHASE 6: SCORING ENGINE
     * =========================
     */
    const score = calculateSecurityScore(findings);
    const grade = getSecurityGrade(score);
    const risk = getRiskLabel(grade);

    /**
     * =========================
     * FINAL RESPONSE
     * =========================
     */
    return {
      domain,
      status: response.status,
      headers,

      findings,

      // PHASE 6 OUTPUT
      score,
      grade,
      risk,

      breakdown: {
        headers: headerResult,
        ssl: sslResult,
        dns: dnsResult,
        redirects: redirectResult,
        vulnerabilities: vulnResult,
      },
    };
  } catch (error) {
    throw new Error("Scan failed: " + error.message);
  }
}
