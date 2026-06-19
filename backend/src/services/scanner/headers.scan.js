/**
 * Headers Security Scanner (PHASE 1 CORE MODULE)
 *
 * Purpose:
 * - Analyze HTTP response headers
 * - Detect missing security headers
 * - Return structured findings
 */

export function scanHeaders(headers = {}) {
  const findings = [];
  let scoreImpact = 0;

  /**
   * Content Security Policy (CSP)
   */
  if (!headers["content-security-policy"]) {
    findings.push({
      type: "CRITICAL",
      category: "CSP",
      issue: "Content-Security-Policy header is missing",
    });
    scoreImpact -= 25;
  }

  /**
   * HSTS
   */
  if (!headers["strict-transport-security"]) {
    findings.push({
      type: "CRITICAL",
      category: "HSTS",
      issue: "Strict-Transport-Security header is missing",
    });
    scoreImpact -= 20;
  }

  /**
   * X-Frame-Options
   */
  if (!headers["x-frame-options"]) {
    findings.push({
      type: "WARNING",
      category: "Clickjacking Protection",
      issue: "X-Frame-Options header is missing",
    });
    scoreImpact -= 10;
  }

  /**
   * X-Content-Type-Options
   */
  if (!headers["x-content-type-options"]) {
    findings.push({
      type: "WARNING",
      category: "MIME Sniffing Protection",
      issue: "X-Content-Type-Options header is missing",
    });
    scoreImpact -= 10;
  }

  /**
   * Referrer Policy
   */
  if (!headers["referrer-policy"]) {
    findings.push({
      type: "INFO",
      category: "Privacy",
      issue: "Referrer-Policy header is missing",
    });
    scoreImpact -= 5;
  }

  return {
    findings,
    scoreImpact,
  };
}
