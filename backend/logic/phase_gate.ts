// backend/logic/phase_gate.ts

import fs from "fs";
import path from "path";
import { ExpedienteDigital } from "./expediente";

export class PhaseGate {

  static basePath = path.join(process.cwd(), "expedientes");

  static getFasePath(idProyecto: string, fase: string) {
    return path.join(this.basePath, idProyecto, `${fase}_estado.json`);
  }

  static obtenerEstado(idProyecto: string, fase: string) {
    const fasePath = this.getFasePath(idProyecto, fase);

    if (!fs.existsSync(fasePath)) {
      throw new Error(`No existe el archivo de estado para la fase: ${fase}`);
    }

    return JSON.parse(fs.readFileSync(fasePath, "utf8"));
  }

  static bloquear(idProyecto: string, fase: string) {
    const data = {
      fase,
      estado: "bloqueada",
      fecha: new Date().toISOString()
    };

    fs.writeFileSync(this.getFasePath(idProyecto, fase), JSON.stringify(data, null, 2));

    ExpedienteDigital.registrarAccion(idProyecto, {
      actor: "Sistema",
      accion: "Bloqueó fase",
      fase
    });
  }

  static solicitarAprobacion(idProyecto: string, fase: string) {
    const data = {
      fase,
      estado: "esperando_aprobacion",
      fecha: new Date().toISOString()
    };

    fs.writeFileSync(this.getFasePath(idProyecto, fase), JSON.stringify(data, null, 2));

    ExpedienteDigital.registrarAccion(idProyecto, {
      actor: "Sistema",
      accion: "Solicitó aprobación",
      fase
    });
  }

  static aprobar(idProyecto: string, fase: string) {
    const data = {
      fase,
      estado: "aprobada",
      fecha: new Date().toISOString()
    };

    fs.writeFileSync(this.getFasePath(idProyecto, fase), JSON.stringify(data, null, 2));

    ExpedienteDigital.registrarAccion(idProyecto, {
      actor: "Usuario",
      accion: "Aprobó fase",
      fase
    });
  }

  static rechazar(idProyecto: string, fase: string, motivo: string) {
    const data = {
      fase,
      estado: "rechazada",
      motivo,
      fecha: new Date().toISOString()
    };

    fs.writeFileSync(this.getFasePath(idProyecto, fase), JSON.stringify(data, null, 2));

    ExpedienteDigital.registrarAccion(idProyecto, {
      actor: "Usuario",
      accion: "Rechazó fase",
      fase,
      motivo
    });
  }
}
