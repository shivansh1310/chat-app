import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id",protectRoute, getMessages); // added id cause we wanna find all the messages in that chat 

router.post("/send/:id", protectRoute, sendMessage);


export default router;