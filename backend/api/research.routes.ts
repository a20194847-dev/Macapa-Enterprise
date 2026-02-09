// backend/api/research.routes.ts

import { Router } from "express";
import { ResearchEngine } from "../../core/services/research_engine";

const router = Router();

router.get("/research/arxiv", (_req, res) => {
  const papers = ResearchEngine.getArxivPapers();
  res.json({ papers });
});

router.get("/research/repos", (_req, res) => {
  const repos = ResearchEngine.getRepoInsights();
  res.json({ repos });
});

export default router;
