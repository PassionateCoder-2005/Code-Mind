import jwt from "jsonwebtoken";
import CONFIG from "../config/config.js";
import blacklistTokenModel from "../models/token.blacklist.model.js";
export const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access token is required"
        });
    }
        // if(!req.cookies?.refreshToken){
        //     return res.status(401).json({
        //         success: false,
        //         message: "Refresh token is required"
        //     });
        // }

    const token = authHeader.split(" ")[1];
    try {
    const decoded = jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET);
    const blacklistToken = await blacklistTokenModel.findOne({ token });
    if (blacklistToken) {
        return res.status(401).json({
            success: false,
            message: "Access token is blacklisted"
        });
    }
    req.userId = decoded.userId;
    next();
} catch (error) {
    return res.status(401).json({
        success: false,
        message: "Invalid or expired access token"
    });
}
};