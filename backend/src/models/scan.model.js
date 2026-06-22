/**

* Scan Model
*
* Purpose:
* * Manage scan persistence in PostgreSQL
* * Create scans table
* * Save scan results
* * Retrieve scan history
* * Retrieve individual scans
*
* Relationship:
*
* users
* └── scans
*
* One user can have many scans.
  */

import { pool } from "../config/db.js";

/**
 CREATE SCANS TABLE
   Creates the scans table if it doesn't exist.
 */
export async function createScansTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS scans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    domain VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    grade VARCHAR(5) NOT NULL,
    risk VARCHAR(50) NOT NULL,
    findings JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_scan_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    );
    `);
}

/**
 SAVE SCAN
    Stores a completed scan result.
  */
export async function createScan({
  userId,
  domain,
  score,
  grade,
  risk,
  findings,
}) {
  const result = await pool.query(
    `    INSERT INTO scans (
       user_id,
       domain,
       score,
       grade,
       risk,
       findings
     )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *
   `,
    [userId, domain, score, grade, risk, JSON.stringify(findings)],
  );

  return result.rows[0];
}

/**
 GET SCAN BY ID
 Retrieves a single scan.
  */
export async function findScanById(scanId) {
  const result = await pool.query(
    `    SELECT *
     FROM scans
     WHERE id = $1
   `,
    [scanId],
  );

  return result.rows[0];
}

/**
GET USER SCANS

Returns scan history for a user.

 Most recent scans appear first.
  */
export async function findScansByUserId(userId) {
  const result = await pool.query(
    `    SELECT
       id,
       domain,
       score,
       grade,
       risk,
       created_at
     FROM scans
     WHERE user_id = $1
     ORDER BY created_at DESC
   `,
    [userId],
  );

  return result.rows;
}

/**
 DELETE SCAN
 Allows users to remove scans.
  */
export async function deleteScan(scanId, userId) {
  const result = await pool.query(
    `    DELETE FROM scans
     WHERE id = $1
     AND user_id = $2
     RETURNING id
   `,
    [scanId, userId],
  );

  return result.rows[0];
}

/**
 COUNT USER SCANS

 Useful for:
    Dashboard statistics
    Free plan limits
    Subscription plans
*/
export async function countUserScans(userId) {
  const result = await pool.query(
    `  SELECT COUNT(*)::INTEGER AS total
     FROM scans
     WHERE user_id = $1
     `,
    [userId],
  );

  return result.rows[0].total;
}
