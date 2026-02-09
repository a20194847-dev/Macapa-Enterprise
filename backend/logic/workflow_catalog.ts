// backend/logic/workflow_catalog.ts

export interface PasoWorkflow {
  nombre: string;
  agente: string;
  accion: string;
}

export interface FaseWorkflow {
  numero: number;
  nombre: string;
  pasos: PasoWorkflow[];
  entregables: string[];
}

export interface WorkflowProducto {
  producto: string;
  descripcion: string;
  fases: FaseWorkflow[];
}

export const WORKFLOWS_MACAPA: WorkflowProducto[] = [

  // PRODUCTO 1 — Auditoría Financiera
  {
    producto: "auditoria_financiera",
    descripcion: "Auditoría financiera basada en estándares corporativos y legales.",
    fases: [
      {
        numero: 1,
        nombre: "Planificación",
        pasos: [
          {
            nombre: "Emisión de la Carta de Apertura",
            agente: "Agent Alpha",
            accion: "Genera borrador de carta y prepara comunicación inicial."
          },
          {
            nombre: "Reunión de Kick-Off",
            agente: "Agent Alpha",
            accion: "Prepara agenda, recopila documentos iniciales y registra acuerdos."
          },
          {
            nombre: "Identificación de procesos significativos",
            agente: "ALEX IA",
            accion: "Analiza procesos, identifica riesgos y propone áreas críticas."
          },
          {
            nombre: "Matriz de Riesgos",
            agente: "ALEX IA",
            accion: "Construye matriz COSO y evalúa probabilidad e impacto."
          }
        ],
        entregables: [
          "Carta de Apertura",
          "Acta de Kick-Off",
          "Mapa de Procesos",
          "Matriz de Riesgos"
        ]
      },

      {
        numero: 2,
        nombre: "Ejecución",
        pasos: [
          {
            nombre: "Ejecución de pruebas",
            agente: "ALEX IA",
            accion: "Ejecuta pruebas sustantivas y de control."
          },
          {
            nombre: "Identificación de hallazgos",
            agente: "ALEX IA",
            accion: "Detecta anomalías y clasifica hallazgos."
          },
          {
            nombre: "Informe Borrador",
            agente: "Agent Omega",
            accion: "Sintetiza hallazgos y prepara informe borrador."
          }
        ],
        entregables: [
          "Papeles de Trabajo",
          "Matriz de Hallazgos",
          "Informe Borrador"
        ]
      },

      {
        numero: 3,
        nombre: "Cierre",
        pasos: [
          {
            nombre: "Clasificación (RATING)",
            agente: "CONTRALOR",
            accion: "Evalúa calidad de controles y cumplimiento."
          },
          {
            nombre: "Informe Final",
            agente: "Agent Omega",
            accion: "Genera informe final con conclusiones."
          }
        ],
        entregables: [
          "Informe Final",
          "Carta de Resguardo",
          "Planes de Acción"
        ]
      }
    ]
  }

  // Aquí luego agregaremos:
  // - auditoria_fraude
  // - due_diligence
  // - compliance
  // - legal
  // - consultoria_estrategica
  // - diagnostico_operativo
  // - auditoria_rrhh
  // - auditoria_ti
  // - auditoria_proveedores
  // - auditoria_caja_chica
  // - etc.
];
