import { storage } from "../database/storage";
import { WORKFLOW_ROMERO } from "./workflow_template";
import { SupervisionEngine } from "./supervision";
import { EntregablesEngine } from "./entregables";

export class WorkflowEngine {

  // Inicializar fases según plantilla Romero
  static async inicializarAuditoria(auditoriaId: number) {
    const fases = WORKFLOW_ROMERO.map((f, i) => ({
      id: Date.now() + i,
      auditoriaId,
      numero: f.numero,
      nombre: f.nombre,
      descripcion: f.pasos.join("; "),
      estado: i === 0 ? "en_progreso" : "pendiente",
      agenteAsignado: f.agenteAsignado,
      entregablesRequeridos: JSON.stringify(f.entregablesRequeridos),
      completado: false,
      fechaInicio: i === 0 ? new Date() : null,
      fechaFin: null
    }));

    for (const fase of fases) {
      await storage.updateFase(fase.id, fase);
    }

    return fases;
  }

  // Completar fase
  static async completarFase(auditoriaId: number, faseId: number) {
    const fase = await storage.updateFase(faseId, {
      completado: true,
      estado: "completada",
      fechaFin: new Date()
    });

    // Supervisión automática del CONTRALOR
    await SupervisionEngine.supervisarFase(auditoriaId, faseId);

    return fase;
  }

  // Avanzar fase
  static async avanzar(auditoriaId: number) {
    const auditoria = await storage.getAuditoria(auditoriaId);
    const fases = await storage.getFasesByAuditoria(auditoriaId);

    const actual = fases.find(f => f.numero === auditoria.faseActual);
    const siguiente = fases.find(f => f.numero === auditoria.faseActual + 1);

    if (!actual.completado) throw new Error("La fase actual no está completada");
    if (!siguiente) return this.cerrarAuditoria(auditoriaId);

    await storage.updateAuditoria(auditoriaId, {
      faseActual: siguiente.numero,
      progreso: Math.round((siguiente.numero / fases.length) * 100)
    });

    await storage.updateFase(siguiente.id, {
      estado: "en_progreso",
      fechaInicio: new Date()
    });

    return siguiente;
  }

  // Cerrar auditoría
  static async cerrarAuditoria(auditoriaId: number) {
    await storage.updateAuditoria(auditoriaId, {
      estado: "completada",
      progreso: 100,
      fechaFin: new Date()
    });

    return true;
  }
}
import { ExpedienteDigital } from "./expediente";

static async solicitarAprobacion(auditoriaId: number, fase: string) {
  ExpedienteDigital.actualizarEstadoFase(auditoriaId, fase, "esperando_aprobacion");
}

static async aprobar(auditoriaId: number, fase: string) {
  ExpedienteDigital.aprobarFase(auditoriaId, fase);
  return this.avanzar(auditoriaId);
}
