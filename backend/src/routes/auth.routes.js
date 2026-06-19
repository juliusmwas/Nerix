/**
 * Authentication Routes
 *
 * Purpose:
 * - Define API endpoints for authentication
 * - Connect routes to controller functions
 *
 * Base path (to be set in app.js):
 * /api/auth
 */

import express from "express";
import { register } from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * Route: Register new user
 * Method: POST
 * Endpoint: /api/auth/register
 *
 * Body:
 * - fullName
 * - email
 * - password
 * - confirmPassword
 */
router.post("/register", register);

/**
 * Future routes (we will add soon):
 *
 * router.post("/login", login);
 * router.post("/logout", logout);
 * router.get("/me", authMiddleware, getMe);
 */

export default router;
