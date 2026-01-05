import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile) //protectRoute will be a middleware to protect the updateProfile function and check if the user is logged in beforehand 

router.get("/check", protectRoute, checkAuth) // gonna call this function whenever we refresh the page, this will autheticate the user 

export default router;


