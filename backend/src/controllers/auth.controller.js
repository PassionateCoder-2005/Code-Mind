import CONFIG from "../config/config.js";
import refreshTokenModel from "../models/refresh.token.js";
import blacklistTokenModel from "../models/token.blacklist.model.js";

import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Unable to create user with this email, please try with another email"
            });
        }

        const newUser = await userModel.create({
            name,
            email,
            password
        });

        // Generate Access Token
        const accessToken = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email
            },
            CONFIG.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        // Generate Refresh Token
        const refreshToken = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email
            },
            CONFIG.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Store Refresh Token in database
        await refreshTokenModel.create({
            token: refreshToken,
            userId: newUser._id,
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });

        // Set Refresh Token cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            accessToken
        });

    } catch (err) {
        console.log("Error in signup", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const login=async (req,res) => {
    try {
        const {email,password}=req.body;
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }
        const acessToken=jwt.sign(
            {
                userId:user._id,
                email:user.email,
            },
            CONFIG.ACCESS_TOKEN_SECRET,
            {
                expiresIn:"15m"
            }
        )
        const refreshToken = jwt.sign(
    { userId: user._id ,
        email:user.email
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
            success:true,
            message:"Login successful",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            },
            acessToken
        });
    } catch (error) {
        console.log("Error in login",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}

export const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token required"
            });
        }
        

        const refreshToken = req.cookies?.refreshToken;
const decoded = jwt.decode(token);

if (decoded?.exp) {
    await blacklistTokenModel.create({
        token,
        expiresAt: new Date(decoded.exp * 1000)
    });
}
        if (refreshToken) {
            await refreshTokenModel.findOneAndUpdate(
                {
                    token: refreshToken,
                    revoked: false
                },
                {
                    revoked: true
                }
            );
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (err) {
        console.log("Error in logout", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            CONFIG.REFRESH_TOKEN_SECRET
        );
const storedToken = await refreshTokenModel.findOne({
    token: refreshToken,
    userId: decoded.userId,
    revoked: false,
    expiresAt: { $gt: new Date() }
});

if (!storedToken) {
    return res.status(401).json({
        success: false,
        message: "Refresh token revoked or expired"
    });
}
        const accessToken = jwt.sign(
            { userId: decoded.userId },
            CONFIG.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
      const newRefreshToken = jwt.sign(
    { userId: decoded.userId },
    CONFIG.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
);
await refreshTokenModel.create({
    token: newRefreshToken,
    userId: decoded.userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});

storedToken.revoked = true;
await storedToken.save();
res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
});
        return res.status(200).json({
            success: true,
            accessToken
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
};