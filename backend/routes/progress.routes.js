import express from "express";
import { addTaskProgress, getTaskProgress } from "../controllers/progress.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import requireRole from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/tasks/:id/progress",
  authenticate,
  requireRole("PROVIDER"),
  addTaskProgress
);

router.get(
    "/tasks/:id/progress", 
    authenticate, 
    getTaskProgress
);


export default router;
