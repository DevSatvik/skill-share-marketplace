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

router.post(
    "/tasks", 
    authenticate, 
    requireRole("USER"), 
    createTask
);

router.get(
    "/tasks/open", 
    authenticate, 
    requireRole("PROVIDER"), 
    getOpenTasks
);

router.get(
  "/tasks/provider/accepted",
  authenticate,
  requireRole("PROVIDER"),
  getProviderAcceptedTasks
);

router.get(
  "/tasks/user/posted",
  authenticate,
  requireRole("USER"),
  getUserPostedTasks
);

router.get(
  "/tasks/user/posted/offers",
  authenticate,
  requireRole("USER"),
  getOffersOnUserPostedTasks
);

router.post(
  "/tasks/:id/complete",
  authenticate,
  requireRole("USER"),
  markTaskComplete
);

router.patch(
    "/tasks/:id", 
    authenticate, 
    requireRole("USER"), 
    updateTask
);

router.post(
  "/tasks/:id/provider-complete",
  authenticate,
  requireRole("PROVIDER"),
  providerMarkTaskComplete
);


router.post(
  "/tasks/:id/accept-completion",
  authenticate,
  requireRole("USER"),
  userAcceptCompletion
);

router.post(
  "/tasks/:id/reject-completion",
  authenticate,
  requireRole("USER"),
  userRejectCompletion
);

export default router;
