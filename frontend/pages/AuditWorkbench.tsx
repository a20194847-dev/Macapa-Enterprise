import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Play, CheckCircle, Clock, Upload, FileText, 
  Brain, Zap, Shield, Search, Target, ChevronDown, ChevronRight,
  Loader2, Eye, Link2, Cloud, File, Trash2, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface Fase {
  id: number;
  auditoriaId: number;
  numero: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
  agenteAsignado: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  entregablesRequeridos: string | null;
  completado: boolean | null;
}

interface Auditoria {
  id: number;
  proyectoId: number;
  tipoAuditoriaId: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
  faseActual: number | null;
  progreso: number | null;
  agenteResponsable: string | null;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  faseId: number;
}

interface CloudLink {
  url: string;
  provider: "onedrive" | "gdrive" | "dropbox";
  faseId: number;
}

const agentIcons: Record<string, typeof Brain> = {
  "ALEX IA": Brain,
  "Alex Flash": Zap,
  "CONTRALOR": Shield,
  "Agent Alpha": Search,
  "Agent Omega": Target,
};

const agentColors: Record<string, string> = {
  "ALEX IA": "blue",
  "Alex Flash": "yellow",
  "CONTRALOR": "red",
  "Agent Alpha": "cyan",
  "Agent Omega": "purple",
};

const estadoConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  completada: { label: "Completada", color: "text-emerald-400 bg-emerald-500/20", icon: CheckCircle },
  en_progreso: { label: "En Progreso", color: "text-blue-400 bg-blue-500/20", icon: Play },
  pendiente: { label: "Pendiente", color: "text-muted-foreground bg-secondary", icon: Clock },
};

const cloudProviders = [
  { id: "onedrive", name: "OneDrive", icon: Cloud, color: "text-blue-500" },
  { id: "gdrive", name: "Google Drive", icon: Cloud, color: "text-green-500" },
  { id: "dropbox", name: "Dropbox", icon: Cloud, color: "text-blue-400" },
];

