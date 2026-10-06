import express from "express";
const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("CodeMind Backend is running");
});
export default app;