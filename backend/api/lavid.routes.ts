// backend/api/lavid.routes.ts

import { Router } from "express";
import { obtenerRecomendacionesLavid } from "../logic/lavid_logic";

const router = Router();

router.post("/lavid/recommendations", async (req, res) => {
  try {
    const contexto = req.body;
    const recomendaciones = await obtenerRecomendacionesLavid(contexto);
    res.json({ recomendaciones });
  } catch (error) {
    console.error("Error en LAVID LITE:", error);
    res.status(500).json({ error: "Error procesando recomendaciones de LAVID LITE" });
  }
});

export default router;
