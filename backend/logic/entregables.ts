import { generateReport } from "./ai";
import { storage } from "../database/storage";

export class EntregablesEngine {

  static async generarEntregable(auditoriaId: number, faseId: number, tipo: string, data: any) {
    const reporte = await generateReport(tipo, data);

    const entregable = {
      id: Date.now(),
      auditoriaId,
      faseId,
      nombre: tipo,
      contenido: JSON.stringify(reporte),
      fecha: new Date()
    };

    return entregable;
  }
}
