// frontend/pages/LAVID.tsx

import React, { useState } from "react";
import { LAVID_Insight } from "../components/LAVID_Insight";

type LavidRecommendation = {
  titulo: string;
  descripcion: string;
  tipo: string;
  horizonte: string;
  pasos: string[];
  impactoEsperado: string;
};

export const LAVID: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<LavidRecommendation[]>([]);

  const handleTest = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/lavid/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: "KPI",
          empresa: { nombre: "Empresa Demo", tamano: "PYME", pais: "Perú" },
          ecosistema: { cluster: "Agroexportador" },
          kpis: [
            { name: "Pagos duplicados", value: 5 },
            { name: "Deuda coactiva", value: 3 },
            { name: "Proveedores exclusivos", value: 4 },
          ],
          procesos: ["Proceso de compras manual con uso de papel"],
        }),
      });
      const data = await resp.json();
      setRecs(data.recomendaciones || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-50">LAVID LITE — Conciencia Estratégica</h1>
      <p className="text-sm text-slate-200 max-w-2xl">
        LAVID LITE analiza tu contexto, tus KPI y tus procesos para proponerte mejoras sostenibles, éticas y
        estratégicas. No solo pide resultados: enseña a crecer.
      </p>
      <button
        onClick={handleTest}
        disabled={loading}
        className="px-4 py-2 rounded bg-emerald-500 text-slate-900 text-sm font-semibold disabled:opacity-50"
      >
        {loading ? "Analizando contexto..." : "Probar LAVID con un escenario de ejemplo"}
      </button>

      <div className="grid gap-4 md:grid-cols-2">
        {recs.map((r, i) => (
          <LAVID_Insight key={i} rec={r} />
        ))}
      </div>
    </div>
  );
};
