import express from "express";
import { createSkill, updateSkill, getMySkills} from "../controllers/skill.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import requireRole from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create a new skill (Provider only)
 *     tags: [Skill]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category, experienceYears, workNature, hourlyRate, currency]
 *     responses:
 *       201:
 *         description: Skill created
 *       400:
 *         description: Failed to create skill
 */

router.post(
  "/skills",
  authenticate,
  requireRole("PROVIDER"),
  createSkill
);

/**
 * @swagger
 * /api/skills/my:
 *   get:
 *     summary: Get skills created by current provider
 *     tags: [Skill]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of skills
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/skills/my",
  authenticate,
  requireRole("PROVIDER"),
  getMySkills
);

/**
 * @swagger
 * /api/skills/{id}:
 *   patch:
 *     summary: Update an existing skill (Provider only)
 *     tags: [Skill]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the skill to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               experienceYears:
 *                 type: integer
 *               workNature:
 *                 type: string
 *               hourlyRate:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Skill updated successfully
 *       400:
 *         description: Update failed
 *       403:
 *         description: Unauthorized
 */


router.patch(
  "/skills/:id",
  authenticate,
  requireRole("PROVIDER"),
  updateSkill
);



export default router;