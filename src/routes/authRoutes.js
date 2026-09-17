import { Router } from "express";
import { login, logout, me, signup } from "../controllers/authController.js";

const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/me", me);
router.post("/auth/logout", logout);

export default router;
