import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAiReplySuggestions,
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.post("/ai-suggestions", protectRoute, getAiReplySuggestions);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
