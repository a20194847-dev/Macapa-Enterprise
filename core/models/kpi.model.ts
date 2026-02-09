// core/models/kpi.model.ts

export type KpiCategoria =
  | "Compras"
  | "Proveedores"
  | "Finanzas"
  | "RRHH"
  | "Sostenibilidad"
  | "Legal"
  | "Operaciones";

export interface KPI {
  id: string;
  nombre: string;
  objetivo: string;
  categoria: KpiCategoria;
  riesgo: "Alto" | "Medio" | "Bajo";
  fuente: string;
  valor?: number | string;
  unidad?: string;
  meta?: string;
}
