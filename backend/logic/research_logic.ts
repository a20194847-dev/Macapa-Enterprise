export class ResearchLogic {
  static getArxivPapers() {
    return [
      { titulo: "AI Governance 2025", autor: "OpenAI Research", año: 2025 },
      { titulo: "Synthetic Agents & Compliance", autor: "DeepMind", año: 2024 }
    ];
  }

  static getRepoInsights() {
    return [
      { repo: "macapa-enterprise", actividad: "Alta", issues: 3 },
      { repo: "macapa-agents", actividad: "Media", issues: 1 }
    ];
  }
}
