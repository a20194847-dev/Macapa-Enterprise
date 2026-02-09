import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Play, FileVideo, BarChart3, PieChart, LineChart } from "lucide-react";

const templates = [
  { id: 1, name: "Resumen Ejecutivo", icon: BarChart3, color: "text-blue-500", duration: "2-3 min" },
  { id: 2, name: "Análisis de Tendencias", icon: LineChart, color: "text-green-500", duration: "3-5 min" },
  { id: 3, name: "Distribución de Riesgos", icon: PieChart, color: "text-purple-500", duration: "1-2 min" },
  { id: 4, name: "Hallazgos Clave", icon: FileVideo, color: "text-orange-500", duration: "2-4 min" },
];

export default function BIVideoStudio() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">BI Video Studio</h1>
            <Badge className="bg-purple-500/20 text-purple-400 border-0">PRO</Badge>
          </div>
          <p className="text-muted-foreground">Genera videos ejecutivos con análisis de datos automatizado</p>
        </div>
        <Button data-testid="button-nuevo-video">
          <Video className="w-4 h-4 mr-2" />
          Nuevo Video
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Plantillas de Video</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  data-testid={`template-${template.id}`}
                >
                  <template.icon className={`w-8 h-8 ${template.color} mb-3`} />
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{template.duration}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center border border-border">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Selecciona una plantilla para comenzar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Videos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay videos generados todavía</p>
            <p className="text-sm mt-1">Crea tu primer video ejecutivo seleccionando una plantilla</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
