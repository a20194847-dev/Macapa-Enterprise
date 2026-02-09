import { useState } from "react";
import { useProyectos } from "@/hooks/use-cases";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Plus, Loader2, X, Building2, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface ProyectoForm {
  nombre: string;
  cliente: string;
  tipo: string;
  descripcion: string;
  nivelRiesgo: string;
}

export default function Proyectos() {
  const { data: proyectos, isLoading } = useProyectos();
  const queryClient = useQueryClient();
  const [showNewProject, setShowNewProject] = useState(false);
  const [showPreview, setShowPreview] = useState<number | null>(null);
  const [form, setForm] = useState<ProyectoForm>({
    nombre: "",
    cliente: "",
    tipo: "Financiera",
    descripcion: "",
    nivelRiesgo: "Medio"
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProyectoForm) => {
      const res = await apiRequest("POST", "/api/proyectos", {
        ...data,
        estado: "En Progreso",
        probabilidadFraude: 0
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proyectos"] });
      setShowNewProject(false);
      setForm({ nombre: "", cliente: "", tipo: "Financiera", descripcion: "", nivelRiesgo: "Medio" });
    }
  });

  const previewProject = proyectos?.find(p => p.id === showPreview);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Proyectos de Auditoría</h1>
          <p className="text-muted-foreground">Gestiona tus proyectos y casos de auditoría activos</p>
        </div>
        <Button onClick={() => setShowNewProject(true)} data-testid="button-nuevo-proyecto">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Registro de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead>ID</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Riesgo</TableHead>
                <TableHead>Prob. Fraude</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proyectos?.map((p) => (
                <TableRow key={p.id} className="border-border/50" data-testid={`row-proyecto-${p.id}`}>
                  <TableCell className="font-mono text-muted-foreground">#{p.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.cliente}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{p.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.estado === 'Completado' ? 'secondary' : 'default'} className="text-xs">
                      {p.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-xs border-0",
                      p.nivelRiesgo === 'Crítico' ? "bg-red-500/20 text-red-400" :
                      p.nivelRiesgo === 'Alto' ? "bg-orange-500/20 text-orange-400" :
                      p.nivelRiesgo === 'Medio' ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-green-500/20 text-green-400"
                    )}>
                      {p.nivelRiesgo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full", (p.probabilidadFraude || 0) > 50 ? "bg-red-500" : "bg-blue-500")} 
                          style={{ width: `${p.probabilidadFraude || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{p.probabilidadFraude || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowPreview(p.id)}
                      data-testid={`button-ver-proyecto-${p.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(!proyectos || proyectos.length === 0) && (
            <p className="text-center text-muted-foreground py-8">No hay proyectos registrados</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Nuevo Proyecto de Auditoría
            </DialogTitle>
            <DialogDescription>
              Ingresa los datos del proyecto para iniciar la auditoría
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del Proyecto</Label>
              <Input
                id="nombre"
                placeholder="Ej: Auditoría Financiera 2024"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                data-testid="input-proyecto-nombre"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                placeholder="Ej: Serch SAC"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                data-testid="input-proyecto-cliente"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tipo de Auditoría</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger data-testid="select-proyecto-tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Financiera">Financiera</SelectItem>
                    <SelectItem value="Fraude">Fraude</SelectItem>
                    <SelectItem value="Due Diligence">Due Diligence</SelectItem>
                    <SelectItem value="Cumplimiento">Cumplimiento</SelectItem>
                    <SelectItem value="Operacional">Operacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Nivel de Riesgo Inicial</Label>
                <Select value={form.nivelRiesgo} onValueChange={(v) => setForm({ ...form, nivelRiesgo: v })}>
                  <SelectTrigger data-testid="select-proyecto-riesgo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bajo">Bajo</SelectItem>
                    <SelectItem value="Medio">Medio</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                    <SelectItem value="Crítico">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción del alcance y objetivos de la auditoría..."
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="min-h-[80px]"
                data-testid="input-proyecto-descripcion"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProject(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => createMutation.mutate(form)}
              disabled={!form.nombre || !form.cliente || createMutation.isPending}
              data-testid="button-crear-proyecto"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Crear Proyecto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Vista Previa del Proyecto
            </DialogTitle>
          </DialogHeader>
          {previewProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Proyecto</p>
                  <p className="font-semibold">{previewProject.nombre}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-semibold">{previewProject.cliente}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge variant="outline" className="mt-1">{previewProject.tipo}</Badge>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge className="mt-1">{previewProject.estado}</Badge>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Riesgo</p>
                  <Badge variant="outline" className={cn(
                    "mt-1 border-0",
                    previewProject.nivelRiesgo === 'Crítico' ? "bg-red-500/20 text-red-400" :
                    previewProject.nivelRiesgo === 'Alto' ? "bg-orange-500/20 text-orange-400" :
                    previewProject.nivelRiesgo === 'Medio' ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-green-500/20 text-green-400"
                  )}>
                    {previewProject.nivelRiesgo}
                  </Badge>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Probabilidad de Fraude</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all",
                        (previewProject.probabilidadFraude || 0) > 70 ? "bg-red-500" :
                        (previewProject.probabilidadFraude || 0) > 40 ? "bg-yellow-500" :
                        "bg-green-500"
                      )} 
                      style={{ width: `${previewProject.probabilidadFraude || 0}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{previewProject.probabilidadFraude || 0}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <p className="text-sm">Proyecto listo para auditoría. Ve a Audit Workbench para iniciar.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(null)}>
              Cerrar
            </Button>
            <Button onClick={() => setShowPreview(null)} data-testid="button-ir-audit">
              Ir a Audit Workbench
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
