import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import childRoutes from "./src/routes/childRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
    cors({
        origin: ["http://localhost:5173", "https://subventricular-carlee-tormentingly.ngrok-free.dev"],
        credentials: true,
    }),
);

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/child", childRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error("[Server] Fatal error:", err);
    res.status(500).json({ error: "Server or database unreachable" });
});

app.listen(PORT, () => {
    console.log(`🚀 API active on port ${PORT}`);
});
