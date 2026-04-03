import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import childRoutes from "./src/routes/childRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ton-url-ngrok.ngrok-free.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/child", childRoutes);

app.listen(PORT, () => {
  console.log(`🚀 API active on port ${PORT}`);
});
