import express from "express";
import {
  registerAccount,
  loginAccount,
  getProfile,
} from "../controllers/account.controller.js";

// Import authentication middleware 
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerAccount);
router.post("/login", loginAccount);
router.get("/me", authenticate, getProfile);

export default router;
