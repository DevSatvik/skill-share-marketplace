import express from "express";
import {
  registerAccount,
  loginAccount,
  getProfile,
} from "../controllers/account.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register an account
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role, email, password, mobileNumber, type]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [USER, PROVIDER]
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [INDIVIDUAL, COMPANY]
 *     responses:
 *       201:
 *         description: Account registered successfully
 *       400:
 *         description: Registration failed
 */

router.post("/register", registerAccount);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Login failed
 */

router.post("/login", loginAccount);

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get profile of logged-in user
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */

router.get("/me", authenticate, getProfile);

export default router;
