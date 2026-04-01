import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/authRoutes.js";
import childRoutes from "./src/routes/childRoutes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/child", childRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

app.use((err, req, res, next) => {
  console.error("[Serveur] Erreur fatale :", err);
  res.status(500).json({ error: "Serveur ou base de données injoignable." });
});

app.listen(PORT, () => {
  console.log(`🚀 API active sur le port ${PORT}`);
});
