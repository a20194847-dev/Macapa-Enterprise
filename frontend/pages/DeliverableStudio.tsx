import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, Download, Eye, BarChart3, PieChart as PieChartIcon, 
  TrendingUp, AlertTriangle, CheckCircle, FileSpreadsheet, Presentation,
  Loader2, Sparkles, File, Zap, Send, X, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts";
import { apiRequest } from "@/lib/queryClient";
import { useProyectos } from "@/hooks/use-cases";

const riskByAreaData = [
  { area: "Ingresos", riesgo: 75, color: "#f87171" },
  { area: "Gastos", riesgo: 45, color: "#fbbf24" },
  { area: "Activos", riesgo: 30, color: "#34d399" },
  { area: "Pasivos", riesgo: 60, color: "#f97316" },
  { area: "Patrimonio", riesgo: 25, color: "#22d3ee" },
];

const anomaliasTendenciaData = [
  { mes: "Ene", anomalias: 12, esperado: 15 },
  { mes: "Feb", anomalias: 8, esperado: 14 },
  { mes: "Mar", anomalias: 15, esperado: 13 },
  { mes: "Abr", anomalias: 22, esperado: 12 },
  { mes: "May", anomalias: 18, esperado: 11 },
  { mes: "Jun", anomalias: 25, esperado: 10 },
];

const distribucionHallazgosData = [
  { name: "Criticos", value: 3, color: "#ef4444" },
  { name: "Altos", value: 8, color: "#f97316" },
  { name: "Medios", value: 15, color: "#fbbf24" },
  { name: "Bajos", value: 24, color: "#22c55e" },
];

const benfordData = [
  { digito: "1", observado: 28.5, esperado: 30.1 },
  { digito: "2", observado: 18.2, esperado: 17.6 },
  { digito: "3", observado: 13.1, esperado: 12.5 },
  { digito: "4", observado: 10.8, esperado: 9.7 },
  { digito: "5", observado: 7.2, esperado: 7.9 },
  { digito: "6", observado: 6.5, esperado: 6.7 },
  { digito: "7", observado: 5.4, esperado: 5.8 },
  { digito: "8", observado: 5.1, esperado: 5.1 },
  { digito: "9", observado: 5.2, esperado: 4.6 },
];

