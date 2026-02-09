export class KpiLogic {
  static analizar(kpis: any[]) {
    if (!Array.isArray(kpis)) return [];

    return kpis.map(kpi => {
      const valor = kpi.valor ?? 0;

      // Clasificación por impacto
      const impacto = valor > 85 ? "Alto" : valor > 60 ? "Medio" : "Bajo";

      // Estado general
      const estado =
        valor > 80 ? "Excelente" :
        valor > 50 ? "Bueno" :
        valor > 30 ? "Riesgo" :
        "Crítico";

      // Recomendaciones inteligentes
      const recomendacion =
        estado === "Excelente"
          ? "Mantener estrategia actual y monitorear variaciones."
          : estado === "Bueno"
          ? "Optimizar procesos clave para mejorar estabilidad."
          : estado === "Riesgo"
          ? "Revisar controles internos y ejecutar pruebas adicionales."
          : "Intervención inmediata requerida. Activar protocolo forense.";

      return {
        nombre: kpi.nombre || "KPI",
        valor,
        impacto,
        estado,
        recomendacion
      };
    });
  }
}
