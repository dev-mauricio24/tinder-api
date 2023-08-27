import { Router } from "express";
import {
  addSkills,
  deleteUser,
  getProfile,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import {
  CompanyRequired,
  authRequired,
  authenticated,
} from "../middlewares/authRequired.js";

const router = Router();

router.get("/", CompanyRequired, getUsers);
router.get("/profile", authRequired, getProfile);
router.post("/add/skills", authRequired, addSkills);
router.put("/update", authRequired, updateUser);
router.post("/delete", authRequired, deleteUser);
router.get("/:id", authenticated, getUserById);

export default router;
