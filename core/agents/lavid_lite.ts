// core/agents/lavid_lite.ts

import { LavidContext } from "../models/lavid_context.model";
import { LavidEngine, LavidRecommendation } from "../services/lavid_engine";

export async function lavidLiteAgent(contexto: LavidContext): Promise<LavidRecommendation[]> {
  // Aquí, en fases futuras, se puede integrar un LLM.
  // Fase 1: reglas + contexto estructurado.
  const recomendaciones = LavidEngine.analizar(contexto);
  return recomendaciones;
}
