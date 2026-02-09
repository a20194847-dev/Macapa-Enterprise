import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, BookOpen, Shield, Brain, FileText, Users, 
  ArrowRight, Play, Clock, Target, Search, Sparkles, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TipoAuditoria {
  id: number;
  nombre: string;
  descripcion: string;
  normativaAplicable: string;
  duracionEstimada: string;
  fasesRequeridas: string;
  entregablesRequeridos: string;
  icono: string;
  color: string;
}

const frameworks = [
  {
    id: "coso",
    name: "COSO Framework",
    fullName: "Committee of Sponsoring Organizations",
    description: "Marco integrado de control interno para gestión de riesgos empresariales. Estándar mundial para diseño, implementación y evaluación de controles internos.",
    components: ["Ambiente de Control", "Evaluación de Riesgos", "Actividades de Control", "Información y Comunicación", "Monitoreo"],
    icon: Shield,
    color: "blue",
    aplicacion: "Due Diligence, Auditoría de Cumplimiento"
  },
  {
    id: "isa240",
    name: "ISA 240",
    fullName: "Responsabilidad del Auditor en Fraude",
    description: "Norma internacional sobre responsabilidad del auditor en la detección de fraudes y errores materiales en estados financieros.",
    components: ["Escepticismo Profesional", "Procedimientos de Valoración", "Respuestas a Riesgos", "Evaluación de Evidencia"],
    icon: FileText,
    color: "green",
    aplicacion: "Investigación de Fraude, Auditoría Financiera"
  },
  {
    id: "sox",
    name: "SOX Compliance",
    fullName: "Sarbanes-Oxley Act Section 404",
    description: "Ley Sarbanes-Oxley para controles internos en informes financieros. Obligatoria para empresas cotizadas en EE.UU.",
    components: ["Controles Internos", "Documentación", "Evaluación de Diseño", "Pruebas de Efectividad"],
    icon: CheckCircle,
    color: "purple",
    aplicacion: "Auditoría de Cumplimiento, Auditoría Financiera"
  },
  {
    id: "benford",
    name: "Ley de Benford",
    fullName: "Análisis de Primer Dígito",
    description: "Análisis estadístico de frecuencia de dígitos iniciales para detección de anomalías y manipulación de datos financieros.",
    components: ["Distribución Esperada", "Análisis de Desviaciones", "Umbrales de Alerta", "Correlación con Fraude"],
    icon: Brain,
    color: "orange",
    aplicacion: "Investigación de Fraude, Auditoría Financiera"
  }
];

const workflowSteps = [
  { icon: Search, label: "Alpha Investiga", desc: "Recopilación de evidencia" },
  { icon: Brain, label: "ALEX IA Analiza", desc: "Análisis forense profundo" },
  { icon: Shield, label: "CONTRALOR Valida", desc: "Detección de sesgos" },
  { icon: Target, label: "Omega Sintetiza", desc: "Generación de reportes" },
];

export default function Metodologia() {
  const { data: tiposAuditoria, isLoading: tiposLoading } = useQuery<TipoAuditoria[]>({
    queryKey: ["/api/tipos-auditoria"],
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Metodología de Auditoría</h1>
          <p className="text-muted-foreground">Marcos normativos y flujos de trabajo predefinidos</p>
        </div>
        <Link href="/audit-workbench">
          <Button data-testid="button-ir-workbench">
            <Sparkles className="w-4 h-4 mr-2" />
            Ir a Audit Workbench
          </Button>
        </Link>
      </div>

      {/* Workflow Visualization */}
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Flujo de Trabajo Multi-Agente
          </CardTitle>
          <CardDescription>Cada auditoría sigue este patrón de supervisión IA-to-IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2 py-4 flex-wrap">
            {workflowSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="text-center">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-2 border",
                    index === 0 ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" :
                    index === 1 ? "bg-blue-500/20 border-blue-500/30 text-blue-400" :
                    index === 2 ? "bg-red-500/20 border-red-500/30 text-red-400" :
                    "bg-purple-500/20 border-purple-500/30 text-purple-400"
                  )}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-2 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Auditoría (from backend) */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Templates de Auditoría</h2>
        {tiposLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Cargando templates...</span>
          </div>
        ) : !tiposAuditoria || tiposAuditoria.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay templates de auditoría disponibles
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tiposAuditoria.map((tipo) => (
              <Card key={tipo.id} className="glass-panel" data-testid={`tipo-auditoria-${tipo.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                      tipo.color === "blue" ? "bg-blue-500/20 text-blue-400" :
                      tipo.color === "red" ? "bg-red-500/20 text-red-400" :
                      tipo.color === "green" ? "bg-emerald-500/20 text-emerald-400" :
                      "bg-purple-500/20 text-purple-400"
                    )}>
                      {tipo.icono === "fileText" ? <FileText className="w-6 h-6" /> :
                       tipo.icono === "shield" ? <Shield className="w-6 h-6" /> :
                       tipo.icono === "search" ? <Search className="w-6 h-6" /> :
                       <CheckCircle className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold" data-testid={`text-tipo-nombre-${tipo.id}`}>{tipo.nombre}</h3>
                        <Badge variant="outline" className="text-[10px]">
                          <Clock className="w-3 h-3 mr-1" />
                          {tipo.duracionEstimada}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3" data-testid={`text-tipo-desc-${tipo.id}`}>
                        {tipo.descripcion}
                      </p>
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Normativa aplicable:</p>
                        <p className="text-xs font-medium" data-testid={`text-tipo-normativa-${tipo.id}`}>{tipo.normativaAplicable}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href="/audit-workbench">
                          <Button size="sm" data-testid={`button-iniciar-${tipo.id}`}>
                            <Play className="w-3 h-3 mr-1" />
                            Iniciar Auditoría
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Frameworks Normativos */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Marcos Normativos Integrados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {frameworks.map((fw) => {
            const Icon = fw.icon;
            return (
              <Card key={fw.id} className="glass-panel" data-testid={`framework-${fw.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                      fw.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      fw.color === 'green' ? 'bg-emerald-500/20 text-emerald-400' :
                      fw.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-orange-500/20 text-orange-400'
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base" data-testid={`text-framework-name-${fw.id}`}>{fw.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{fw.fullName}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3" data-testid={`text-framework-desc-${fw.id}`}>
                    {fw.description}
                  </p>
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">Componentes:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {fw.components.map((comp, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]" data-testid={`badge-component-${fw.id}-${i}`}>
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-2 rounded-md bg-secondary/50 border border-border">
                    <p className="text-[10px] text-muted-foreground">
                      Aplicado en: <span className="text-foreground font-medium">{fw.aplicacion}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
