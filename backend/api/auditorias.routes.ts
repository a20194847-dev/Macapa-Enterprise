import { Router } from "express";
import { storage } from "../database/storage";

const router = Router();

/* ============================
   AUDITORÍAS
============================ */

router.get("/", async (_req, res) => {
  res.json(await storage.getAuditorias());
});

router.get("/:id", async (req, res) => {
  const auditoria = await storage.getAuditoria(Number(req.params.id));
  if (!auditoria) return res.status(404).json({ error: "Auditoría no encontrada" });
  res.json(auditoria);
});

router.post("/", async (req, res) => {
  try {
    const nueva = await storage.createAuditoria(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    console.error("Error creando auditoría:", error);
    res.status(500).json({ error: "Error creando auditoría" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updated = await storage.updateAuditoria(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Auditoría no encontrada" });
    res.json(updated);
  } catch (error) {
    console.error("Error actualizando auditoría:", error);
    res.status(500).json({ error: "Error actualizando auditoría" });
  }
});

/* ============================
   FASES
============================ */

router.get("/:id/fases", async (req, res) => {
  const fases = await storage.getFasesByAuditoria(Number(req.params.id));
  res.json(fases);
});

router.patch("/fase/:faseId", async (req, res) => {
  try {
    const fase = await storage.updateFase(Number(req.params.faseId), req.body);
    if (!fase) return res.status(404).json({ error: "Fase no encontrada" });
    res.json(fase);
  } catch (error) {
    console.error("Error actualizando fase:", error);
    res.status(500).json({ error: "Error actualizando fase" });
  }
});

/* ============================
   EVIDENCIAS
============================ */

router.get("/fase/:faseId/evidencias", async (req, res) => {
  const evidencias = await storage.getEvidenciasByFase(Number(req.params.faseId));
  res.json(evidencias);
});

/* ============================
   ENTREGABLES
============================ */

router.get("/:id/entregables", async (req, res) => {
  const entregables = await storage.getEntregablesByAuditoria(Number(req.params.id));
  res.json(entregables);
});

/* ============================
   LOGS DE SUPERVISIÓN
============================ */

router.get("/:id/logs", async (req, res) => {
  const logs = await storage.getLogs();
  const filtrados = logs.filter(l => l.auditoriaId === Number(req.params.id));
  res.json(filtrados);
});

router.post("/:id/logs", async (req, res) => {
  try {
    const log = await storage.createLog({
      ...req.body,
      auditoriaId: Number(req.params.id),
      timestamp: new Date()
    });
    res.status(201).json(log);
  } catch (error) {
    console.error("Error creando log:", error);
    res.status(500).json({ error: "Error creando log" });
  }
});

export default router;
