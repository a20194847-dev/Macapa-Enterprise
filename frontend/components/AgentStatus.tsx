import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Agent {
  name: string;
  role: string;
  status: "online" | "processing" | "offline";
}

const AGENTS: Agent[] = [
  { name: "ALEX IA", role: "Auditor Forense Principal", status: "processing" },
  { name: "Alex Flash", role: "Director Visual Ejecutivo", status: "online" },
  { name: "CONTRALOR", role: "Supervisor de Calidad IA", status: "online" },
  { name: "Alpha/Omega", role: "Coordinadores", status: "online" },
];

export function AgentStatusHeader() {
  return (
    <div className="h-14 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm font-mono text-muted-foreground">RED SEGURA</span>
      </div>

      <div className="flex items-center gap-3">
        {AGENTS.map((agent) => (
          <Tooltip key={agent.name}>
            <TooltipTrigger>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border hover:border-primary/50 transition-colors cursor-help">
                <div className={cn("w-2 h-2 rounded-full", 
                  agent.status === "processing" ? "bg-amber-400 animate-bounce" : "bg-emerald-400"
                )} />
                <span className="text-xs font-medium">{agent.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <p className="font-bold">{agent.role}</p>
                <p className="text-muted-foreground capitalize">
                  {agent.status === "online" ? "En línea" : agent.status === "processing" ? "Procesando" : "Desconectado"}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
