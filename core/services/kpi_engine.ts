// core/services/kpi_engine.ts

import { KPI } from "../models/kpi.model";

export interface KpiInsight {
  kpi: string;
  estado: "Normal" | "Alerta" | "Crítico";
  descripcion: string;
  recomendacion: string;
}

export class KpiEngine {
  static analizar(kpis: KPI[]): KpiInsight[] {
    const insights: KpiInsight[] = [];

    for (const k of kpis) {
      // Ejemplo: Pagos duplicados
      if (k.nombre.toLowerCase() === "pagos duplicados" && Number(k.valor) > 0) {
        insights.push({
          kpi: k.nombre,
          estado: Number(k.valor) > 5 ? "Crítico" : "Alerta",
          descripcion: `Se detectaron ${k.valor} posibles pagos duplicados.`,
          recomendacion:
            "Revisar matriz de roles, activar validación automática previa al pago y configurar alertas para montos altos.",
        });
      }

      // Ejemplo: Proveedores con deuda coactiva
      if (k.nombre.toLowerCase() === "deuda coactiva" && Number(k.valor) > 0) {
        insights.push({
          kpi: k.nombre,
          estado: "Alerta",
          descripcion: `Existen ${k.valor} proveedores con deuda coactiva.`,
          recomendacion:
            "Evaluar riesgo reputacional, bloquear temporalmente y solicitar regularización fiscal.",
        });
      }

      // Ejemplo: Proveedores exclusivos
      if (k.nombre.toLowerCase() === "proveedores exclusivos" && Number(k.valor) > 0) {
        insights.push({
          kpi: k.nombre,
          estado: "Alerta",
          descripcion: `Dependencia detectada: ${k.valor} SKUs con proveedor único.`,
          recomendacion:
            "Buscar proveedores alternativos, renegociar contratos y establecer acuerdos de continuidad.",
        });
      }

      // Ejemplo: Procesos sostenibles
      if (k.categoria === "Sostenibilidad") {
        insights.push({
          kpi: k.nombre,
          estado: "Normal",
          descripcion: "Indicador de sostenibilidad registrado.",
          recomendacion:
            "Integrar este KPI en el tablero de impacto ambiental y medir reducción de huella operativa.",
        });
      }
    }

    return insights;
  }
}
