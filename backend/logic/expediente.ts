import fs from "fs";
import path from "path";
import crypto from "crypto";

export class ExpedienteDigital {

  static basePath = path.join(process.cwd(), "expedientes");

  static crearExpediente(idProyecto: string, usuario: string) {
    const expedientePath = path.join(this.basePath, idProyecto);

    // Crear carpetas base
    const carpetas = [
      "00_solicitud_inicial",
      "01_levantamiento",
      "02_validez_objetivo",
      "03_plan_trabajo",
      "04_contrato",
      "05_ejecucion",
      "06_cierre",
      "07_seguimiento"
    ];

    if (!fs.existsSync(expedientePath)) {
      fs.mkdirSync(expedientePath, { recursive: true });
    }

    carpetas.forEach(carpeta => {
      fs.mkdirSync(path.join(expedientePath, carpeta), { recursive: true });
    });

    // Crear metadata.json
    const metadata = {
      id: idProyecto,
      usuario,
      fechaCreacion: new Date().toISOString(),
      hashInicial: this.generarHash(idProyecto + usuario + Date.now()),
      estadoLegal: "activo",
      faseActual: "solicitud_inicial",
      aprobaciones: [],
      firmas: [],
      agentes: ["Agent Alpha", "ALEX IA", "Agent Omega", "CONTRALOR"]
    };

    fs.writeFileSync(
      path.join(expedientePath, "metadata.json"),
      JSON.stringify(metadata, null, 2)
    );

    // Crear historial.json
    fs.writeFileSync(
      path.join(expedientePath, "historial.json"),
      JSON.stringify([], null, 2)
    );

    return expedientePath;
  }

  static generarHash(data: string) {
    return crypto.createHash("sha256").update(data).digest("hex");
  }
}
static registrarAccion(idProyecto: string, accion: any) {
  const expedientePath = path.join(this.basePath, idProyecto);
  const historialPath = path.join(expedientePath, "historial.json");

  const historial = JSON.parse(fs.readFileSync(historialPath, "utf8"));

  historial.push({
    fecha: new Date().toISOString(),
    ...accion
  });

  fs.writeFileSync(historialPath, JSON.stringify(historial, null, 2));
}
ExpedienteDigital.registrarAccion("EXP-2026-0001", {
  actor: "Usuario",
  accion: "Aprobó informe de validez",
  documento: "validez_objetivo.pdf",
  hash: ExpedienteDigital.generarHash("validez_objetivo.pdf")
});
