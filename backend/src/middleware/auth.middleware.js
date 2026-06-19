/**
 * Authentication Middleware
 *
 * Purpose:
 * - Protect private routes
 * - Verify JWT from HttpOnly cookie
 * - Attach authenticated user to request object
 */

import jwt from "jsonwebtoken";
import { findUserById } from "../models/user.model.js";

/**
 * Middleware: Authenticate User
 */
export async function authenticateUser(req, res, next) {
  try {
    /**
     * Step 1: Get token from cookies
     * (HttpOnly cookie cannot be accessed via frontend JS)
     */
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. No token provided.",
      });
    }

    /**
     * Step 2: Verify JWT token
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * Step 3: Get user from database
     * (prevents using stale/deleted accounts)
     */
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    /**
     * Step 4: Attach user to request object
     * so next middleware/controllers can use it
     */
    req.user = user;

    /**
     * Step 5: Continue to next handler
     */
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
