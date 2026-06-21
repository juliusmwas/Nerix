/**
 * Redirect Chain Scanner (Phase 4)
 *
 * Purpose:
 * - Trace HTTP redirects
 * - Detect redirect loops
 * - Check HTTPS enforcement
 * - Identify insecure redirect patterns
 */

import axios from "axios";

/**
 * Scan redirect chain of a domain
 */
export async function scanRedirects(domain) {
  try {
    const url = domain.startsWith("http") ? domain : `http://${domain}`; // IMPORTANT: start from HTTP to capture redirects

    const visited = new Set();
    const chain = [];

    let currentUrl = url;
    let maxHops = 10; // prevent infinite loops

    while (maxHops > 0) {
      maxHops--;

      /**
       * Stop loop detection
       */
      if (visited.has(currentUrl)) {
        chain.push({
          url: currentUrl,
          type: "LOOP_DETECTED",
        });

        return {
          chain,
          finalUrl: currentUrl,
          loopDetected: true,
          scoreImpact: -30,
          findings: [
            {
              type: "CRITICAL",
              category: "REDIRECT",
              issue: "Redirect loop detected",
            },
          ],
        };
      }

      visited.add(currentUrl);

      try {
        const response = await axios.get(currentUrl, {
          maxRedirects: 0, // we handle manually
          validateStatus: () => true,
        });

        chain.push({
          url: currentUrl,
          status: response.status,
        });

        /**
         * Check if redirect exists
         */
        const location = response.headers.location;

        if (
          location &&
          (response.status === 301 ||
            response.status === 302 ||
            response.status === 307 ||
            response.status === 308)
        ) {
          currentUrl = location.startsWith("http")
            ? location
            : new URL(location, currentUrl).href;
          continue;
        }

        /**
         * No more redirects → final destination reached
         */
        return {
          chain,
          finalUrl: currentUrl,
          loopDetected: false,
          httpsEnforced: currentUrl.startsWith("https"),
          scoreImpact: currentUrl.startsWith("https") ? 0 : -15,
          findings: currentUrl.startsWith("https")
            ? []
            : [
                {
                  type: "WARNING",
                  category: "REDIRECT",
                  issue: "Site does not enforce HTTPS redirect",
                },
              ],
        };
      } catch (err) {
        return {
          chain,
          finalUrl: currentUrl,
          loopDetected: false,
          scoreImpact: -10,
          findings: [
            {
              type: "ERROR",
              category: "REDIRECT",
              issue: "Redirect chain failed",
            },
          ],
        };
      }
    }

    /**
     * Safety fallback (too many redirects)
     */
    return {
      chain,
      finalUrl: currentUrl,
      loopDetected: true,
      scoreImpact: -40,
      findings: [
        {
          type: "CRITICAL",
          category: "REDIRECT",
          issue: "Too many redirects (possible loop)",
        },
      ],
    };
  } catch (error) {
    return {
      chain: [],
      finalUrl: null,
      loopDetected: false,
      scoreImpact: -20,
      findings: [
        {
          type: "ERROR",
          category: "REDIRECT",
          issue: "Redirect scan failed",
        },
      ],
    };
  }
}
