import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useLogs, useAgentes } from "@/hooks/use-cases";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FolderKanban, Brain, AlertTriangle, Activity, ArrowRight, 
  User, Bot, Users, Sparkles, Shield, Zap, Search, Target,
  CheckCircle, Clock, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Auditoria {
  id: number;
  nombre: string;
  progreso: number | null;
  estado: string;
  agenteResponsable: string | null;
}

const agentIcons: Record<string, typeof Brain> = {
  "brain": Brain,
  "zap": Zap,
  "shield": Shield,
  "search": Search,
  "target": Target,
};

export default function Dashboard() {
  const { data: stats } = useQuery<{ proyectosActivos: number; analisisIA: number; riesgoPromedio: number; anomaliasDetectadas: number }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: logs } = useLogs();
  const { data: agentes } = useAgentes();
  const { data: auditorias } = useQuery<Auditoria[]>({ queryKey: ["/api/auditorias"] });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Auditoría</h1>
          <p className="text-muted-foreground">Monitoreo en tiempo real de operaciones de auditoría forense con IA</p>
        </div>
        <Link href="/audit-workbench">
          <Button data-testid="button-ir-workbench">
            <Sparkles className="w-4 h-4 mr-2" />
            Abrir Audit Workbench
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-panel">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Proyectos Activos</p>
                <p className="text-3xl font-bold" data-testid="text-proyectos-activos">{stats?.proyectosActivos || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <FolderKanban className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Auditorías IA</p>
                <p className="text-3xl font-bold" data-testid="text-analisis-ia">{stats?.analisisIA || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Riesgo Promedio</p>
                <p className="text-3xl font-bold" data-testid="text-riesgo-promedio">{stats?.riesgoPromedio || 0}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Anomalías Detectadas</p>
                <p className="text-3xl font-bold" data-testid="text-anomalias">{stats?.anomaliasDetectadas || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Diagram */}
        <Card className="glass-panel lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Arquitectura: IA que Supervisa IA</CardTitle>
            <CardDescription>Flujo de trabajo con supervisión cruzada en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-3 py-6 flex-wrap">
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto mb-2 border border-primary/30">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm font-medium">Usuario</p>
                <p className="text-[10px] text-muted-foreground">Solicitud</p>
              </div>
              
              <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-500/10 flex items-center justify-center mx-auto mb-2 border border-cyan-500/30">
                  <Search className="w-7 h-7 text-cyan-400" />
                </div>
                <p className="text-sm font-medium">Alpha</p>
                <p className="text-[10px] text-muted-foreground">Inicia Fase</p>
              </div>
              
              <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-500/10 flex items-center justify-center mx-auto mb-2 border border-blue-500/30">
                  <Brain className="w-7 h-7 text-blue-400" />
                </div>
                <p className="text-sm font-medium">ALEX IA</p>
                <p className="text-[10px] text-muted-foreground">Ejecuta</p>
              </div>
              
              <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 flex items-center justify-center mx-auto mb-2 border border-purple-500/30">
                  <Target className="w-7 h-7 text-purple-400" />
                </div>
                <p className="text-sm font-medium">Omega</p>
                <p className="text-[10px] text-muted-foreground">Finaliza</p>
              </div>
            </div>

            {/* Supervisor */}
            <div className="flex justify-center mt-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">CONTRALOR supervisa todo el flujo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              Agentes Activos
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">5 EN LÍNEA</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {agentes?.slice(0, 5).map((agent) => {
              const Icon = agentIcons[agent.avatar] || Brain;
              return (
                <div 
                  key={agent.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  data-testid={`agent-status-${agent.id}`}
                >
                  <div className={cn(
                    "relative w-8 h-8 rounded-lg flex items-center justify-center",
                    agent.color === "blue" ? "bg-blue-500/20 text-blue-400" :
                    agent.color === "yellow" ? "bg-yellow-500/20 text-yellow-400" :
                    agent.color === "red" ? "bg-red-500/20 text-red-400" :
                    agent.color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
                    "bg-purple-500/20 text-purple-400"
                  )}>
                    <Icon className="w-4 h-4" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-card" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{agent.nombre}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{agent.rol}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">{agent.precision}%</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Auditorias and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Auditorias */}
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Auditorías en Progreso</CardTitle>
              <CardDescription>Flujos de trabajo activos</CardDescription>
            </div>
            <Link href="/audit-workbench">
              <Button variant="ghost" size="sm" data-testid="button-ver-todas">
                Ver todas
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditorias?.map((auditoria) => (
              <div 
                key={auditoria.id}
                className="p-3 rounded-lg bg-secondary/30 border border-border"
                data-testid={`auditoria-preview-${auditoria.id}`}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <p className="font-medium text-sm truncate">{auditoria.nombre}</p>
                  <Badge variant="outline" className={cn(
                    "text-[10px]",
                    auditoria.estado === "en_progreso" ? "border-blue-500/50 text-blue-400" :
                    auditoria.estado === "completada" ? "border-emerald-500/50 text-emerald-400" :
                    "border-muted-foreground"
                  )}>
                    {auditoria.estado === "en_progreso" ? "En Progreso" : 
                     auditoria.estado === "completada" ? "Completada" : auditoria.estado}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={auditoria.progreso || 0} className="flex-1 h-1.5" />
                  <span className="text-xs text-muted-foreground w-8">{auditoria.progreso || 0}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Responsable: {auditoria.agenteResponsable}
                </p>
              </div>
            ))}
            {(!auditorias || auditorias.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No hay auditorías activas</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Actividad de Agentes</CardTitle>
              <CardDescription>Supervisión IA-to-IA en tiempo real</CardDescription>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-0">En vivo</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logs?.slice(0, 4).map((log) => (
                <div 
                  key={log.id} 
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-all",
                    log.sesgoDetectado ? "bg-red-500/10 border-red-500/30" : "bg-secondary/30 border-border"
                  )}
                  data-testid={`log-item-${log.id}`}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    log.agenteNombre === "CONTRALOR" ? "bg-red-500/20 text-red-400" :
                    log.agenteNombre === "ALEX IA" ? "bg-blue-500/20 text-blue-400" :
                    log.agenteNombre === "Alex Flash" ? "bg-yellow-500/20 text-yellow-400" :
                    log.agenteNombre === "Agent Alpha" ? "bg-cyan-500/20 text-cyan-400" :
                    "bg-purple-500/20 text-purple-400"
                  )}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{log.agenteNombre}</span>
                      <Badge variant="outline" className="text-[10px]">{log.accion}</Badge>
                      {log.sesgoDetectado && (
                        <Badge className="text-[10px] bg-red-500/20 text-red-400 border-0">SESGO</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{log.detalles}</p>
                  </div>
                </div>
              ))}
              {(!logs || logs.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No hay actividad reciente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
