import { useHerramientas, useToggleHerramienta } from "@/hooks/use-marketplace";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, AlertTriangle, BarChart, Shield, CheckCircle, Search, Database, FileText, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof AlertTriangle> = {
  alertTriangle: AlertTriangle,
  barChart: BarChart,
  shield: Shield,
  checkCircle: CheckCircle,
  search: Search,
  database: Database,
  fileText: FileText,
  searchCode: Search,
  lock: Lock,
};

export default function Marketplace() {
  const { data: herramientas, isLoading } = useHerramientas();
  const toggleMutation = useToggleHerramienta();

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
          <h1 className="text-2xl font-bold">Marketplace de Herramientas IA</h1>
          <p className="text-muted-foreground">Potencia tus auditorías con módulos especializados</p>
        </div>
        <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
          3 herramientas activas
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {herramientas?.map((tool) => {
          const Icon = iconMap[tool.icono] || AlertTriangle;
          return (
            <Card 
              key={tool.id} 
              className={cn(
                "glass-panel relative overflow-visible",
                tool.suscrito && "border-primary/50"
              )}
              data-testid={`herramienta-card-${tool.id}`}
            >
              {tool.suscrito && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Check className="w-3 h-3 mr-1" /> Activo
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                  tool.color === "orange" ? "bg-orange-500/20 text-orange-500" :
                  tool.color === "purple" ? "bg-purple-500/20 text-purple-500" :
                  tool.color === "red" ? "bg-red-500/20 text-red-500" :
                  tool.color === "green" ? "bg-green-500/20 text-green-500" :
                  tool.color === "blue" ? "bg-blue-500/20 text-blue-500" :
                  tool.color === "cyan" ? "bg-cyan-500/20 text-cyan-500" :
                  tool.color === "indigo" ? "bg-indigo-500/20 text-indigo-500" :
                  tool.color === "pink" ? "bg-pink-500/20 text-pink-500" :
                  "bg-gray-500/20 text-gray-500"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="w-fit text-xs text-muted-foreground">
                  {tool.categoria}
                </Badge>
                <CardTitle className="text-lg mt-2">{tool.nombre}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {tool.descripcion}
                </CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">${tool.precio}</span>
                  <span className="text-sm text-muted-foreground">/mes</span>
                </div>
              </CardContent>

              <CardFooter className="border-t border-border pt-4">
                <Button 
                  className="w-full" 
                  variant={tool.suscrito ? "outline" : "default"}
                  onClick={() => toggleMutation.mutate(tool.id)}
                  disabled={toggleMutation.isPending}
                  data-testid={`button-toggle-${tool.id}`}
                >
                  {toggleMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : tool.suscrito ? (
                    "Administrar"
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Suscribirse
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
