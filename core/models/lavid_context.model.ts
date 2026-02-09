// core/models/lavid_context.model.ts

export type LavidScope =
  | "KPI"
  | "Workflow"
  | "Proceso"
  | "Proveedor"
  | "Empleado"
  | "Finanzas"
  | "Sostenibilidad"
  | "Estrategia";

export interface LavidDataPoint {
  name: string;
  value: number | string | boolean;
  unit?: string;
  meta?: Record<string, any>;
}

export interface LavidContext {
  scope: LavidScope;
  empresa: {
    nombre: string;
    sector?: string;
    pais?: string;
    tamano?: "Startup" | "PYME" | "Corporativo" | "Fortune500";
  };
  ecosistema?: {
    cluster?: string;
    grupoEconomico?: string;
    cooperativa?: string;
  };
  kpis?: LavidDataPoint[];
  riesgos?: string[];
  procesos?: string[];
  notas?: string;
}
