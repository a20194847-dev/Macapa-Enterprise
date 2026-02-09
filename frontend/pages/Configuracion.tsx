import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Link2, Bell, Shield, Save } from "lucide-react";

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("perfil");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Administra tu cuenta y preferencias del sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="perfil" className="flex items-center gap-2" data-testid="tab-perfil">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="integraciones" className="flex items-center gap-2" data-testid="tab-integraciones">
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline">Integraciones</span>
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2" data-testid="tab-notificaciones">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2" data-testid="tab-seguridad">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Seguridad</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Información Personal</CardTitle>
              <CardDescription>Actualiza tu información de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">AU</span>
                </div>
                <Button variant="outline" size="sm">Cambiar Foto</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input defaultValue="Auditor Usuario" data-testid="input-nombre" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="auditor@macapa.com" data-testid="input-email" />
                </div>
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Input defaultValue="Auditor Senior" data-testid="input-rol" />
                </div>
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Input defaultValue="MACAPA Enterprise" data-testid="input-empresa" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integraciones" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Integraciones Conectadas</CardTitle>
              <CardDescription>Conecta herramientas externas para potenciar tus auditorías</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Google Drive", connected: true, description: "Sincroniza documentos automáticamente" },
                { name: "Microsoft 365", connected: false, description: "Accede a Excel y SharePoint" },
                { name: "Slack", connected: true, description: "Recibe notificaciones en tu equipo" },
                { name: "SAP", connected: false, description: "Extrae datos contables directamente" },
              ].map((integration, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                  <Button variant={integration.connected ? "outline" : "default"} size="sm">
                    {integration.connected ? "Desconectar" : "Conectar"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Preferencias de Notificación</CardTitle>
              <CardDescription>Configura cómo y cuándo recibir alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Riesgo Crítico</Label>
                  <p className="text-sm text-muted-foreground">Notificación inmediata para hallazgos de alto riesgo</p>
                </div>
                <Switch defaultChecked data-testid="switch-riesgo-critico" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Detección de Sesgo IA</Label>
                  <p className="text-sm text-muted-foreground">Alerta cuando CONTRALOR detecta sesgos algorítmicos</p>
                </div>
                <Switch defaultChecked data-testid="switch-sesgo-ia" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Resumen Diario</Label>
                  <p className="text-sm text-muted-foreground">Recibe un resumen de actividad cada mañana</p>
                </div>
                <Switch data-testid="switch-resumen-diario" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">Enviar copias de alertas a tu correo</p>
                </div>
                <Switch defaultChecked data-testid="switch-email" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-lg">Protocolos de Seguridad</CardTitle>
              <CardDescription>Gestiona el acceso y las medidas de protección</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticación de Dos Factores (2FA)</Label>
                  <p className="text-sm text-muted-foreground">Requiere 2FA para acciones administrativas</p>
                </div>
                <Switch defaultChecked data-testid="switch-2fa" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Logs de Auditoría Inmutables</Label>
                  <p className="text-sm text-muted-foreground">Almacenar logs en ledger blockchain</p>
                </div>
                <Switch defaultChecked data-testid="switch-logs-inmutables" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sesión Automática</Label>
                  <p className="text-sm text-muted-foreground">Cerrar sesión después de 30 minutos de inactividad</p>
                </div>
                <Switch defaultChecked data-testid="switch-sesion-auto" />
              </div>
              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="mr-2">Cambiar Contraseña</Button>
                <Button variant="destructive">Cerrar Todas las Sesiones</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancelar</Button>
        <Button data-testid="button-guardar-config">
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
