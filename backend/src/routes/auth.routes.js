import {Router} from "express";
import { loginValidation, signupValidation } from "../validations/auth.validation.js";
import { login, logout, signUp,refreshAccessToken,getMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const authRouter=Router();
/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/signup", signupValidation, signUp);

/**
 * @route POST /api/auth/login
 * @desc Login an existing user
 * @access Public
 */
authRouter.post("/login", loginValidation, login);
/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
authRouter.post("/refresh",refreshAccessToken);
/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
authRouter.post("/logout", authMiddleware, logout);
/**
 * @route GET /api/auth/get-me
 * @desc Get current user details
 * @access Private
 */
authRouter.get("/get-me", authMiddleware, getMe);
export default authRouter