import { Router } from "express";
import { generateReport } from "../logic/ai";

const router = Router();

router.post("/generar", async (req, res) => {
  try {
    const { tipo, data, instrucciones } = req.body;
    const reporte = await generateReport(tipo, data, instrucciones);
    res.json({ reporte });
  } catch (error) {
    res.status(500).json({ error: "Error generando reporte" });
  }
});

export default router;
