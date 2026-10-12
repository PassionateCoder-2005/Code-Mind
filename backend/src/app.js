import express from "express";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import morgan from "morgan";
import googleRouter from "./routes/google.auth.routes.js";
const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());
app.get("/", (req, res) => {
  res.send("CodeMind Backend is running");
});
app.use("/api/auth",authRouter)
app.use("/auth",googleRouter) // continue with google auth routes
app.use("/api/project",projectRouter)
export default app;