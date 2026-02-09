// backend/api/contratos.routes.ts

import { Router } from "express";
import { WorkflowLegal } from "../logic/workflow_legal";
import path from "path";
import fs from "fs";

const router = Router();

// Emitir contrato
router.post("/emitir", async (req, res) => {
  try {
    const { idProyecto, datosContrato } = req.body;

    const resultado = await WorkflowLegal.emitirContrato(idProyecto, datosContrato);

    res.json({
      ok: true,
      mensaje: "Contrato generado y esperando aprobación",
      archivo: resultado.filePath,
      hash: resultado.hash
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Descargar contrato
router.get("/descargar/:idProyecto", (req, res) => {
  try {
    const idProyecto = req.params.idProyecto;
    const filePath = path.join(
      process.cwd(),
      "expedientes",
      idProyecto,
      "04_contrato",
      "contrato_macapa.txt"
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ ok: false, error: "Contrato no encontrado" });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Firmar contrato
router.post("/firmar", async (req, res) => {
  try {
    const { idProyecto, firmante } = req.body;

    const firma = await WorkflowLegal.firmarContrato(idProyecto, firmante);

    res.json({
      ok: true,
      mensaje: "Contrato firmado correctamente",
      firma
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Ver estado del contrato
router.get("/estado/:idProyecto", (req, res) => {
  try {
    const idProyecto = req.params.idProyecto;

    const estadoPath = path.join(
      process.cwd(),
      "expedientes",
      idProyecto,
      "04_contrato_estado.json"
    );

    if (!fs.existsSync(estadoPath)) {
      return res.status(404).json({ ok: false, error: "Estado no encontrado" });
    }

    const estado = JSON.parse(fs.readFileSync(estadoPath, "utf8"));

    res.json({ ok: true, estado });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
