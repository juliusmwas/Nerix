/**
 * SSL/TLS Scanner (Phase 2)
 *
 * Purpose:
 * - Validate HTTPS certificate
 * - Extract expiry date
 * - Check issuer info
 * - Evaluate SSL health score signals
 */

import tls from "tls";
import url from "url";

/**
 * Scan SSL certificate of a domain
 */
export function scanSSL(domain) {
  return new Promise((resolve, reject) => {
    try {
      /**
       * Normalize domain (remove protocol if exists)
       */
      const hostname = domain.replace(/https?:\/\//, "");

      /**
       * TLS connection options
       */
      const options = {
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false,
      };

      /**
       * Create secure socket connection
       */
      const socket = tls.connect(options, () => {
        const cert = socket.getPeerCertificate();

        if (!cert || Object.keys(cert).length === 0) {
          return resolve({
            valid: false,
            scoreImpact: -30,
            issues: [
              {
                type: "CRITICAL",
                category: "SSL",
                issue: "No SSL certificate found",
              },
            ],
          });
        }

        /**
         * Extract expiry date
         */
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const daysLeft = (validTo - now) / (1000 * 60 * 60 * 24);

        const issues = [];
        let scoreImpact = 0;

        /**
         * Expired certificate check
         */
        if (daysLeft < 0) {
          issues.push({
            type: "CRITICAL",
            category: "SSL",
            issue: "SSL certificate has expired",
          });
          scoreImpact -= 40;
        } else if (daysLeft < 30) {

        /**
         * Near expiry warning
         */
          issues.push({
            type: "WARNING",
            category: "SSL",
            issue: "SSL certificate expires soon",
          });
          scoreImpact -= 15;
        }

        /**
         * Trusted issuer check
         */
        if (!cert.issuer || !cert.issuer.O) {
          issues.push({
            type: "INFO",
            category: "SSL",
            issue: "Unknown certificate issuer",
          });
          scoreImpact -= 5;
        }

        socket.end();

        /**
         * Final result
         */
        resolve({
          valid: true,
          issuer: cert.issuer,
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          daysLeft: Math.floor(daysLeft),
          issues,
          scoreImpact,
        });
      });

      /**
       * Handle connection errors
       */
      socket.on("error", (err) => {
        resolve({
          valid: false,
          scoreImpact: -30,
          issues: [
            {
              type: "CRITICAL",
              category: "SSL",
              issue: "SSL connection failed",
            },
          ],
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}
