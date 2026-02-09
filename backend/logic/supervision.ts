import { chatWithAgent } from "./ai";
import { storage } from "../database/storage";

export class SupervisionEngine {

  static async supervisarFase(auditoriaId: number, faseId: number) {
    const fase = await storage.getFasesByAuditoria(auditoriaId)
      .then(f => f.find(x => x.id === faseId));

    const prompt = `
      Evalúa esta fase de auditoría:
      ${JSON.stringify(fase, null, 2)}
      Detecta sesgos, errores metodológicos y riesgos.
    `;

    const respuesta = await chatWithAgent("CONTRALOR", prompt, `supervision-${auditoriaId}`);

    await storage.createLog({
      agenteNombre: "CONTRALOR",
      accion: "Supervisión de fase",
      detalles: respuesta,
      sesgoDetectado: respuesta.includes("sesgo"),
      auditoriaId,
      faseId
    });

    return respuesta;
  }
}
