// backend/api/workflow.routes.ts

import { Router } from "express";
import { WorkflowEngine } from "../logic/workflow_engine";

const router = Router();

router.post("/inicializar", (req, res) => {
  try {
    const { idProyecto, producto, usuario } = req.body;

    const workflow = WorkflowEngine.inicializarProyecto(idProyecto, producto, usuario);

    res.json({
      ok: true,
      mensaje: "Proyecto inicializado correctamente",
      workflow
    });

  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
