import { Router } from "express";
import { storage } from "../database/storage";
import { KPI_CATALOG } from "../logic/kpi_catalog";

const router = Router();

router.get("/", async (_req, res) => {
  const stats = await storage.getDashboardStats();
  const logs = await storage.getLogs();
  const auditorias = await storage.getAuditorias();

  res.json({
    stats,
    auditoriasActivas: auditorias.filter(a => a.estado !== "completada").length,
    alertas: logs.slice(0, 5),
    kpisCriticos: KPI_CATALOG.filter(k => k.riesgoInherente === "Crítico"),
    timestamp: new Date()
  });
});

export default router;
