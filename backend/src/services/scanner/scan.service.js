/**
 * Scan Service (ORCHESTRATOR)
 *
 * Purpose:
 * - Fetch domain
 * - Run all scanners (Phase 1: headers only)
 * - Return combined results
 */

import axios from "axios";
import { scanHeaders } from "./headers.scan.js";

export async function scanDomain(domain) {
  try {
    const url = domain.startsWith("http") ? domain : `https://${domain}`;

    /**
     * Fetch response (headers only needed)
     */
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true,
    });

    const headers = response.headers;

    /**
     * Run headers scanner
     */
    const headerResult = scanHeaders(headers);

    return {
      domain,
      status: response.status,
      headers,
      findings: headerResult.findings,
      scoreImpact: headerResult.scoreImpact,
    };
  } catch (error) {
    throw new Error("Scan failed: " + error.message);
  }
}
