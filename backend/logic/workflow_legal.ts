// backend/logic/workflow_legal.ts

import { ContratosEngine } from "./contratos";
import { ExpedienteDigital } from "./expediente";

export class WorkflowLegal {

  static async emitirContrato(idProyecto: string, datosContrato: any) {
    const { filePath, hash } = ContratosEngine.generarContrato(idProyecto, datosContrato);

    ExpedienteDigital.actualizarEstadoFase(idProyecto, "04_contrato", "esperando_aprobacion");

    return { filePath, hash };
  }

  static async firmarContrato(idProyecto: string, firmante: string) {
    const firma = ContratosEngine.registrarFirma(
      idProyecto,
      firmante,
      "04_contrato/contrato_macapa.txt",
      "firma_digital_simple"
    );

    ExpedienteDigital.actualizarEstadoFase(idProyecto, "04_contrato", "aprobada");

    return firma;
  }
}
