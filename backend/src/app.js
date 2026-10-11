import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import morgan from "morgan";
import googleRouter from "./routes/google.auth.routes.js";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());
app.get("/", (req, res) => {
  res.send("CodeMind Backend is running");
});
app.use("/api/auth",authRouter)
app.use("/auth",googleRouter)
export default app;