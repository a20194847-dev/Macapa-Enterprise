import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { chatWithAgent, analyzeImage, generateReport, getContextualTip, getAgentCapabilities, clearMemory } from "./openai";

// Respuestas personalizadas por agente con personalidad
const respuestasAgentes: Record<string, string[]> = {
  "ALEX IA": [
    "Analizando los patrones... Como buen detective financiero, noto que los números cuentan una historia. He detectado una anomalía en el periodo Q3 que requiere investigación profunda.",
    "Aplicando metodología ISA 240 para evaluar el riesgo de fraude. Los indicadores preliminares sugieren revisar las cuentas por cobrar. Es como seguir las migajas de pan en un bosque financiero.",
    "He completado el análisis Benford's Law. Los dígitos no siguen la distribución esperada en las facturas superiores a $10,000. Esto suele indicar manipulación manual.",
    "Mi experiencia de 25 años me dice que este patrón es consistente con esquemas de facturación ficticia. Recomiendo profundizar con Alpha.",
  ],
  "Alex Flash": [
    "¡Perfecto! Generando visualización ejecutiva... El dashboard estará listo en segundos. Vamos a hacer que estos datos brillen para la junta directiva.",
    "Preparando informe visual de alto impacto. Incluiré las métricas clave con gráficos que cuentan la historia de forma clara y directa. ¡Los CEOs aman cuando les ahorramos tiempo!",
    "¡Listo! He convertido 50 páginas de datos en 5 visualizaciones de impacto. A veces menos es más.",
  ],
  "CONTRALOR": [
    "Verificando metodología aplicada... Confirmo que el análisis cumple con los estándares COSO y SOX. Precisión de validación: 94.2%.",
    "Detecto un posible sesgo de confirmación en el análisis de ALEX IA. Recomiendo ampliar el tamaño de muestra de 50 a 150 antes de concluir. La objetividad es primordial.",
    "Validación completa. El método de muestreo es estadísticamente robusto. Nivel de confianza: 95%.",
  ],
  "Agent Alpha": [
    "Iniciando fase... Mi trabajo como Alpha es asegurar que tengamos todos los ingredientes antes de cocinar. ¿Tienes los documentos fuente listos?",
    "He identificado 3 fuentes adicionales de evidencia que necesitamos revisar. La cadena de custodia está documentada.",
    "Fase preparada. Toda la evidencia está catalogada y lista para el análisis de ALEX IA.",
  ],
  "Agent Omega": [
    "Sintetizando hallazgos del equipo... Como finalizador, mi rol es condensar todo en conclusiones accionables.",
    "El análisis integral está completo. Resumen: 3 áreas de atención prioritaria, 2 hallazgos de riesgo alto, 5 recomendaciones de mejora.",
    "Fase cerrada. Entregables generados y listos para revisión final. La calidad está verificada.",
  ],
};

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  
  // Dashboard Stats
  app.get(api.dashboard.stats.path, async (_req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Proyectos
  app.get(api.proyectos.list.path, async (_req, res) => {
    const proyectos = await storage.getProyectos();
    res.json(proyectos);
  });

  app.post(api.proyectos.create.path, async (req, res) => {
    const proyecto = await storage.createProyecto(req.body);
    res.status(201).json(proyecto);
  });

  // Agentes
  app.get(api.agentes.list.path, async (_req, res) => {
    const agentes = await storage.getAgentes();
    res.json(agentes);
  });

  app.post(api.agentes.chat.path, async (req, res) => {
    const agente = await storage.getAgente(Number(req.params.id));
    if (!agente) return res.status(404).json({ message: "Agente no encontrado" });

    const respuestas = respuestasAgentes[agente.nombre] || ["Procesando tu solicitud..."];
    const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];

    // Simular supervisión del CONTRALOR
    let supervisionLog = undefined;
    if (agente.nombre !== "CONTRALOR" && Math.random() > 0.5) {
      const hasBias = Math.random() > 0.8;
      supervisionLog = await storage.createLog({
        agenteNombre: "CONTRALOR",
        accion: hasBias ? "Detección de Sesgo" : "Verificación OK",
        detalles: hasBias 
          ? `Detecté posible sesgo en respuesta de ${agente.nombre}. Recomendando ajuste metodológico.`
          : `Validando respuesta de ${agente.nombre}. Metodología: COSO Framework. OK.`,
        sesgoDetectado: hasBias,
        correccionAplicada: hasBias ? "Ajuste de muestra recomendado" : null,
      });
    }

    res.json({ respuesta, agenteNombre: agente.nombre, supervisionLog });
  });

  // Tipos de Auditoría
  app.get(api.tiposAuditoria.list.path, async (_req, res) => {
    const tipos = await storage.getTiposAuditoria();
    res.json(tipos);
  });

  // Auditorías (Workflows)
  app.get(api.auditorias.list.path, async (_req, res) => {
    const auditorias = await storage.getAuditorias();
    res.json(auditorias);
  });

  app.get(api.auditorias.get.path, async (req, res) => {
    const auditoria = await storage.getAuditoria(Number(req.params.id));
    if (!auditoria) return res.status(404).json({ message: "Auditoría no encontrada" });
    res.json(auditoria);
  });

  app.post(api.auditorias.create.path, async (req, res) => {
    const auditoria = await storage.createAuditoria(req.body);
    res.status(201).json(auditoria);
  });

  app.patch(api.auditorias.update.path, async (req, res) => {
    const auditoria = await storage.updateAuditoria(Number(req.params.id), req.body);
    if (!auditoria) return res.status(404).json({ message: "Auditoría no encontrada" });
    res.json(auditoria);
  });

  app.get(api.auditorias.fases.path, async (req, res) => {
    const fases = await storage.getFasesByAuditoria(Number(req.params.id));
    res.json(fases);
  });

  // Fases
  app.get(api.fases.list.path, async (_req, res) => {
    const fases = await storage.getAllFases();
    res.json(fases);
  });

  app.patch(api.fases.update.path, async (req, res) => {
    const fase = await storage.updateFase(Number(req.params.id), req.body);
    if (!fase) return res.status(404).json({ message: "Fase no encontrada" });
    res.json(fase);
  });

  // Análisis
  app.get(api.analisis.list.path, async (_req, res) => {
    const analisis = await storage.getAnalisis();
    res.json(analisis);
  });

  app.post(api.analisis.ejecutar.path, async (req, res) => {
    const logs = [];
    
    // Simular flujo de trabajo multi-agente
    logs.push(await storage.createLog({
      agenteNombre: "Agent Alpha",
      accion: "Inicio de Fase",
      detalles: "Preparando evidencia y documentos para análisis. Validando completitud.",
      sesgoDetectado: false,
      correccionAplicada: null,
    }));

    logs.push(await storage.createLog({
      agenteNombre: "ALEX IA",
      accion: "Análisis Profundo",
      detalles: "Ejecutando análisis de anomalías con Ley de Benford. Procesando 1,247 transacciones.",
      sesgoDetectado: false,
      correccionAplicada: null,
    }));

    logs.push(await storage.createLog({
      agenteNombre: "Alex Flash",
      accion: "Visualización",
      detalles: "Generando dashboard ejecutivo con 5 gráficos de correlación.",
      sesgoDetectado: false,
      correccionAplicada: null,
    }));

    const hasBias = Math.random() > 0.7;
    logs.push(await storage.createLog({
      agenteNombre: "CONTRALOR",
      accion: hasBias ? "INTERVENCIÓN" : "Validación",
      detalles: hasBias 
        ? "Sesgo de confirmación detectado en muestreo. Ampliando muestra 200% automáticamente." 
        : "Metodología verificada. Cumplimiento COSO: 100%. Cumplimiento ISA: 98%.",
      sesgoDetectado: hasBias,
      correccionAplicada: hasBias ? "Muestra expandida de 50 a 150 registros. Re-análisis ejecutado." : null,
    }));

    logs.push(await storage.createLog({
      agenteNombre: "Agent Omega",
      accion: "Cierre de Fase",
      detalles: "Síntesis completada. 3 hallazgos documentados. Entregables generados.",
      sesgoDetectado: false,
      correccionAplicada: null,
    }));

    res.json({ 
      logs, 
      resultado: hasBias ? "Análisis completado con correcciones del CONTRALOR" : "Análisis completado exitosamente" 
    });
  });

  // Casos
  app.get(api.casos.list.path, async (_req, res) => {
    const casos = await storage.getCasos();
    res.json(casos);
  });

  // Herramientas
  app.get(api.herramientas.list.path, async (_req, res) => {
    const herramientas = await storage.getHerramientas();
    res.json(herramientas);
  });

  app.post(api.herramientas.toggle.path, async (req, res) => {
    const herramienta = await storage.toggleHerramienta(Number(req.params.id));
    if (!herramienta) return res.status(404).json({ message: "Herramienta no encontrada" });
    res.json(herramienta);
  });

  // Logs
  app.get(api.logs.list.path, async (_req, res) => {
    const logs = await storage.getLogs();
    res.json(logs);
  });

  // Configuración
  app.get(api.configuracion.get.path, async (_req, res) => {
    const config = await storage.getConfiguracion();
    res.json(config);
  });

  app.put(api.configuracion.update.path, async (req, res) => {
    const config = await storage.updateConfiguracion(req.body);
    res.json(config);
  });

  // ============ AI-POWERED AGENT ROUTES ============

  // Chat with AI Agent (all agents share vision, docs, memory capabilities)
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { agentName, message, sessionId, pageContext } = req.body;
      if (!agentName || !message) {
        return res.status(400).json({ error: "agentName y message son requeridos" });
      }
      const response = await chatWithAgent(agentName, message, sessionId || "default", pageContext);
      res.json({ response, agentName });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Analyze image with AI Agent
  app.post("/api/ai/vision", async (req, res) => {
    try {
      const { agentName, image, prompt } = req.body;
      if (!agentName || !image || !prompt) {
        return res.status(400).json({ error: "agentName, image y prompt son requeridos" });
      }
      const response = await analyzeImage(agentName, image, prompt);
      res.json({ response, agentName });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate report (only Alex Flash can do this)
  app.post("/api/ai/report", async (req, res) => {
    try {
      const { reportType, data, customInstructions } = req.body;
      if (!reportType) {
        return res.status(400).json({ error: "reportType es requerido" });
      }
      const capabilities = getAgentCapabilities("Alex Flash");
      if (!capabilities?.canGenerateReports) {
        return res.status(403).json({ error: "Solo Alex Flash puede generar reportes" });
      }
      const report = await generateReport(reportType, data || {}, customInstructions);
      res.json({ report, generatedBy: "Alex Flash" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get contextual tip from ALEX IA
  app.get("/api/ai/tip", async (req, res) => {
    try {
      const { page, data } = req.query;
      const tip = await getContextualTip(page as string || "Dashboard", JSON.parse((data as string) || "{}"));
      res.json({ tip, agent: "ALEX IA" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Clear conversation memory
  app.delete("/api/ai/memory", async (req, res) => {
    try {
      const { sessionId, agentName } = req.body;
      clearMemory(sessionId || "default", agentName);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get agent capabilities
  app.get("/api/ai/capabilities/:agentName", async (req, res) => {
    const capabilities = getAgentCapabilities(req.params.agentName);
    if (!capabilities) {
      return res.status(404).json({ error: "Agente no encontrado" });
    }
    res.json(capabilities);
  });

  return httpServer;
}
