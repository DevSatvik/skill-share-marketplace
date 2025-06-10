import express from "express";
import { createSkill, updateSkill, getMySkills} from "../controllers/skill.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import requireRole from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/skills",
  authenticate,
  requireRole("PROVIDER"),
  createSkill
);

router.patch(
  "/skills/:id",
  authenticate,
  requireRole("PROVIDER"),
  updateSkill
);

router.get(
  "/skills/my",
  authenticate,
  requireRole("PROVIDER"),
  getMySkills
);

export default router;