const entregableTemplates = [
  { 
    id: 1, 
    nombre: "Informe de Auditoría",
    tipo: "PDF",
    descripcion: "Informe ejecutivo con hallazgos y recomendaciones",
    icono: FileText,
    color: "blue",
    preview: `INFORME DE AUDITORÍA FINANCIERA
Cliente: Serch SAC | Periodo: 2024

1. RESUMEN EJECUTIVO
Se identificaron 50 hallazgos, 3 de nivel crítico relacionados con control interno.

2. ALCANCE
Revisión de estados financieros, caja chica y registros de compras.

3. HALLAZGOS PRINCIPALES
- Discrepancias en conciliación bancaria
- Facturas sin respaldo documental
- Segregación de funciones inadecuada

4. RECOMENDACIONES
Implementar controles preventivos según COSO 2017.`
  },
  { 
    id: 2, 
    nombre: "Dashboard Ejecutivo",
    tipo: "Web",
    descripcion: "Visualización interactiva de métricas clave",
    icono: BarChart3,
    color: "purple",
    preview: `DASHBOARD EJECUTIVO - SERCH SAC

KPIs PRINCIPALES:
- Riesgo General: 42%
- Hallazgos Totales: 50
- Controles Efectivos: 85%
- Anomalías Detectadas: 4

DISTRIBUCIÓN POR SEVERIDAD:
Críticos: 3 | Altos: 8 | Medios: 15 | Bajos: 24

ÁREAS DE MAYOR RIESGO:
1. Ingresos (75%)
2. Pasivos (60%)
3. Gastos (45%)`
  },
  { 
    id: 3, 
    nombre: "Matriz de Riesgos",
    tipo: "Excel",
    descripcion: "Análisis detallado de riesgos por área",
    icono: FileSpreadsheet,
    color: "green",
    preview: `MATRIZ DE RIESGOS - SERCH SAC

| ÁREA       | RIESGO | PROBABILIDAD | IMPACTO | CONTROL |
|------------|--------|--------------|---------|---------|
| Ingresos   | Alto   | 75%          | Alto    | Débil   |
| Gastos     | Medio  | 45%          | Medio   | Medio   |
| Activos    | Bajo   | 30%          | Bajo    | Fuerte  |
| Pasivos    | Alto   | 60%          | Alto    | Débil   |
| Patrimonio | Bajo   | 25%          | Bajo    | Fuerte  |

ACCIONES RECOMENDADAS: Ver hoja "Plan de Mitigación"`
  },
  { 
    id: 4, 
    nombre: "Presentación Gerencial",
    tipo: "PowerPoint",
    descripcion: "Resumen para el comité de auditoría",
    icono: Presentation,
    color: "orange",
    preview: `PRESENTACIÓN COMITÉ DE AUDITORÍA
Serch SAC - Auditoría Financiera 2024

SLIDE 1: Resumen Ejecutivo
SLIDE 2: Metodología Aplicada (COSO, ISA 240)
SLIDE 3: Hallazgos Principales (3 Críticos)
SLIDE 4: Análisis Benford - Anomalías Detectadas
SLIDE 5: Mapa de Riesgos por Área
SLIDE 6: Recomendaciones Prioritarias
SLIDE 7: Plan de Acción y Cronograma
SLIDE 8: Próximos Pasos`
  },
  { 
    id: 5, 
    nombre: "Carta de Gerencia",
    tipo: "PDF",
    descripcion: "Comunicación formal de deficiencias",
    icono: File,
    color: "red",
    preview: `CARTA DE GERENCIA
Serch SAC | Fecha: Enero 2026

Estimado Gerente General:

De acuerdo con nuestra auditoría financiera del periodo 2024, comunicamos las siguientes deficiencias significativas identificadas:

1. DEFICIENCIAS EN CONTROL INTERNO
   - Falta de segregación de funciones en tesorería
   - Ausencia de revisión independiente de conciliaciones

2. OBSERVACIONES SOBRE REGISTROS
   - 15 facturas sin documentación soporte
   - Diferencias no conciliadas por S/. 45,000

3. RECOMENDACIONES
   Solicitamos respuesta formal en 30 días.

Atentamente,
ALEX IA - Auditor Forense Principal`
  },
];

interface ReportMessage {
  role: "user" | "assistant";
  content: string;
}

