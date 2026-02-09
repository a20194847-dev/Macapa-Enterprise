import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Zap, Shield, Users, HeadphonesIcon, FileText, Video } from "lucide-react";

const plans = [
  {
    id: 1,
    name: "Profesional",
    price: 199,
    description: "Para auditores individuales y equipos pequeños",
    features: [
      "5 proyectos activos",
      "Acceso a ALEX IA y Alex Flash",
      "Supervisión CONTRALOR básica",
      "10 GB Cloud Storage",
      "Soporte por email"
    ],
    current: true
  },
  {
    id: 2,
    name: "Enterprise",
    price: 499,
    description: "Para firmas de auditoría y departamentos corporativos",
    features: [
      "Proyectos ilimitados",
      "Equipo completo de agentes IA",
      "Supervisión CONTRALOR avanzada",
      "100 GB Cloud Storage",
      "API Access",
      "Soporte prioritario 24/7",
      "Capacitación personalizada"
    ],
    recommended: true
  },
  {
    id: 3,
    name: "Ultimate",
    price: 999,
    description: "Solución completa con servicios dedicados",
    features: [
      "Todo en Enterprise",
      "Agentes IA personalizados",
      "Almacenamiento ilimitado",
      "Integración con sistemas propios",
      "Gerente de cuenta dedicado",
      "SLA garantizado 99.9%",
      "Auditoría de seguridad anual"
    ]
  }
];

const addons = [
  { icon: Video, name: "BI Video Studio", price: 99, description: "Genera videos ejecutivos automatizados" },
  { icon: Shield, name: "Compliance Pack", price: 149, description: "Módulos SOX, COSO, ISA completos" },
  { icon: HeadphonesIcon, name: "Consultoría Experta", price: 299, description: "Horas con auditores certificados" },
];

export default function ServiciosPremium() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="w-8 h-8 text-yellow-500" />
          <h1 className="text-2xl font-bold">Servicios Premium</h1>
        </div>
        <p className="text-muted-foreground">Potencia tu práctica de auditoría con nuestros planes especializados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`glass-panel relative overflow-visible ${plan.recommended ? 'border-primary' : ''}`}
            data-testid={`plan-${plan.id}`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Recomendado</Badge>
              </div>
            )}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="secondary">Plan Actual</Badge>
              </div>
            )}
            
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full mt-6" 
                variant={plan.current ? "outline" : plan.recommended ? "default" : "secondary"}
                data-testid={`button-plan-${plan.id}`}
              >
                {plan.current ? "Plan Actual" : "Seleccionar Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-panel mt-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Complementos Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {addons.map((addon, i) => (
              <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <addon.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{addon.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{addon.description}</p>
                  <p className="text-sm font-bold mt-2">${addon.price}/mes</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
