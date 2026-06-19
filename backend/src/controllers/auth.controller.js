/**
 * Authentication Controller (Secure Version)
 *
 * Handles:
 * - User registration
 * - Input validation
 * - Password hashing
 * - User creation
 */

import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../models/user.model.js";

/**
 * Validate email format using regex
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength (Option B rules)
 *
 * Rules:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number
 */
function isStrongPassword(password) {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return minLength && hasUppercase && hasNumber;
}

/**
 * REGISTER USER
 */
export async function register(req, res) {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    /**
     * Step 1: Check required fields
     */
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    /**
     * Step 2: Validate email format
     */
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    /**
     * Step 3: Password match check
     */
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    /**
     * Step 4: Password strength validation
     */
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters, include 1 uppercase letter and 1 number.",
      });
    }

    /**
     * Step 5: Check if user already exists
     */
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    /**
     * Step 6: Hash password securely
     */
    const hashedPassword = await bcrypt.hash(password, 12);

    /**
     * Step 7: Create user in database
     */
    const user = await createUser(fullName, email, hashedPassword);

    /**
     * Step 8: Return success response
     */
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
