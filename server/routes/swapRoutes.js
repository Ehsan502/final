import express from "express";
import { createSwapRequest, getMySwaps, updateSwapStatus } from "../controllers/swapController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createSwapRequest);
router.get("/mine", protect, getMySwaps);
router.put("/:id", protect, updateSwapStatus);

export default router;