export default function DeliverableStudio() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showFlashChat, setShowFlashChat] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string>("");
  const [flashMessages, setFlashMessages] = useState<ReportMessage[]>([]);
  const [flashInput, setFlashInput] = useState("");
  const [selectedProyecto, setSelectedProyecto] = useState<string>("all");

  interface Auditoria {
    id: number;
    nombre: string;
    progreso: number | null;
    estado: string;
    proyectoId: number;
  }

  const { data: auditorias } = useQuery<Auditoria[]>({
    queryKey: ["/api/auditorias"],
  });

  const { data: proyectos } = useProyectos();

  const generateReportMutation = useMutation({
    mutationFn: async ({ reportType, customInstructions }: { reportType: string; customInstructions?: string }) => {
      const res = await apiRequest("POST", "/api/ai/report", {
        reportType,
        data: { cliente: "Serch SAC", auditoria: "Auditoría Financiera 2024" },
        customInstructions
      });
      return res.json();
    },
    onSuccess: (data) => {
      // Format the report for display
      const report = data.report;
      let formattedReport = `${report.title}\n${"=".repeat(50)}\n\n`;
      formattedReport += `${report.content}\n\n`;
      if (report.sections && Array.isArray(report.sections)) {
        report.sections.forEach((section: { title: string; content: string }) => {
          formattedReport += `\n## ${section.title}\n${"-".repeat(30)}\n${section.content}\n`;
        });
      }
      setGeneratedReport(formattedReport);
      setShowPreview(true);
    }
  });

  const flashChatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/ai/chat", {
        agentName: "Alex Flash",
        message,
        sessionId: "deliverable-studio",
        pageContext: "El usuario está en Deliverable Studio generando reportes ejecutivos. Alex Flash es el especialista en visualizaciones y reportes de alto impacto."
      });
      return res.json();
    },
    onSuccess: (data) => {
      setFlashMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    }
  });

  const handleGenerateReport = (templateId: number) => {
    const template = entregableTemplates.find(t => t.id === templateId);
    if (template) {
      generateReportMutation.mutate({ reportType: template.nombre });
    }
  };

  const handleFlashSend = () => {
    if (!flashInput.trim() || flashChatMutation.isPending) return;
    setFlashMessages(prev => [...prev, { role: "user", content: flashInput }]);
    flashChatMutation.mutate(flashInput);
    setFlashInput("");
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Deliverable Studio</h1>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              IA-Powered
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">Genera reportes ejecutivos, dashboards y entregables de alta calidad</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedProyecto} onValueChange={setSelectedProyecto}>
              <SelectTrigger className="w-[200px]" data-testid="select-proyecto-filter">
                <SelectValue placeholder="Filtrar por proyecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proyectos</SelectItem>
                {proyectos?.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" data-testid="button-preview">
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button data-testid="button-exportar">
            <Download className="w-4 h-4 mr-2" />
            Exportar Todo
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit">
          <TabsTrigger value="dashboard" data-testid="tab-dashboard">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="templates" data-testid="tab-templates">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="benford" data-testid="tab-benford">
            <TrendingUp className="w-4 h-4 mr-2" />
            Benford
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="flex-1 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk by Area Chart */}
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Riesgo por Área
                </CardTitle>
                <CardDescription>Nivel de riesgo identificado por área contable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskByAreaData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis dataKey="area" type="category" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar dataKey="riesgo" radius={[0, 4, 4, 0]}>
                        {riskByAreaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Anomalies Trend */}
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Tendencia de Anomalías
                </CardTitle>
                <CardDescription>Comparativa mensual vs umbral esperado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={anomaliasTendenciaData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mes" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="esperado" stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} name="Umbral Esperado" />
                      <Area type="monotone" dataKey="anomalias" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Anomalías Detectadas" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Findings Distribution */}
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-400" />
                  Distribución de Hallazgos
                </CardTitle>
                <CardDescription>Clasificación por severidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center">
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribucionHallazgosData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {distribucionHallazgosData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {distribucionHallazgosData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between gap-2" data-testid={`hallazgo-${item.name.toLowerCase()}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold" data-testid={`text-count-${item.name.toLowerCase()}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Resumen Ejecutivo
                </CardTitle>
                <CardDescription>Métricas clave de la auditoría</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-2xl font-bold text-blue-400" data-testid="text-hallazgos-totales">50</p>
                    <p className="text-sm text-muted-foreground">Hallazgos Totales</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-2xl font-bold text-red-400" data-testid="text-hallazgos-criticos">3</p>
                    <p className="text-sm text-muted-foreground">Hallazgos Críticos</p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-2xl font-bold text-amber-400" data-testid="text-riesgo-general">42%</p>
                    <p className="text-sm text-muted-foreground">Riesgo General</p>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <p className="text-2xl font-bold text-emerald-400" data-testid="text-controles-efectivos">85%</p>
                    <p className="text-sm text-muted-foreground">Controles Efectivos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="flex-1 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entregableTemplates.map((template) => {
              const Icon = template.icono;
              return (
                <Card 
                  key={template.id}
                  className={cn(
                    "glass-panel cursor-pointer transition-all",
                    selectedTemplate === template.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedTemplate(template.id)}
                  data-testid={`template-card-${template.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        template.color === "blue" ? "bg-blue-500/20 text-blue-400" :
                        template.color === "purple" ? "bg-purple-500/20 text-purple-400" :
                        template.color === "green" ? "bg-emerald-500/20 text-emerald-400" :
                        template.color === "orange" ? "bg-orange-500/20 text-orange-400" :
                        "bg-red-500/20 text-red-400"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{template.nombre}</h3>
                          <Badge variant="outline" className="text-[10px]">{template.tipo}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{template.descripcion}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1" 
                        data-testid={`button-preview-${template.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template.id);
                          setShowPreview(true);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1" 
                        data-testid={`button-generar-${template.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateReport(template.id);
                        }}
                        disabled={generateReportMutation.isPending}
                      >
                        {generateReportMutation.isPending ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 mr-1" />
                        )}
                        Generar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Alex Flash Chat Panel */}
          <Card className="mt-6 glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                Alex Flash - Asistente de Reportes
              </CardTitle>
              <CardDescription>Habla con Alex Flash para personalizar tus reportes y visualizaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/30 min-h-[150px] max-h-[300px] overflow-y-auto space-y-3 mb-3">
                {flashMessages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Pregunta a Alex Flash sobre reportes, visualizaciones o cómo presentar tus hallazgos de auditoría.
                  </p>
                )}
                {flashMessages.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      msg.role === "user" ? "bg-yellow-500 text-white" : "bg-muted"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {flashChatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Alex Flash está pensando...
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={flashInput}
                  onChange={(e) => setFlashInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleFlashSend())}
                  placeholder="Ej: Necesito un reporte ejecutivo para el comité de auditoría..."
                  className="resize-none min-h-[60px]"
                  data-testid="input-flash-message"
                />
                <Button 
                  onClick={handleFlashSend} 
                  disabled={!flashInput.trim() || flashChatMutation.isPending}
                  data-testid="button-flash-send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benford Tab */}
        <TabsContent value="benford" className="flex-1 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-panel lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Análisis de Ley de Benford
                </CardTitle>
                <CardDescription>Distribución del primer dígito vs distribución esperada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={benfordData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="digito" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="observado" name="Observado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="esperado" name="Esperado (Benford)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resultado del Análisis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30" data-testid="benford-conformidad">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400" data-testid="text-benford-status">Conformidad Alta</span>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid="text-benford-descripcion">
                    La distribución observada se ajusta a la Ley de Benford con un 94.7% de conformidad.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Chi-Cuadrado</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valor calculado</span>
                    <span className="font-mono text-sm" data-testid="text-chi-calculado">8.42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valor crítico (p=0.05)</span>
                    <span className="font-mono text-sm" data-testid="text-chi-critico">15.51</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Interpretación</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-benford-interpretacion">
                    No se detectan indicios de manipulación en los datos analizados. 
                    Las desviaciones observadas están dentro del rango esperado.
                  </p>
                </div>

                <Button className="w-full" data-testid="button-exportar-benford">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Análisis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedTemplate ? entregableTemplates.find(t => t.id === selectedTemplate)?.nombre : "Vista Previa del Reporte"}
            </DialogTitle>
            <DialogDescription>
              {generatedReport ? "Reporte generado por Alex Flash" : "Vista previa del template seleccionado"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {generatedReport ? (
              <div className="prose prose-sm dark:prose-invert max-w-none" data-testid="report-content">
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                  {generatedReport}
                </pre>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedTemplate && (
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                    <pre className="whitespace-pre-wrap">
                      {entregableTemplates.find(t => t.id === selectedTemplate)?.preview || "Vista previa no disponible"}
                    </pre>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Haz clic en "Generar" para crear un reporte personalizado con Alex Flash.
                </p>
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <X className="w-4 h-4 mr-2" />
              Cerrar
            </Button>
            <Button onClick={() => {
              const blob = new Blob([generatedReport || "Template de reporte"], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "reporte-auditoria.txt";
              a.click();
            }} data-testid="button-download-report">
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
