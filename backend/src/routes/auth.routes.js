import {Router} from "express";
import { loginValidation, signupValidation } from "../validations/auth.validation.js";
import { login, logout, signUp,refreshAccessToken } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const authRouter=Router();
authRouter.post("/signup", signupValidation, signUp);
authRouter.post("/login", loginValidation, login);
authRouter.post("/refresh",refreshAccessToken);
authRouter.post("/logout", authMiddleware, logout);
export default authRouter