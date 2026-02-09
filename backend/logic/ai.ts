import Groq from "groq-sdk";
import OpenAI from "openai";

// =========================
//  PROVEEDORES IA
// =========================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Lavid Lite: API propia
async function callLavid(model: string, messages: any[]) {
  const res = await fetch(process.env.LAVID_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.LAVID_API_KEY}`,
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    throw new Error(`Lavid Lite error: ${res.status}`);
  }

  const data = await res.json();
  return data.content ?? data.message ?? "";
}

// =========================
//  AGENTES MACAPA ALLIANCE
// =========================

type Provider = "groq" | "openai" | "lavid";

type AgentConfig = {
  systemPrompt: string;
  provider: Provider;
  model: string;
  canGenerateReports: boolean;
};

const agents: Record<string, AgentConfig> = {
  "ALEX IA": {
    systemPrompt: `Eres ALEX IA, Auditor Forense Principal de MACAPA ALLIANCE.
Especialidad: análisis forense profundo, fraude, COSO/ISA/SOX.
Personalidad: mentor experimentado, claro y riguroso.`,
    provider: "groq",
    model: "llama-3.1-70b-versatile",
    canGenerateReports: false,
  },

  "Alex Flash": {
    systemPrompt: `Eres Alex Flash, Director Visual Ejecutivo.
Especialidad: reportes ejecutivos y visualizaciones de alto impacto.
Personalidad: energético, directo y orientado a resultados.`,
    provider: "groq",
    model: "llama-3.1-70b-versatile",
    canGenerateReports: true,
  },

  "CONTRALOR": {
    systemPrompt: `Eres CONTRALOR, Supervisor de Calidad IA.
Especialidad: control de calidad, detección de sesgos, precisión normativa.`,
    provider: "groq",
    model: "llama-3.1-70b-versatile",
    canGenerateReports: false,
  },

  "Agent Alpha": {
    systemPrompt: `Eres Agent Alpha, iniciador de fases.
Especialidad: evidencia, investigación, preparación de auditorías.`,
    provider: "groq",
    model: "llama-3.1-8b-instant",
    canGenerateReports: false,
  },

  "Agent Omega": {
    systemPrompt: `Eres Agent Omega, finalizador de fases.
Especialidad: síntesis, conclusiones, entregables finales.`,
    provider: "groq",
    model: "llama-3.1-70b-versatile",
    canGenerateReports: false,
  },

  // =========================
  //  NUEVO AGENTE: LAVID LITE
  // =========================
  "Lavid Lite": {
    systemPrompt: `Eres Lavid Lite, miembro oficial de MACAPA ALLIANCE.
Rol: Analista cognitivo ligero, especializado en síntesis rápida y apoyo transversal.
Personalidad: claro, directo, colaborativo. Simplificas lo complejo.
Capacidades: apoyo en análisis, resúmenes, insights rápidos, soporte a otros agentes.`,
    provider: "lavid",
    model: "lavid-lite-v1",
    canGenerateReports: false,
  },
};

// =========================
//  CAPACIDADES COMPARTIDAS
// =========================

const sharedCapabilities = `
CAPACIDADES COMPARTIDAS:
- Análisis de imágenes
- Lectura de documentos
- Memoria contextual
- Conocimiento normativo (COSO, ISA, SOX, Benford)
`;

// =========================
//  MEMORIA POR SESIÓN
// =========================

const memory: Record<string, Array<{ role: "user" | "assistant" | "system"; content: string }>> = {};

// =========================
//  ROUTER DE PROVEEDORES
// =========================

async function callGroq(model: string, messages: any[]) {
  const res = await groq.chat.completions.create({
    model,
    messages,
    max_tokens: 1024,
  });
  return res.choices[0].message.content || "";
}

async function callOpenAI(model: string, messages: any[]) {
  const res = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: 1024,
  });
  return res.choices[0].message.content || "";
}

// =========================
//  CHAT MULTI-PROVEEDOR
// =========================

export async function chatWithAgent(
  agentName: string,
  message: string,
  sessionId: string,
  pageContext?: string
): Promise<string> {

  const agent = agents[agentName];
  if (!agent) throw new Error(`Agente ${agentName} no encontrado`);

  const key = `${sessionId}-${agentName}`;
  if (!memory[key]) memory[key] = [];

  let systemPrompt = agent.systemPrompt + "\n" + sharedCapabilities;
  if (pageContext) systemPrompt += `\nCONTEXTO DE PÁGINA:\n${pageContext}`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...memory[key].slice(-10),
    { role: "user", content: message },
  ];

  let reply = "";

  if (agent.provider === "groq") {
    reply = await callGroq(agent.model, messages);
  } else if (agent.provider === "openai") {
    reply = await callOpenAI(agent.model, messages);
  } else if (agent.provider === "lavid") {
    reply = await callLavid(agent.model, messages);
  }

  memory[key].push({ role: "user", content: message });
  memory[key].push({ role: "assistant", content: reply });

  return reply;
}

// =========================
//  ANÁLISIS DE IMÁGENES
// =========================

export async function analyzeImage(
  agentName: string,
  base64Image: string,
  prompt: string
): Promise<string> {

  const agent = agents[agentName];
  if (!agent) throw new Error(`Agente ${agentName} no encontrado`);

  const messages = [
    { role: "system", content: agent.systemPrompt + "\n" + sharedCapabilities },
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${base64Image}` },
        },
      ],
    },
  ];

  if (agent.provider === "lavid") {
    return await callLavid(agent.model, messages);
  }

  return await callGroq("llama-3.2-vision-preview", messages);
}

// =========================
//  GENERACIÓN DE REPORTES
// =========================

export async function generateReport(
  reportType: string,
  data: Record<string, any>,
  customInstructions?: string
) {
  const prompt = `
Genera un reporte profesional tipo "${reportType}" con estos datos:
${JSON.stringify(data, null, 2)}
${customInstructions ? `Instrucciones adicionales: ${customInstructions}` : ""}
Responde SOLO en JSON válido.
`;

  const messages = [
    { role: "system", content: agents["Alex Flash"].systemPrompt },
    { role: "user", content: prompt },
  ];

  const raw = await callGroq("llama-3.1-70b-versatile", messages);
  return JSON.parse(raw);
}

// =========================
//  TIPS CONTEXTUALES
// =========================

export function getContextualTip(pageName: string) {
  const tips = {
    Dashboard: [
      "¿Quieres que analice el proyecto con mayor riesgo?",
      "Puedo darte un resumen ejecutivo del estado actual.",
    ],
    AuditWorkbench: [
      "Puedo guiarte en esta fase de auditoría.",
      "¿Quieres que revise evidencia o documentos?",
    ],
    DeliverableStudio: [
      "¿Quieres que Alex Flash genere un reporte?",
      "Puedo explicarte cualquier gráfico.",
    ],
  };

  const pageTips = tips[pageName] || ["¿En qué puedo ayudarte hoy?"];
  return pageTips[Math.floor(Math.random() * pageTips.length)];
}

// =========================
//  CAPACIDADES POR AGENTE
// =========================

export function getAgentCapabilities(agentName: string) {
  return agents[agentName] || null;
}

// =========================
//  LIMPIAR MEMORIA
// =========================

export function clearMemory(sessionId: string, agentName?: string) {
  if (agentName) {
    delete memory[`${sessionId}-${agentName}`];
  } else {
    Object.keys(memory).forEach((key) => {
      if (key.startsWith(sessionId)) delete memory[key];
    });
  }
}
