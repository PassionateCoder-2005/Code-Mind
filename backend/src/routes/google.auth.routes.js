import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import CONFIG from "../config/config.js";
import refreshTokenModel from "../models/refresh.token.js";

const googleRouter = express.Router();

// Step 1: Redirect user to Google
googleRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false
    })
);

// Step 2: Google redirects back here
googleRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/auth/google/failure"
    }),
    async (req, res) => {
        try {
            const user = req.user;

            const accessToken = jwt.sign(
                {
                    userId: user._id,
                    email: user.email
                },
                CONFIG.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                {
                    userId: user._id,
                    email: user.email
                },
                CONFIG.REFRESH_TOKEN_SECRET,
                { expiresIn: "7d" }
            );

            await refreshTokenModel.create({
                token: refreshToken,
                userId: user._id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                success: true,
                message: "Google login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                accessToken
            });
        } catch (error) {
            console.error("Google login error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
);

googleRouter.get("/google/failure", (req, res) => {
    return res.status(401).json({
        success: false,
        message: "Google authentication failed"
    });
});

export default googleRouter;