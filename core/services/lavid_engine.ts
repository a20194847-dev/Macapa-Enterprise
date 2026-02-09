// core/services/lavid_engine.ts

import { LavidContext, LavidDataPoint } from "../models/lavid_context.model";

export interface LavidRecommendation {
  titulo: string;
  descripcion: string;
  tipo: "Eficiencia" | "Riesgo" | "Sostenibilidad" | "Crecimiento" | "Compliance" | "Humano";
  horizonte: "Corto" | "Medio" | "Largo";
  pasos: string[];
  impactoEsperado: string;
}

export class LavidEngine {
  static analizar(contexto: LavidContext): LavidRecommendation[] {
    const recomendaciones: LavidRecommendation[] = [];

    // 1. Patrón: pagos duplicados / errores financieros
    const pagosDuplicados = this.buscarKPI(contexto.kpis, "Pagos duplicados");
    if (pagosDuplicados) {
      recomendaciones.push({
        titulo: "Reducir riesgo de pagos duplicados",
        tipo: "Riesgo",
        horizonte: "Corto",
        descripcion:
          "Se detectan señales de pagos duplicados. Esto indica debilidades en controles previos al pago y en segregación de funciones.",
        pasos: [
          "Implementar validación automática de pagos contra facturas antes de ejecutar transferencias.",
          "Revisar matriz de roles en SAP para separar funciones de registro, aprobación y pago.",
          "Configurar alertas para montos altos o proveedores críticos.",
        ],
        impactoEsperado:
          "Reducción de pérdidas financieras, mejora de control interno y fortalecimiento de confianza con stakeholders.",
      });
    }

    // 2. Patrón: proveedores con deuda coactiva / observados
    const deudaCoactiva = this.buscarKPI(contexto.kpis, "Deuda coactiva");
    const provObservados = this.buscarKPI(contexto.kpis, "Proveedores observados por SUNAT");
    if (deudaCoactiva || provObservados) {
      recomendaciones.push({
        titulo: "Fortalecer política de selección de proveedores",
        tipo: "Compliance",
        horizonte: "Medio",
        descripcion:
          "Se identifican proveedores con señales de riesgo fiscal o reputacional. Esto puede afectar la sostenibilidad del ecosistema y la imagen de la empresa.",
        pasos: [
          "Definir criterios mínimos de elegibilidad (sin deuda coactiva, sin sanciones graves).",
          "Integrar consultas automáticas a SUNAT u organismos equivalentes antes de aprobar nuevos proveedores.",
          "Clasificar proveedores por nivel de riesgo y ajustar condiciones comerciales según el perfil.",
        ],
        impactoEsperado:
          "Reducción de riesgo reputacional, mejora de cumplimiento y fortalecimiento de la cadena de valor.",
      });
    }

    // 3. Patrón: uso excesivo de procesos manuales (papel)
    const procesos = contexto.procesos || [];
    const hayProcesosManuales = procesos.some((p) =>
      p.toLowerCase().includes("manual") || p.toLowerCase().includes("papel"),
    );
    if (hayProcesosManuales) {
      recomendaciones.push({
        titulo: "Digitalizar procesos intensivos en papel",
        tipo: "Sostenibilidad",
        horizonte: "Medio",
        descripcion:
          "Se identifican procesos manuales con uso intensivo de papel. Cada documento físico es consumo de recursos y fricción operativa.",
        pasos: [
          "Priorizar procesos con mayor volumen de documentos para digitalización.",
          "Implementar firma electrónica y archivo digital seguro.",
          "Medir reducción de uso de papel y tiempos de ciclo antes y después.",
        ],
        impactoEsperado:
          "Menor huella ambiental, reducción de costos operativos y mayor trazabilidad.",
      });
    }

    // 4. Patrón: concentración de proveedores / exclusividad
    const proveedoresExclusivos = this.buscarKPI(contexto.kpis, "Proveedores exclusivos");
    if (proveedoresExclusivos) {
      recomendaciones.push({
        titulo: "Gestionar concentración de proveedores",
        tipo: "Estrategia",
        horizonte: "Largo",
        descripcion:
          "La dependencia de pocos proveedores exclusivos aumenta el riesgo de interrupción y reduce poder de negociación.",
        pasos: [
          "Identificar SKUs críticos con un solo proveedor.",
          "Explorar proveedores alternativos en el mercado local e internacional.",
          "Negociar acuerdos de continuidad y planes de contingencia.",
        ],
        impactoEsperado:
          "Mayor resiliencia de la cadena de suministro y mejor posición estratégica ante cambios del entorno.",
      });
    }

    // 5. Patrón genérico: contexto humano / ecosistema
    if (contexto.ecosistema?.cluster || contexto.ecosistema?.cooperativa) {
      recomendaciones.push({
        titulo: "Desarrollar el ecosistema donde opera la empresa",
        tipo: "Humano",
        horizonte: "Largo",
        descripcion:
          "La empresa no opera aislada: forma parte de un ecosistema de proveedores, empleados, comunidades y aliados.",
        pasos: [
          "Identificar actores clave del ecosistema (cooperativas, clusters, asociaciones).",
          "Diseñar iniciativas de desarrollo conjunto (capacitaciones, estándares, proyectos compartidos).",
          "Medir impacto social y económico de las iniciativas en el tiempo.",
        ],
        impactoEsperado:
          "Relaciones más sólidas, mayor legitimidad social y creación de valor compartido.",
      });
    }

    return recomendaciones;
  }

  private static buscarKPI(kpis: LavidDataPoint[] | undefined, nombre: string): LavidDataPoint | undefined {
    if (!kpis) return undefined;
    return kpis.find((k) => k.name.toLowerCase() === nombre.toLowerCase());
  }
}
