/**
 * DNS + Email Security Scanner (Phase 3)
 *
 * Purpose:
 * - Extract DNS records
 * - Validate email security (SPF, DMARC)
 * - Provide domain trust signals
 */

import dns from "dns/promises";

/**
 * Helper: extract SPF from TXT records
 */
function extractSPF(txtRecords) {
  return txtRecords.find((txt) => txt.includes("v=spf1"));
}

/**
 * Helper: extract DMARC record
 */
function extractDMARC(txtRecords) {
  return txtRecords.find((txt) => txt.includes("v=DMARC1"));
}

/**
 * Main DNS scanner
 */
export async function scanDNS(domain) {
  try {
    /**
     * =========================
     * DNS RECORD COLLECTION
     * =========================
     */

    const [aRecords, aaaaRecords, mxRecords, txtRecords] = await Promise.all([
      dns.resolve(domain, "A").catch(() => []),
      dns.resolve(domain, "AAAA").catch(() => []),
      dns.resolve(domain, "MX").catch(() => []),
      dns.resolveTxt(domain).catch(() => []),
    ]);

    /**
     * Flatten TXT records
     */
    const flatTXT = txtRecords.flat();

    /**
     * =========================
     * SECURITY ANALYSIS
     * =========================
     */

    const spf = extractSPF(flatTXT);
    const dmarc = await dns
      .resolveTxt(`_dmarc.${domain}`)
      .then((r) => r.flat().join(""))
      .catch(() => null);

    const findings = [];
    let scoreImpact = 0;

    /**
     * SPF CHECK
     */
    if (!spf) {
      findings.push({
        type: "CRITICAL",
        category: "EMAIL SECURITY",
        issue: "SPF record is missing",
      });
      scoreImpact -= 20;
    }

    /**
     * DMARC CHECK
     */
    if (!dmarc || !dmarc.includes("DMARC1")) {
      findings.push({
        type: "CRITICAL",
        category: "EMAIL SECURITY",
        issue: "DMARC policy not configured",
      });
      scoreImpact -= 25;
    }

    /**
     * MX RECORD CHECK
     */
    if (!mxRecords || mxRecords.length === 0) {
      findings.push({
        type: "WARNING",
        category: "EMAIL",
        issue: "No MX records found",
      });
      scoreImpact -= 10;
    }

    /**
     * =========================
     * FINAL OUTPUT
     * =========================
     */
    return {
      dns: {
        a: aRecords,
        aaaa: aaaaRecords,
        mx: mxRecords,
      },
      emailSecurity: {
        spf: !!spf,
        dmarc: !!dmarc,
      },
      findings,
      scoreImpact,
    };
  } catch (error) {
    return {
      dns: null,
      emailSecurity: null,
      findings: [
        {
          type: "ERROR",
          category: "DNS",
          issue: "DNS lookup failed",
        },
      ],
      scoreImpact: -30,
    };
  }
}
