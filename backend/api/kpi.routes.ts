// backend/api/kpi.routes.ts

import { Router } from "express";
import { KpiEngine } from "../../core/services/kpi_engine";

const router = Router();

router.post("/kpi/analyze", (req, res) => {
  try {
    const kpis = req.body.kpis;
    const insights = KpiEngine.analizar(kpis);
    res.json({ insights });
  } catch (error) {
    console.error("Error analizando KPI:", error);
    res.status(500).json({ error: "Error procesando KPI" });
  }
});

export default router;
