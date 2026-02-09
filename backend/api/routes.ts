import type { Express } from "express";
import type { Server } from "http";
import agentesRoutes from "./agentes.routes";

app.use("/api/agentes", agentesRoutes);


import kpiRouter from "./kpi.routes";
import lavidRouter from "./lavid.routes";
import researchRouter from "./research.routes";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  // KPI ENGINE
  app.use("/api/kpi", kpiRouter);

  // LAVID LITE
  app.use("/api/lavid", lavidRouter);

  // RESEARCH ENGINE
  app.use("/api/research", researchRouter);

  return httpServer;
}
