import express from "express";
import cors from "cors";
import path from "path";

// Rutas del sistema MACAPA ENTERPRISE
import workflowRoutes from "./api/workflow.routes";
import contratosRoutes from "./api/contratos.routes";
import agentesRoutes from "./api/agentes.routes";
import fasesRoutes from "./api/fases.routes";
import entregablesRoutes from "./api/entregables.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Ruta base para verificar que el backend está vivo
app.get("/", (req, res) => {
  res.json({
    ok: true,
    mensaje: "MACAPA ENTERPRISE BACKEND OPERATIVO",
    version: "1.0.0"
  });
});

// Registrar rutas del sistema
app.use("/api/workflow", workflowRoutes);
app.use("/api/contratos", contratosRoutes);
app.use("/api/agentes", agentesRoutes);
app.use("/api/fases", fasesRoutes);
app.use("/api/entregables", entregablesRoutes);

// Servir archivos estáticos si es necesario
app.use("/expedientes", express.static(path.join(process.cwd(), "expedientes")));

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor MACAPA ENTERPRISE corriendo en puerto ${PORT}`);
});
