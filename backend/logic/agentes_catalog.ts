// backend/logic/agentes_catalog.ts

export interface AgenteConfig {
  nombre: string;
  rol: string;
  descripcion: string;
  capacidades: string[];       // acciones genéricas que puede ejecutar
  tiposEntregable: string[];   // qué tipo de entregables genera
  fasesPreferidas: string[];   // en qué fases suele actuar
}

export const AGENTES_MACAPA: AgenteConfig[] = [

  {
    nombre: "Agent Alpha",
    rol: "Project Manager IA",
    descripcion: "Orquesta el proyecto: estructura, plan de trabajo, Gantt, tareas, asignaciones y coordinación.",
    capacidades: [
      "analizar_solicitud_inicial",
      "estructurar_objetivo",
      "crear_plan_trabajo",
      "generar_gantt",
      "crear_tareas",
      "asignar_agentes",
      "seleccionar_plantillas",
      "solicitar_informacion",
      "preparar_kickoff",
      "registrar_entregables",
      "coordinar_seguimiento"
    ],
    tiposEntregable: [
      "plan_trabajo",
      "gantt",
      "estructura_workflow",
      "lista_tareas",
      "agenda_kickoff"
    ],
    fasesPreferidas: [
      "solicitud_inicial",
      "planificacion",
      "ejecucion",
      "seguimiento"
    ]
  },

  {
    nombre: "ALEX IA",
    rol: "Analista Forense / Auditor Principal",
    descripcion: "Analiza información, evalúa riesgos, ejecuta pruebas y genera hallazgos accionables.",
    capacidades: [
      "analizar_informacion",
      "evaluar_riesgos",
      "identificar_procesos_significativos",
      "construir_matriz_riesgos",
      "ejecutar_pruebas",
      "detectar_anomalias",
      "clasificar_hallazgos",
      "evaluar_accionabilidad",
      "verificar_implementacion"
    ],
    tiposEntregable: [
      "matriz_riesgos",
      "analisis_riesgos",
      "hallazgos",
      "papeles_trabajo",
      "informe_seguimiento_tecnico"
    ],
    fasesPreferidas: [
      "levantamiento",
      "ejecucion",
      "seguimiento"
    ]
  },

  {
    nombre: "Agent Omega",
    rol: "Redactor Senior / Finalizador",
    descripcion: "Sintetiza, redacta y cierra: informes borrador, finales y documentos de cierre.",
    capacidades: [
      "generar_informe_borrador",
      "integrar_comentarios",
      "generar_informe_final",
      "redactar_cartas_formales",
      "emitir_conclusiones"
    ],
    tiposEntregable: [
      "informe_borrador",
      "informe_final",
      "carta_resguardo",
      "comunicaciones_formales"
    ],
    fasesPreferidas: [
      "ejecucion",
      "cierre"
    ]
  },

  {
    nombre: "Alex Flash",
    rol: "Director Visual Ejecutivo",
    descripcion: "Convierte resultados en visualizaciones, dashboards e informes ejecutivos de alto impacto.",
    capacidades: [
      "generar_dashboard",
      "generar_informe_ejecutivo",
      "crear_resumen_visual",
      "preparar_presentacion"
    ],
    tiposEntregable: [
      "dashboard",
      "informe_ejecutivo",
      "presentacion",
      "resumen_visual"
    ],
    fasesPreferidas: [
      "cierre",
      "seguimiento"
    ]
  },

  {
    nombre: "CONTRALOR",
    rol: "Supervisor de Calidad IA",
    descripcion: "Supervisa metodología, sesgos, integridad y cumplimiento del proceso completo.",
    capacidades: [
      "validar_metodologia",
      "detectar_sesgos",
      "verificar_integridad",
      "auditar_proceso",
      "emitir_rating",
      "validar_cierre"
    ],
    tiposEntregable: [
      "informe_supervision",
      "rating",
      "dictamen_calidad"
    ],
    fasesPreferidas: [
      "ejecucion",
      "cierre",
      "seguimiento"
    ]
  }
];
