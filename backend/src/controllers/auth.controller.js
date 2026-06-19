/**
 * Authentication Controller (Production Version)
 *
 * Handles:
 * - User registration
 * - User login
 * - Input validation
 * - Password hashing
 * - JWT authentication (HttpOnly cookies)
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { findUserByEmail, createUser } from "../models/user.model.js";

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password policy (Option B)
 * - Min 8 chars
 * - 1 uppercase
 * - 1 number
 */
function isStrongPassword(password) {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return minLength && hasUppercase && hasNumber;
}

/**
 * Generate JWT token
 */
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * =========================
 * REGISTER USER
 * =========================
 */
export async function register(req, res) {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    /**
     * Step 1: Validate input
     */
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    /**
     * Step 2: Email validation
     */
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    /**
     * Step 3: Password match
     */
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    /**
     * Step 4: Password strength check
     */
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be 8+ chars, include 1 uppercase and 1 number.",
      });
    }

    /**
     * Step 5: Check existing user
     */
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    /**
     * Step 6: Hash password
     */
    const hashedPassword = await bcrypt.hash(password, 12);

    /**
     * Step 7: Create user
     */
    const user = await createUser(fullName, email, hashedPassword);

    /**
     * Step 8: Return response (no password exposed)
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

/**
 * =========================
 * LOGIN USER
 * =========================
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    /**
     * Step 1: Validate input
     */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required.",
      });
    }

    /**
     * Step 2: Find user
     */
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    /**
     * Step 3: Compare password
     */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    /**
     * Step 4: Generate JWT token
     */
    const token = generateToken(user.id);

    /**
     * Step 5: Store token in HttpOnly cookie
     */
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    /**
     * Step 6: Return safe user data
     */
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
