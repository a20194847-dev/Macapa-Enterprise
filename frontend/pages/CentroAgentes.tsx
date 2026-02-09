import { useState } from "react";
import { useAgentes, useLogs, useEjecutarAnalisis } from "@/hooks/use-cases";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Shield, Search, Target, Play, Loader2, MessageSquare, Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof Brain> = {
  brain: Brain,
  zap: Zap,
  shield: Shield,
  search: Search,
  target: Target,
};

interface Agente {
  id: number;
  nombre: string;
  rol: string;
  avatar: string;
  experiencia: string;
  credenciales: string | null;
  especialidad: string;
  estado: string | null;
  color: string;
  personalidad: string | null;
  estiloRespuesta: string | null;
  saludoDefault: string | null;
  precision: number | null;
}

export default function CentroAgentes() {
  const { data: agentes, isLoading } = useAgentes() as { data: Agente[] | undefined; isLoading: boolean };
  const { data: logs } = useLogs();
  const ejecutarMutation = useEjecutarAnalisis();
  const [selectedAgent, setSelectedAgent] = useState<number | null>(1);

  const selectedAgentData = agentes?.find(a => a.id === selectedAgent);

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Centro de Agentes IA</h1>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">5 Agentes Activos</Badge>
          </div>
          <p className="text-muted-foreground mt-1">Equipo de especialistas IA con supervisión cruzada en tiempo real</p>
        </div>
        <Button
          size="lg"
          onClick={() => ejecutarMutation.mutate()}
          disabled={ejecutarMutation.isPending}
          data-testid="button-ejecutar-analisis"
        >
          {ejecutarMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Ejecutando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Ejecutar Análisis Multi-Agente
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Agents List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <Card className="glass-panel flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Equipo de Agentes</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="px-4 pb-4 space-y-2">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  agentes?.map((agent) => {
                    const Icon = iconMap[agent.avatar] || Brain;
                    const isSelected = selectedAgent === agent.id;
                    return (
                      <div
                        key={agent.id}
                        onClick={() => setSelectedAgent(agent.id)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all",
                          isSelected 
                            ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/10" 
                            : "border-border hover:bg-secondary"
                        )}
                        data-testid={`agent-card-${agent.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "relative w-10 h-10 rounded-lg flex items-center justify-center",
                            agent.color === "blue" ? "bg-blue-500/20 text-blue-400" :
                            agent.color === "yellow" ? "bg-yellow-500/20 text-yellow-400" :
                            agent.color === "red" ? "bg-red-500/20 text-red-400" :
                            agent.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
                            "bg-purple-500/20 text-purple-400"
                          )}>
                            <Icon className="w-5 h-5" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{agent.nombre}</p>
                            <p className="text-xs text-muted-foreground truncate">{agent.rol}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-emerald-400">{agent.precision}%</p>
                            <p className="text-[10px] text-muted-foreground">precisión</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Agent Details */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {selectedAgentData && (
            <Card className={cn(
              "glass-panel overflow-hidden",
              selectedAgentData.color === "blue" ? "agent-glow-alex" :
              selectedAgentData.color === "yellow" ? "agent-glow-flash" :
              selectedAgentData.color === "red" ? "agent-glow-contralor" :
              ""
            )}>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Agent Avatar */}
                  <div className={cn(
                    "w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0",
                    selectedAgentData.color === "blue" ? "bg-blue-500/20 text-blue-400" :
                    selectedAgentData.color === "yellow" ? "bg-yellow-500/20 text-yellow-400" :
                    selectedAgentData.color === "red" ? "bg-red-500/20 text-red-400" :
                    selectedAgentData.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
                    "bg-purple-500/20 text-purple-400"
                  )}>
                    {(() => {
                      const Icon = iconMap[selectedAgentData.avatar] || Brain;
                      return <Icon className="w-10 h-10" />;
                    })()}
                  </div>

                  {/* Agent Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold">{selectedAgentData.nombre}</h2>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">En línea</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{selectedAgentData.rol}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Experiencia</p>
                        <p className="text-sm font-medium">{selectedAgentData.experiencia}</p>
                      </div>
                      {selectedAgentData.credenciales && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Credenciales</p>
                          <p className="text-sm font-medium">{selectedAgentData.credenciales}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-1">Especialidad</p>
                      <p className="text-sm">{selectedAgentData.especialidad}</p>
                    </div>

                    {/* Precision Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-muted-foreground">Precisión de Análisis</p>
                        <p className="text-sm font-bold text-emerald-400">{selectedAgentData.precision}%</p>
                      </div>
                      <Progress value={selectedAgentData.precision || 0} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Personality */}
                {selectedAgentData.personalidad && (
                  <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-primary" />
                      <p className="text-xs font-medium text-muted-foreground">Personalidad IA</p>
                    </div>
                    <p className="text-sm">{selectedAgentData.personalidad}</p>
                  </div>
                )}

                {/* Default Greeting */}
                {selectedAgentData.saludoDefault && (
                  <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-primary mb-1">Saludo del Agente</p>
                        <p className="text-sm italic text-muted-foreground">"{selectedAgentData.saludoDefault}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Supervision Log */}
          <Card className="glass-panel flex-1 min-h-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-400" />
                Log de Supervisión IA-to-IA
              </CardTitle>
              <CardDescription>El CONTRALOR supervisa todas las acciones de los agentes</CardDescription>
            </CardHeader>
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="px-6 pb-6 space-y-2">
                {logs?.map((log) => (
                  <div 
                    key={log.id} 
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      log.sesgoDetectado 
                        ? "bg-red-500/10 border-red-500/30" 
                        : log.agenteNombre === "CONTRALOR"
                          ? "bg-red-500/5 border-red-500/20"
                          : "bg-secondary/30 border-border"
                    )}
                    data-testid={`supervision-log-${log.id}`}
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline" className={cn(
                        "text-[10px]",
                        log.agenteNombre === "CONTRALOR" ? "border-red-500/50 text-red-400 bg-red-500/10" :
                        log.agenteNombre === "ALEX IA" ? "border-blue-500/50 text-blue-400 bg-blue-500/10" :
                        log.agenteNombre === "Alex Flash" ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" :
                        log.agenteNombre === "Agent Alpha" ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10" :
                        "border-purple-500/50 text-purple-400 bg-purple-500/10"
                      )}>
                        {log.agenteNombre}
                      </Badge>
                      <span className="text-xs font-medium">{log.accion}</span>
                      {log.sesgoDetectado && (
                        <Badge className="text-[10px] bg-red-500/20 text-red-400 border-0">SESGO DETECTADO</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{log.detalles}</p>
                    {log.correccionAplicada && (
                      <div className="flex items-center gap-2 mt-2 text-emerald-400">
                        <CheckCircle className="w-3 h-3" />
                        <p className="text-xs">Corrección: {log.correccionAplicada}</p>
                      </div>
                    )}
                  </div>
                ))}
                {(!logs || logs.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Shield className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      Ejecuta un análisis para ver los logs de supervisión
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
