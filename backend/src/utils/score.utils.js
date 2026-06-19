/**
 * Final Security Score Calculator
 *
 * Base score: 100
 * Deducts based on scanner modules
 */

export function calculateScore(scanResult) {
  let score = 100;

  /**
   * Apply header scan penalties
   */
  if (scanResult.scoreImpact) {
    score += scanResult.scoreImpact;
  }

  return Math.max(0, Math.min(100, score));
}
