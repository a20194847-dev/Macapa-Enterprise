// frontend/components/LAVID_Insight.tsx

import React from "react";

type LavidRecommendation = {
  titulo: string;
  descripcion: string;
  tipo: string;
  horizonte: string;
  pasos: string[];
  impactoEsperado: string;
};

interface Props {
  rec: LavidRecommendation;
}

export const LAVID_Insight: React.FC<Props> = ({ rec }) => {
  return (
    <div className="border rounded-lg p-4 bg-slate-900/60 text-slate-50 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{rec.titulo}</h3>
        <span className="text-xs px-2 py-1 rounded bg-slate-700">
          {rec.tipo} · {rec.horizonte}
        </span>
      </div>
      <p className="text-sm text-slate-200">{rec.descripcion}</p>
      <div>
        <p className="text-xs font-semibold text-slate-300">Pasos sugeridos:</p>
        <ul className="list-disc list-inside text-xs text-slate-200">
          {rec.pasos.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-emerald-300">
        Impacto esperado: <span className="font-semibold">{rec.impactoEsperado}</span>
      </p>
    </div>
  );
};
