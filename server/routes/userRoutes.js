import express from "express";
import { getUserProfile, updateUserProfile, getDashboardStats, getLeaderboard } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboardStats);
router.get("/leaderboard", protect, getLeaderboard);
router.put("/profile", protect, updateUserProfile);
router.get("/:id", getUserProfile);

export default router;
