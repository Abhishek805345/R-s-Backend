import { Router } from "express";
import { getProtectedProfile } from "../controllers/protectedController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/protected/profile", requireAuth, getProtectedProfile);

export default router;
