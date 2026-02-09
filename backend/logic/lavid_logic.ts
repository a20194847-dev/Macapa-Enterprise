// backend/logic/lavid_logic.ts

import { lavidLiteAgent } from "../../core/agents/lavid_lite";
import { LavidContext } from "../../core/models/lavid_context.model";

export async function obtenerRecomendacionesLavid(contexto: LavidContext) {
  return await lavidLiteAgent(contexto);
}
