import { Router } from "express";
import { ResearchLogic } from "../logic/research_logic";

const router = Router();

router.get("/arxiv", (_req, res) => {
  const papers = ResearchLogic.getArxivPapers();
  res.json({ papers });
});

router.get("/repos", (_req, res) => {
  const repos = ResearchLogic.getRepoInsights();
  res.json({ repos });
});

export default router;

