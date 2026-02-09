// backend/api/entregables.routes.ts

import { Router } from "express";
import { EntregablesEngine } from "../logic/entregables_engine";

const router = Router();

router.get("/:idProyecto/:fase", (req, res) => {
  try {
    const { idProyecto, fase } = req.params;

    const lista = EntregablesEngine.listarEntregables(idProyecto, fase);

    res.json({ ok: true, entregables: lista });

  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
