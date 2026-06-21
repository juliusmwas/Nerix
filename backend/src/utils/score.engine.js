/**
 * Security Score Engine (Phase 6)
 *
 * Purpose:
 * - Convert scan findings into a normalized 0–100 security score
 * - Assign severity weights (CRITICAL, WARNING, INFO, ERROR)
 * - Provide letter-grade classification (A–F)
 *
 * This is the SINGLE source of truth for scoring logic.
 */

export function calculateSecurityScore(findings = []) {
  // Start from perfect security score
  let score = 100;

  /**
   * =========================
   * SCORING WEIGHTS
   * =========================
   */
  const WEIGHTS = {
    CRITICAL: 25, // major security flaw
    ERROR: 20, // system-level issue
    WARNING: 10, // misconfiguration
    INFO: 3, // minor leak / info disclosure
  };

  for (const item of findings) {
    const type = item.type;

    // Apply penalty if type exists, otherwise default mild penalty
    const penalty = WEIGHTS[type] ?? 5;

    score -= penalty;
  }

  /**
   * =========================
   * SCORE NORMALIZATION
   * =========================
   * Ensure score stays within valid range
   */
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return score;
}

/**
 * Convert numeric score → letter grade
 */
export function getSecurityGrade(score) {
  if (score >= 90) return "A"; // Excellent security posture
  if (score >= 75) return "B"; // Good
  if (score >= 60) return "C"; // Moderate risk
  if (score >= 40) return "D"; // Weak security
  return "F"; // Critical risk
}

/**
 * Optional helper: risk label for UI
 */
export function getRiskLabel(grade) {
  switch (grade) {
    case "A":
      return "Excellent";
    case "B":
      return "Good";
    case "C":
      return "Moderate";
    case "D":
      return "Weak";
    default:
      return "Critical";
  }
}
