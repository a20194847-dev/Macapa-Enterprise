import { Router } from "express";
import { KpiLogic } from "../logic/kpi_logic";

const router = Router();

router.post("/analyze", (req, res) => {
  try {
    const kpis = req.body.kpis;
    const insights = KpiLogic.analizar(kpis);
    res.json({ insights });
  } catch (error) {
    console.error("Error analizando KPI:", error);
    res.status(500).json({ error: "Error procesando KPI" });
  }
});

export default router;
