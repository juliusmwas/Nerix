/**

* Authentication Controller (Production Ready)
*
* Handles:
* * Register
* * Login
* * Logout
* * Current user
* * JWT HttpOnly cookie auth
    */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  findUserById,
} from "../models/user.model.js";

/**

* Validate email format
  */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  return emailRegex.test(email);
}

/**

* Password policy
  */
function isStrongPassword(password) {
  return (
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
  );
}

/**

* Generate JWT
  */
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**

* REGISTER
  */
export async function register(req, res) {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be 8+ chars, 1 uppercase, 1 number",
      });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await createUser(fullName, email, hashed);

    return res.status(201).json({
      success: true,
      message: "User created",
      user,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**

* LOGIN
  */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**

* LOGOUT
  */
export async function logout(req, res) {
  res.clearCookie("token");

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
}

/**

* GET CURRENT USER
  */
export async function getMe(req, res) {
  try {
    const user = await findUserById(req.user.id);

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
