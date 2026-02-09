// backend/logic/entregables_engine.ts

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { ExpedienteDigital } from "./expediente";

export class EntregablesEngine {

  static basePath = path.join(process.cwd(), "expedientes");

  static generarEntregable(
    idProyecto: string,
    fase: string,
    agente: string,
    nombreArchivo: string,
    contenido: string
  ) {
    const carpetaFase = path.join(this.basePath, idProyecto, fase);

    if (!fs.existsSync(carpetaFase)) {
      fs.mkdirSync(carpetaFase, { recursive: true });
    }

    const filePath = path.join(carpetaFase, nombreArchivo);

    fs.writeFileSync(filePath, contenido, "utf8");

    const hash = crypto.createHash("sha256").update(contenido).digest("hex");

    ExpedienteDigital.registrarAccion(idProyecto, {
      actor: agente,
      accion: "Generó entregable",
      fase,
      documento: `${fase}/${nombreArchivo}`,
      hash
    });

    return { filePath, hash };
  }

  static listarEntregables(idProyecto: string, fase: string) {
    const carpetaFase = path.join(this.basePath, idProyecto, fase);

    if (!fs.existsSync(carpetaFase)) return [];

    return fs.readdirSync(carpetaFase).map(nombre => ({
      nombre,
      ruta: path.join(carpetaFase, nombre)
    }));
  }
}
