import express from "express";
import { addTaskProgress, getTaskProgress } from "../controllers/progress.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import requireRole from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/tasks/{id}/progress:
 *   post:
 *     summary: Add progress update (Provider only)
 *     tags: [TaskProgress]
 *     security:
 *       - bearerAuth: []
 */

router.post(
  "/tasks/:id/progress",
  authenticate,
  requireRole("PROVIDER"),
  addTaskProgress
);

/**
 * @swagger
 * /api/tasks/{id}/progress:
 *   get:
 *     summary: Get progress for a task
 *     tags: [TaskProgress]
 *     security:
 *       - bearerAuth: []
 */

router.get(
    "/tasks/:id/progress", 
    authenticate, 
    getTaskProgress
);

export default router;
