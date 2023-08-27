import { Router } from "express";
import {
  SignUp,
  forgotPassword,
  signIn,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", SignUp);
router.post("/login", signIn);
router.post("/forgot-password", forgotPassword);

export default router;
