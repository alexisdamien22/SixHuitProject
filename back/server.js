import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import childRoutes from "./src/routes/childRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/child", childRoutes);

// Catch-all pour les routes inconnues
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 API active sur le port ${PORT}`);
});