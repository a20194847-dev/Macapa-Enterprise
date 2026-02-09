import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, FolderKanban, Zap, Video, Users, Cloud, 
  BookOpen, Store, FileText, Crown, Settings, DollarSign, LogOut,
  Sparkles, ChevronRight, BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/proyectos", label: "Proyectos", icon: FolderKanban },
  { path: "/audit-workbench", label: "Audit Workbench", icon: Sparkles, badge: "NUEVO", badgeColor: "emerald" },
  { path: "/deliverable-studio", label: "Deliverable Studio", icon: BarChart3, badge: "PRO", badgeColor: "purple" },
  { path: "/alex-ia-flash", label: "ALEX IA Flash", icon: Zap, badge: "IA", badgeColor: "blue" },
  { path: "/bi-video-studio", label: "BI Video Studio", icon: Video, badge: "PRO", badgeColor: "purple" },
  { path: "/centro-agentes", label: "Centro de Agentes", icon: Users, badge: "IA", badgeColor: "blue" },
  { path: "/cloud-storage", label: "Cloud Storage", icon: Cloud },
  { path: "/biblioteca-casos", label: "Biblioteca de Casos", icon: BookOpen },
  { path: "/marketplace", label: "Marketplace", icon: Store },
  { path: "/metodologia", label: "Metodología", icon: FileText },
  { path: "/servicios-premium", label: "Servicios Premium", icon: Crown, badge: "PRO", badgeColor: "purple" },
];

const getBadgeClasses = (color?: string) => {
  switch (color) {
    case "emerald":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "purple":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "blue":
    default:
      return "bg-primary/20 text-primary border-primary/30";
  }
};

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-border flex flex-col z-50">
      {/* Logo Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground tracking-tight">MACAPA</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Enterprise Audit Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  data-testid={`link-nav-${item.path.replace(/\//g, '') || 'dashboard'}`}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-4 h-4 transition-colors", isActive && "text-primary")} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[9px] px-1.5 py-0 h-4 font-semibold border",
                        getBadgeClasses(item.badgeColor)
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3 text-primary/60" />}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-border/50">
          <Link href="/configuracion">
            <div
              data-testid="link-nav-configuracion"
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                location === "/configuracion"
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* AI Cost Tracker */}
      <div className="p-3 border-t border-border/50">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Costo IA Este Mes</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">$0.00</p>
          <p className="text-[10px] text-emerald-400/70 mt-1">Supervisión local activa</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center ring-2 ring-primary/20">
              <span className="text-xs font-bold text-primary">AU</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-sidebar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Auditor Usuario</p>
            <p className="text-[10px] text-muted-foreground">Profesional Verificado</p>
          </div>
          <button 
            data-testid="button-logout" 
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
