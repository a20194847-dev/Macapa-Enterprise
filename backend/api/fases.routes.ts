// backend/api/fases.routes.ts

import { Router } from "express";
import { PhaseGate } from "../logic/phase_gate";
import { WorkflowEngine } from "../logic/workflow_engine";

const router = Router();

router.post("/aprobar", (req, res) => {
  try {
    const { idProyecto, fase } = req.body;

    PhaseGate.aprobar(idProyecto, fase);

    const resultado = WorkflowEngine.avanzar(idProyecto, fase);

    res.json(resultado);

  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.post("/rechazar", (req, res) => {
  try {
    const { idProyecto, fase, motivo } = req.body;

    PhaseGate.rechazar(idProyecto, fase, motivo);

    res.json({
      ok: true,
      mensaje: "Fase rechazada y devuelta al agente",
      fase,
      motivo
    });

  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
