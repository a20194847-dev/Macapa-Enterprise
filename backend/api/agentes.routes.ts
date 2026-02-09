import { Router } from "express";
import { storage } from "../database/storage";
import { chatWithAgent, analyzeImage, generateReport, getAgentCapabilities, clearMemory } from "../logic/ai";

const router = Router();

// Obtener lista de agentes
router.get("/", async (_req, res) => {
  res.json(await storage.getAgentes());
});

// Obtener un agente por ID
router.get("/:id", async (req, res) => {
  const agente = await storage.getAgente(Number(req.params.id));
  if (!agente) return res.status(404).json({ error: "Agente no encontrado" });
  res.json(agente);
});

// Chat con agente
router.post("/:id/chat", async (req, res) => {
  try {
    const agente = await storage.getAgente(Number(req.params.id));
    if (!agente) return res.status(404).json({ error: "Agente no encontrado" });

    const { message, sessionId, pageContext } = req.body;
    const respuesta = await chatWithAgent(agente.nombre, message, sessionId, pageContext);

    res.json({ respuesta, agente: agente.nombre });
  } catch (error) {
    console.error("Error en chat con agente:", error);
    res.status(500).json({ error: "Error procesando chat con agente" });
  }
});

// Análisis de imagen
router.post("/:id/vision", async (req, res) => {
  try {
    const agente = await storage.getAgente(Number(req.params.id));
    if (!agente) return res.status(404).json({ error: "Agente no encontrado" });

    const { image, prompt } = req.body;
    const respuesta = await analyzeImage(agente.nombre, image, prompt);

    res.json({ respuesta, agente: agente.nombre });
  } catch (error) {
    console.error("Error en visión IA:", error);
    res.status(500).json({ error: "Error procesando análisis de imagen" });
  }
});

// Generación de reportes
router.post("/:id/report", async (req, res) => {
  try {
    const agente = await storage.getAgente(Number(req.params.id));
    if (!agente) return res.status(404).json({ error: "Agente no encontrado" });

    const capabilities = getAgentCapabilities(agente.nombre);
    if (!capabilities?.canGenerateReports) {
      return res.status(403).json({ error: "Este agente no puede generar reportes" });
    }

    const { reportType, data, customInstructions } = req.body;
    const reporte = await generateReport(reportType, data, customInstructions);

    res.json({ reporte, generadoPor: agente.nombre });
  } catch (error) {
    console.error("Error generando reporte:", error);
    res.status(500).json({ error: "Error generando reporte" });
  }
});

// Limpiar memoria
router.delete("/:id/memory", async (req, res) => {
  try {
    const agente = await storage.getAgente(Number(req.params.id));
    if (!agente) return res.status(404).json({ error: "Agente no encontrado" });

    const { sessionId } = req.body;
    clearMemory(sessionId, agente.nombre);

    res.json({ success: true });
  } catch (error) {
    console.error("Error limpiando memoria:", error);
    res.status(500).json({ error: "Error limpiando memoria" });
  }
});

export default router;
