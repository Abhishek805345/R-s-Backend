import { Router } from "express";
import { getRoom } from "../controllers/roomController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/rooms/:roomId", requireAuth, getRoom);

export default router;
