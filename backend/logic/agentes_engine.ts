// backend/logic/agentes_engine.ts

import { AGENTES_MACAPA } from "./agentes_catalog";
import { ExpedienteDigital } from "./expediente";

export class AgentesEngine {

  static obtenerAgente(nombre: string) {
    const agente = AGENTES_MACAPA.find(a => a.nombre === nombre);
    if (!agente) throw new Error(`Agente no encontrado: ${nombre}`);
    return agente;
  }

  static ejecutarAccion(if (accion.startsWith("generar_")) {
  const nombreArchivo = `${accion}_${Date.now()}.txt`;

  const contenido = datos?.contenido ?? 
    `Entregable generado por ${agenteNombre} en la acción ${accion}`;

  const fase = datos?.fase ?? "00_solicitud_inicial";

  const resultado = EntregablesEngine.generarEntregable(
    idProyecto,
    fase,
    agenteNombre,
    nombreArchivo,
    contenido
  );

  return {
    ok: true,
    mensaje: "Entregable generado",
    entregable: resultado
  };
}

    idProyecto: string,
    agenteNombre: string,
    accion: string,
    datos?: any
  ) {
    const agente = this.obtenerAgente(agenteNombre);

    if (!agente.capacidades.includes(accion)) {
      throw new Error(`El agente ${agenteNombre} no puede ejecutar la acción: ${accion}`);
    }

    ExpedienteDigital.registrarAccion(idProyecto, {
      actor: agenteNombre,
      accion,
      datos
    });

    return {
      ok: true,
      agente: agenteNombre,
      accion,
      datos
    };
  }
}
