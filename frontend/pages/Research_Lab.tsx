// frontend/pages/Research_Lab.tsx

import React, { useEffect, useState } from "react";

export const Research_Lab: React.FC = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/research/arxiv").then(r => r.json()).then(d => setPapers(d.papers || []));
    fetch("/api/research/repos").then(r => r.json()).then(d => setRepos(d.repos || []));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-50">MACAPA Research Lab</h1>

      <section>
        <h2 className="text-xl font-semibold text-slate-100">Papers arXiv (ML / IA)</h2>
        <div className="grid gap-3 mt-3">
          {papers.map((p, i) => (
            <div key={i} className="p-3 bg-slate-900/60 rounded text-slate-50">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-xs text-slate-300">{p.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-100">Insights de repos clave</h2>
        <div className="grid gap-3 mt-3">
          {repos.map((r, i) => (
            <div key={i} className="p-3 bg-slate-900/60 rounded text-slate-50">
              <h3 className="font-semibold">{r.name}</h3>
              <p className="text-xs text-slate-300">{r.relevance_for_macapa}</p>
              <ul className="list-disc list-inside text-xs text-slate-200 mt-1">
                {(r.key_patterns || []).map((p: string, idx: number) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
