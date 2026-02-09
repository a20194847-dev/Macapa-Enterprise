// backend/logic/workflow_engine.ts

import { WorkflowLoader } from "./workflow_loader";
import { ExpedienteDigital } from "./expediente";
import { PhaseGate } from "./phase_gate";

export class WorkflowEngine {

  static inicializarProyecto(idProyecto: string, producto: string, usuario: string) {

    // 1. Crear expediente legal
    ExpedienteDigital.crearExpediente(idProyecto, usuario);

    // 2. Cargar workflow del producto
    const workflow = WorkflowLoader.obtenerWorkflow(producto);

    // 3. Registrar fases en el expediente
    workflow.fases.forEach(fase => {
      const nombreFase = `${fase.numero}_${fase.nombre}`;

      if (fase.numero === 1) {
        PhaseGate.solicitarAprobacion(idProyecto, nombreFase);
      } else {
        PhaseGate.bloquear(idProyecto, nombreFase);
      }
    });

    return workflow;
  }

  static avanzar(idProyecto: string, faseActual: string) {
    const numero = parseInt(faseActual.split("_")[0]);
    const siguiente = `${numero + 1}`;

    PhaseGate.aprobar(idProyecto, faseActual);
    PhaseGate.solicitarAprobacion(idProyecto, siguiente);

    return {
      ok: true,
      mensaje: "Fase aprobada y siguiente fase habilitada",
      faseActual,
      siguiente
    };
  }
}
