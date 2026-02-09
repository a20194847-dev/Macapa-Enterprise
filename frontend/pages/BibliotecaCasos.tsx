import { useCasos } from "@/hooks/use-cases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Eye, Loader2, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BibliotecaCasos() {
  const { data: casos, isLoading } = useCasos();

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
          <h1 className="text-2xl font-bold">Biblioteca de Casos</h1>
          <p className="text-muted-foreground">Archivo histórico de auditorías e investigaciones</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 w-64" placeholder="Buscar casos..." data-testid="input-buscar-casos" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {casos?.map((caso) => {
          const etiquetas = JSON.parse(caso.etiquetas || "[]") as string[];
          const hallazgos = JSON.parse(caso.hallazgos || "[]") as string[];
          
          return (
            <Card key={caso.id} className="glass-panel" data-testid={`caso-card-${caso.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{caso.nombre}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{caso.tipo}</p>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[10px] border-0 flex-shrink-0",
                    caso.nivelRiesgo === 'Crítico' ? "bg-red-500/20 text-red-400" :
                    caso.nivelRiesgo === 'Alto' ? "bg-orange-500/20 text-orange-400" :
                    caso.nivelRiesgo === 'Medio' ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-green-500/20 text-green-400"
                  )}>
                    {caso.nivelRiesgo}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(caso.fecha).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{caso.anomalias} anomalías</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Hallazgos principales:</p>
                  <ul className="text-xs space-y-1">
                    {hallazgos.slice(0, 2).map((h, i) => (
                      <li key={i} className="text-foreground/80 truncate">• {h}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1">
                  {etiquetas.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>

                <Button variant="outline" className="w-full" size="sm" data-testid={`button-ver-caso-${caso.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(!casos || casos.length === 0) && (
        <Card className="glass-panel">
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No hay casos en la biblioteca</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
