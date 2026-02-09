import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { registerRoutes } from "./routes";
import contratosRoutes from "./api/contratos.routes";
import workflowRoutes from "./api/workflow.routes";
import fasesRoutes from "./api/fases.routes";
import entregablesRoutes from "./api/entregables.routes";



const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api/contratos", contratosRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/fases", fasesRoutes);
app.use("/api/entregables", entregablesRoutes);

// Static (si tienes frontend compilado)
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

// Registrar rutas
registerRoutes(server, app);

// Healthcheck
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "macapa-enterprise-backend" });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`MACAPA ENTERPRISE backend running on port ${PORT}`);
});
