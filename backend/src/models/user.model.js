import { pool } from "../config/db.js";

/**
 * Create users table if it doesn't exist
 */
export async function createUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(150) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * Find user by email
 */
export async function findUserByEmail(email) {
  const result = await pool.query(
    `
      SELECT *
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  return result.rows[0];
}

/**
 * Find user by ID
 */
export async function findUserById(id) {
  const result = await pool.query(
    `
      SELECT
        id,
        full_name,
        email,
        created_at
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
}

/**
 * Create a new user
 */
export async function createUser(fullName, email, hashedPassword) {
  const result = await pool.query(
    `
      INSERT INTO users (
        full_name,
        email,
        password
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        full_name,
        email,
        created_at
    `,
    [fullName, email, hashedPassword],
  );

  return result.rows[0];
}
