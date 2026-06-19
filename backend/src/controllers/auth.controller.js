/**
 * Authentication Controller
 *
 * Responsibilities:
 * - Register new users
 * - Authenticate existing users
 * - Generate authentication tokens (later)
 */

import bcrypt from "bcrypt";

import { findUserByEmail, createUser } from "../models/user.model.js";

/**
 * Register a new user
 *
 * Flow:
 * 1. Validate request data
 * 2. Check if email already exists
 * 3. Hash password
 * 4. Store user in database
 * 5. Return success response
 */
export async function register(req, res) {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    /**
     * Basic validation
     */
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    /**
     * Password confirmation check
     */
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    /**
     * Check whether user already exists
     */
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    /**
     * Hash password before storing
     *
     * Salt Rounds:
     * 12 is a good balance between
     * security and performance.
     */
    const hashedPassword = await bcrypt.hash(password, 12);

    /**
     * Create user record
     */
    const user = await createUser(fullName, email, hashedPassword);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
