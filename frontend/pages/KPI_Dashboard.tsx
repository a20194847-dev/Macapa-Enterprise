// frontend/pages/KPI_Dashboard.tsx

import React, { useState } from "react";

export const KPI_Dashboard: React.FC = () => {
  const [insights, setInsights] = useState([]);

  const analizar = async () => {
    const resp = await fetch("/api/kpi/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kpis: [
          { nombre: "Pagos duplicados", valor: 7, categoria: "Finanzas" },
          { nombre: "Deuda coactiva", valor: 3, categoria: "Proveedores" },
          { nombre: "Proveedores exclusivos", valor: 4, categoria: "Compras" },
        ],
      }),
    });

    const data = await resp.json();
    setInsights(data.insights);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-50">Dashboard de KPI</h1>

      <button
        onClick={analizar}
        className="px-4 py-2 bg-blue-500 text-slate-900 rounded font-semibold"
      >
        Analizar KPI de ejemplo
      </button>

      <div className="grid gap-4 mt-4">
        {insights.map((i, idx) => (
          <div key={idx} className="p-4 bg-slate-900/60 rounded text-slate-50">
            <h3 className="font-semibold">{i.kpi}</h3>
            <p className="text-sm">{i.descripcion}</p>
            <p className="text-xs text-emerald-300 mt-2">
              Recomendación: {i.recomendacion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
