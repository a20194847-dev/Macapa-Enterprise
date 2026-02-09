// backend/logic/contratos.ts

import fs from "fs";
import path from "path";
import { ExpedienteDigital } from "./expediente";
import crypto from "crypto";

export class ContratosEngine {

  static basePath = path.join(process.cwd(), "expedientes");

  static getExpedientePath(idProyecto: string) {
    return path.join(this.basePath, idProyecto);
  }

  static generarContrato(
    idProyecto: string,
    datos: {
      cliente: string;
      razonSocial: string;
      ruc?: string;
      objetivo: string;
      alcance: string;
      entregables: string[];
      cronograma: string;
      honorarios: string;
      condicionesEspeciales?: string;
    }
  ) {
    const expedientePath = this.getExpedientePath(idProyecto);
    const carpetaContrato = path.join(expedientePath, "04_contrato");

    if (!fs.existsSync(carpetaContrato)) {
      fs.mkdirSync(carpetaContrato, { recursive: true });
    }

    const contenido = `
CONTRATO DE SERVICIOS PROFESIONALES

Entre:
Cliente: ${datos.cliente}
Razón Social: ${datos.razonSocial}
RUC: ${datos.ruc ?? "N/A"}

OBJETIVO DEL SERVICIO
${datos.objetivo}

ALCANCE DEL SERVICIO
${datos.alcance}

ENTREGABLES
${datos.entregables.map(e => `- ${e}`).join("\n")}

CRONOGRAMA
${datos.cronograma}

HONORARIOS
${datos.honorarios}

CONDICIONES ESPECIALES
${datos.condicionesEspeciales ?? "Ninguna condición especial adicional."}

CLÁUSULAS LEGALES
1. Confidencialidad.
2. Propiedad intelectual.
3. Limitación de responsabilidad.
4. Terminación anticipada.
5. Legislación aplicable y jurisdicción.

Fecha de generación: ${new Date().toISOString()}
`;

    const fileName = "contrato_macapa.txt";
    const filePath = path.join(carpetaContrato, fileName);

    fs.writeFileSync(filePath, contenido, "utf8");

    const hash = crypto.createHash("sha256").update(contenido).digest("hex");

    ExpedienteDigital.registrarAccion(idProyecto, {
      actor: "Agent Omega",
      accion: "Generó contrato",
      documento: `04_contrato/${fileName}`,
      hash
    });

    return { filePath, hash };
  }

  static registrarFirma(
    idProyecto: string,
    firmante: string,
    documentoRelativo: string,
    metodo: "firma_digital_simple" | "firma_digital_externa",
    extra?: any
  ) {
    const expedientePath = this.getExpedientePath(idProyecto);
    const metadataPath = path.join(expedientePath, "metadata.json");
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

    const documentoPath = path.join(expedientePath, documentoRelativo);
    const contenido = fs.readFileSync(documentoPath, "utf8");
    const hashDocumento = crypto.createHash("sha256").update(contenido).digest("hex");

    const firma = {
      firmante,
      fecha: new Date().toISOString(),
      documento: documentoRelativo,
      hashDocumento,
      metodo,
      extra: extra ?? null
    };

    metadata.firmas = metadata.firmas || [];
    metadata.firmas.push(firma);

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    ExpedienteDigital.registrarAccion(idProyecto, {
      actor: firmante,
      accion: "Firmó documento",
      documento: documentoRelativo,
      hash: hashDocumento,
      metodoFirma: metodo
    });

    return firma;
  }
}