export default function AuditWorkbench() {
  const queryClient = useQueryClient();
  const [expandedAuditorias, setExpandedAuditorias] = useState<Record<number, boolean>>({ 1: true });
  const [activeTab, setActiveTab] = useState("fases");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [cloudLinks, setCloudLinks] = useState<CloudLink[]>([]);
  const [newCloudLink, setNewCloudLink] = useState<{ url: string; provider: string; faseId: number | null }>({ url: "", provider: "gdrive", faseId: null });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadFase, setActiveUploadFase] = useState<number | null>(null);

  const { data: auditorias } = useQuery<Auditoria[]>({
    queryKey: ["/api/auditorias"],
  });

  const { data: allFases } = useQuery<Fase[]>({
    queryKey: ["/api/fases"],
  });

  const avanzarFaseMutation = useMutation({
    mutationFn: async (faseId: number) => {
      const res = await apiRequest("PATCH", `/api/fases/${faseId}`, { 
        estado: "completada", 
        completado: true,
        fechaFin: new Date().toISOString()
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auditorias"] });
      queryClient.invalidateQueries({ queryKey: ["/api/logs"] });
    }
  });

  const toggleAuditoria = (id: number) => {
    setExpandedAuditorias(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, faseId: number) => {
    const files = e.target.files;
    if (!files) return;
    
    const maxSize = 50 * 1024 * 1024; // 50MB
    const currentCount = uploadedFiles.filter(f => f.faseId === faseId).length;
    
    Array.from(files).forEach((file, i) => {
      if (currentCount + i >= 100) return;
      if (file.size > maxSize) {
        alert(`${file.name} excede el límite de 50MB`);
        return;
      }
      setUploadedFiles(prev => [...prev, {
        name: file.name,
        size: file.size,
        type: file.type,
        faseId
      }]);
    });
  };

  const removeFile = (fileName: string, faseId: number) => {
    setUploadedFiles(prev => prev.filter(f => !(f.name === fileName && f.faseId === faseId)));
  };

  const addCloudLink = () => {
    if (!newCloudLink.url || newCloudLink.faseId === null) return;
    const faseIdNum = newCloudLink.faseId;
    setCloudLinks(prev => [...prev, {
      url: newCloudLink.url,
      provider: newCloudLink.provider as "onedrive" | "gdrive" | "dropbox",
      faseId: faseIdNum
    }]);
    setNewCloudLink({ url: "", provider: "gdrive", faseId: null });
  };

  const removeCloudLink = (url: string) => {
    setCloudLinks(prev => prev.filter(l => l.url !== url));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Audit Workbench</h1>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">NUEVO</Badge>
          </div>
          <p className="text-muted-foreground mt-1">Centro de control para flujos de auditoría con IA supervisada</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit">
          <TabsTrigger value="fases" data-testid="tab-fases">Timeline de Fases</TabsTrigger>
          <TabsTrigger value="evidencias" data-testid="tab-evidencias">Evidencias</TabsTrigger>
          <TabsTrigger value="entregables" data-testid="tab-entregables">Entregables</TabsTrigger>
        </TabsList>

        <TabsContent value="fases" className="flex-1 mt-4 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
              {auditorias?.map((auditoria) => {
                const isExpanded = expandedAuditorias[auditoria.id];
                const fases = allFases?.filter(f => f.auditoriaId === auditoria.id) || allFases || [];
                
                return (
                  <Collapsible key={auditoria.id} open={isExpanded} onOpenChange={() => toggleAuditoria(auditoria.id)}>
                    <Card className="glass-panel">
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{auditoria.nombre}</CardTitle>
                                <CardDescription>{auditoria.descripcion}</CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Progreso</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={auditoria.progreso || 0} className="w-24 h-2" />
                                  <span className="font-bold text-primary">{auditoria.progreso}%</span>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {auditoria.agenteResponsable}
                              </Badge>
                              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="relative pl-6 border-l-2 border-border ml-4 space-y-6">
                            {fases.map((fase) => {
                              const Icon = agentIcons[fase.agenteAsignado] || Brain;
                              const color = agentColors[fase.agenteAsignado] || "blue";
                              const estadoCfg = estadoConfig[fase.estado] || estadoConfig.pendiente;
                              const EstadoIcon = estadoCfg.icon;
                              const entregables = fase.entregablesRequeridos ? JSON.parse(fase.entregablesRequeridos) as string[] : [];
                              const faseFiles = uploadedFiles.filter(f => f.faseId === fase.id);
                              const faseLinks = cloudLinks.filter(l => l.faseId === fase.id);

                              return (
                                <div key={fase.id} className="relative" data-testid={`fase-${fase.id}`}>
                                  <div className={cn(
                                    "absolute -left-[25px] w-4 h-4 rounded-full border-2",
                                    fase.completado 
                                      ? "bg-emerald-500 border-emerald-500" 
                                      : fase.estado === "en_progreso"
                                        ? "bg-primary border-primary"
                                        : "bg-background border-border"
                                  )} />

                                  <div className={cn(
                                    "p-4 rounded-lg border transition-all ml-4",
                                    fase.estado === "en_progreso" && "border-primary/50 bg-primary/5"
                                  )}>
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-3">
                                        <div className={cn(
                                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                          color === "blue" ? "bg-blue-500/20 text-blue-400" :
                                          color === "yellow" ? "bg-yellow-500/20 text-yellow-400" :
                                          color === "red" ? "bg-red-500/20 text-red-400" :
                                          color === "cyan" ? "bg-cyan-500/20 text-cyan-400" :
                                          "bg-purple-500/20 text-purple-400"
                                        )}>
                                          <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="text-xs text-muted-foreground">Fase {fase.numero}</span>
                                            <Badge variant="outline" className={cn("text-[10px]", estadoCfg.color)}>
                                              <EstadoIcon className="w-3 h-3 mr-1" />
                                              {estadoCfg.label}
                                            </Badge>
                                            <Badge variant="secondary" className="text-[10px]">{fase.agenteAsignado}</Badge>
                                          </div>
                                          <h3 className="font-semibold">{fase.nombre}</h3>
                                          <p className="text-sm text-muted-foreground mt-1">{fase.descripcion}</p>
                                          
                                          {entregables.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-border">
                                              <p className="text-xs text-muted-foreground mb-2">Entregables:</p>
                                              <div className="flex flex-wrap gap-1">
                                                {entregables.map((e, i) => (
                                                  <Badge key={i} variant="outline" className="text-[10px]">{e}</Badge>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {(faseFiles.length > 0 || faseLinks.length > 0) && (
                                            <div className="mt-3 pt-3 border-t border-border">
                                              <p className="text-xs text-muted-foreground mb-2">Archivos cargados ({faseFiles.length}):</p>
                                              <div className="space-y-1">
                                                {faseFiles.map((f, i) => (
                                                  <div key={i} className="flex items-center gap-2 text-xs bg-muted/50 rounded px-2 py-1">
                                                    <File className="w-3 h-3" />
                                                    <span className="flex-1 truncate">{f.name}</span>
                                                    <span className="text-muted-foreground">{formatFileSize(f.size)}</span>
                                                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => removeFile(f.name, fase.id)}>
                                                      <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                  </div>
                                                ))}
                                                {faseLinks.map((l, i) => (
                                                  <div key={i} className="flex items-center gap-2 text-xs bg-muted/50 rounded px-2 py-1">
                                                    <Link2 className="w-3 h-3" />
                                                    <span className="flex-1 truncate">{l.url}</span>
                                                    <Badge variant="outline" className="text-[9px]">{l.provider}</Badge>
                                                    <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => removeCloudLink(l.url)}>
                                                      <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="flex flex-col gap-2">
                                        {(fase.estado === "en_progreso" || fase.estado === "pendiente") && (
                                          <>
                                            <input
                                              type="file"
                                              ref={fileInputRef}
                                              className="hidden"
                                              multiple
                                              onChange={(e) => handleFileUpload(e, fase.id)}
                                              data-testid={`input-file-${fase.id}`}
                                            />
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => {
                                                setActiveUploadFase(fase.id);
                                                fileInputRef.current?.click();
                                              }}
                                              data-testid={`button-upload-${fase.id}`}
                                            >
                                              <Upload className="w-3 h-3 mr-1" />
                                              Subir
                                            </Button>
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => setNewCloudLink({ ...newCloudLink, faseId: fase.id })}
                                              data-testid={`button-cloud-${fase.id}`}
                                            >
                                              <Cloud className="w-3 h-3 mr-1" />
                                              Cloud
                                            </Button>
                                          </>
                                        )}
                                        {fase.estado === "en_progreso" && (
                                          <Button 
                                            size="sm"
                                            onClick={() => avanzarFaseMutation.mutate(fase.id)}
                                            disabled={avanzarFaseMutation.isPending}
                                            data-testid={`button-completar-${fase.id}`}
                                          >
                                            {avanzarFaseMutation.isPending ? (
                                              <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                              <>
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Completar
                                              </>
                                            )}
                                          </Button>
                                        )}
                                        {fase.completado && (
                                          <Button size="sm" variant="ghost" data-testid={`button-ver-${fase.id}`}>
                                            <Eye className="w-3 h-3 mr-1" />
                                            Ver
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="evidencias" className="flex-1 mt-4">
          <Card className="glass-panel h-full">
            <CardHeader>
              <CardTitle className="text-sm">Carga de Evidencias</CardTitle>
              <CardDescription>Sube archivos (max 50MB, 100 archivos) o conecta enlaces de la nube</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed rounded-lg text-center">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Subir Archivos</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Arrastra archivos aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Max 50MB por archivo, hasta 100 archivos
                    </p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      id="evidence-upload"
                      onChange={(e) => handleFileUpload(e, 1)}
                    />
                    <Button asChild>
                      <label htmlFor="evidence-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Seleccionar Archivos
                      </label>
                    </Button>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Archivos cargados ({uploadedFiles.length}/100)</p>
                      {uploadedFiles.slice(0, 5).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
                          <File className="w-4 h-4" />
                          <span className="flex-1 truncate">{f.name}</span>
                          <span className="text-muted-foreground">{formatFileSize(f.size)}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeFile(f.name, f.faseId)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      {uploadedFiles.length > 5 && (
                        <p className="text-xs text-muted-foreground">...y {uploadedFiles.length - 5} más</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-6 border rounded-lg">
                    <Cloud className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2 text-center">Conectar Cloud</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Conecta archivos desde OneDrive, Google Drive o Dropbox
                    </p>
                    <div className="space-y-3">
                      <div className="grid gap-2">
                        <Label>URL del archivo o carpeta</Label>
                        <Input 
                          placeholder="https://drive.google.com/..."
                          value={newCloudLink.url}
                          onChange={(e) => setNewCloudLink({ ...newCloudLink, url: e.target.value })}
                          data-testid="input-cloud-url"
                        />
                      </div>
                      <div className="flex gap-2">
                        {cloudProviders.map(p => (
                          <Button
                            key={p.id}
                            variant={newCloudLink.provider === p.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewCloudLink({ ...newCloudLink, provider: p.id })}
                            className="flex-1"
                          >
                            <p.icon className={cn("w-4 h-4 mr-1", p.color)} />
                            {p.name}
                          </Button>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          if (newCloudLink.url) {
                            setCloudLinks(prev => [...prev, {
                              url: newCloudLink.url,
                              provider: newCloudLink.provider as any,
                              faseId: 1
                            }]);
                            setNewCloudLink({ url: "", provider: "gdrive", faseId: null });
                          }
                        }}
                        disabled={!newCloudLink.url}
                        data-testid="button-add-cloud"
                      >
                        <Link2 className="w-4 h-4 mr-2" />
                        Agregar Enlace
                      </Button>
                    </div>
                  </div>

                  {cloudLinks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Enlaces conectados ({cloudLinks.length})</p>
                      {cloudLinks.map((l, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg px-3 py-2">
                          <Link2 className="w-4 h-4" />
                          <span className="flex-1 truncate">{l.url}</span>
                          <Badge variant="outline" className="text-xs">{l.provider}</Badge>
                          <Button size="icon" variant="ghost" className="h-6 w-6" asChild>
                            <a href={l.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeCloudLink(l.url)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entregables" className="flex-1 mt-4">
          <Card className="glass-panel h-full">
            <CardHeader>
              <CardTitle className="text-sm">Entregables de la Auditoría</CardTitle>
              <CardDescription>Reportes, dashboards y documentos generados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Generación de Entregables</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Los entregables se generan automáticamente al completar cada fase. Ve a Deliverable Studio para crear reportes personalizados.
                </p>
                <Button className="mt-4" variant="outline" data-testid="button-ver-entregables">
                  <Eye className="w-4 h-4 mr-2" />
                  Ir a Deliverable Studio
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
