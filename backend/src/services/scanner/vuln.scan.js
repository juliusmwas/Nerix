/**
 * Vulnerability Heuristics Scanner (Phase 5)
 *
 * Purpose:
 * - Detect security misconfigurations
 * - Identify exposed technology fingerprints
 * - Flag weak infrastructure signals
 * - Provide heuristic-based vulnerability scoring
 */

export function scanVulnerabilities(headers) {
  try {
    const findings = [];
    let scoreImpact = 0;

    /**
     * =========================
     * 1. SERVER FINGERPRINT LEAK
     * =========================
     */
    const server = headers["server"];
    if (server) {
      findings.push({
        type: "INFO",
        category: "FINGERPRINT",
        issue: `Server header exposed: ${server}`,
      });

      // small penalty (information leakage)
      scoreImpact -= 5;
    }

    /**
     * =========================
     * 2. X-POWERED-BY LEAK
     * =========================
     * Reveals backend framework
     */
    const poweredBy = headers["x-powered-by"];
    if (poweredBy) {
      findings.push({
        type: "WARNING",
        category: "FINGERPRINT",
        issue: `X-Powered-By header exposed: ${poweredBy}`,
      });

      scoreImpact -= 10;
    }

    /**
     * =========================
     * 3. SECURITY HEADERS CHECK (LIGHT HEURISTICS)
     * =========================
     */

    const securityHeaders = [
      "content-security-policy",
      "strict-transport-security",
      "x-frame-options",
      "x-content-type-options",
    ];

    securityHeaders.forEach((header) => {
      if (!headers[header]) {
        findings.push({
          type: "WARNING",
          category: "SECURITY HEADER",
          issue: `Missing ${header}`,
        });

        scoreImpact -= 3;
      }
    });

    /**
     * =========================
     * 4. CACHE DISCLOSURE RISK
     * =========================
     */
    const cache = headers["cache-control"];

    if (cache && cache.includes("no-store") === false) {
      findings.push({
        type: "INFO",
        category: "CACHE",
        issue: "Potential sensitive caching behavior detected",
      });

      scoreImpact -= 2;
    }

    /**
     * =========================
     * FINAL OUTPUT
     * =========================
     */
    return {
      findings,
      scoreImpact,
    };
  } catch (error) {
    return {
      findings: [
        {
          type: "ERROR",
          category: "VULNERABILITY",
          issue: "Vulnerability scan failed",
        },
      ],
      scoreImpact: -10,
    };
  }
}
