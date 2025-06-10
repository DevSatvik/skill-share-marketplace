import express from "express";
import { 
  createTask, 
  markTaskComplete, 
  updateTask, 
  getProviderAcceptedTasks, 
  getOpenTasks, 
  getOffersOnUserPostedTasks,
  providerMarkTaskComplete,
  userAcceptCompletion,
  userRejectCompletion, 
  getUserPostedTasks
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import requireRole from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task (User only)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Task created
 */

router.post(
    "/tasks", 
    authenticate, 
    requireRole("USER"), 
    createTask
);

/**
 * @swagger
 * /api/tasks/open:
 *   get:
 *     summary: List open tasks
 *     tags: [Task]
 *     responses:
 *       200:
 *         description: List of open tasks
 */

router.get(
    "/tasks/open", 
    authenticate, 
    requireRole("PROVIDER"), 
    getOpenTasks
);

/**
 * @swagger
 * /api/tasks/user/posted:
 *   get:
 *     summary: List tasks posted by current user
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user posted tasks
 */

router.get(
  "/tasks/user/posted",
  authenticate,
  requireRole("USER"),
  getUserPostedTasks
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update task (User only)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */

router.patch(
    "/tasks/:id", 
    authenticate, 
    requireRole("USER"), 
    updateTask
);

/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   post:
 *     summary: User marks task as completed
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 */

router.post(
  "/tasks/:id/complete",
  authenticate,
  requireRole("USER"),
  markTaskComplete
);

/**
 * @swagger
 * /api/tasks/provider/accepted:
 *   get:
 *     summary: Get tasks accepted by current provider
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accepted tasks
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/tasks/provider/accepted",
  authenticate,
  requireRole("PROVIDER"),
  getProviderAcceptedTasks
);

/**
 * @swagger
 * /api/tasks/user/posted/offers:
 *   get:
 *     summary: Get offers received on tasks posted by the current user
 *     tags: [Offer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of offers on user’s posted tasks
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/tasks/user/posted/offers",
  authenticate,
  requireRole("USER"),
  getOffersOnUserPostedTasks
);

/**
 * @swagger
 * /api/tasks/{id}/provider-complete:
 *   post:
 *     summary: Provider marks task as complete
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task marked as completed by provider
 *       400:
 *         description: Marking as complete failed
 *       403:
 *         description: Not authorized
 */

router.post(
  "/tasks/:id/provider-complete",
  authenticate,
  requireRole("PROVIDER"),
  providerMarkTaskComplete
);

/**
 * @swagger
 * /api/tasks/{id}/accept-completion:
 *   post:
 *     summary: User accepts the task as completed
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Completion accepted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Task not found
 */

router.post(
  "/tasks/:id/accept-completion",
  authenticate,
  requireRole("USER"),
  userAcceptCompletion
);

/**
 * @swagger
 * /api/tasks/{id}/reject-completion:
 *   post:
 *     summary: User rejects the task as incomplete
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Completion rejected
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Task not found
 */

router.post(
  "/tasks/:id/reject-completion",
  authenticate,
  requireRole("USER"),
  userRejectCompletion
);

export default router;
