// core/services/research_engine.ts

import fs from "fs";
import path from "path";

export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  year?: number;
  authors?: string[];
}

export interface RepoInsight {
  name: string;
  url: string;
  key_patterns: string[];
  relevance_for_macapa: string;
}

export class ResearchEngine {
  static getArxivPapers(): ArxivPaper[] {
    const file = path.join(__dirname, "../../tools/analysis/arxiv_ml_20.json");
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  }

  static getRepoInsights(): RepoInsight[] {
    const file = path.join(__dirname, "../../tools/analysis/repos_analysis.json");
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  }
}
