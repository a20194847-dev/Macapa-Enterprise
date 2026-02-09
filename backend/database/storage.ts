import { 
  type Proyecto, type Agente, type Caso, type Herramienta, 
  type LogSupervision, type ConfiguracionUsuario, type Analisis,
  type TipoAuditoria, type Auditoria, type FaseAuditoria, type Evidencia, type Entregable,
  type InsertProyecto, type InsertLog, type InsertAuditoria, type InsertFase
} from "@shared/schema";

export interface IStorage {
  // Dashboard
  getDashboardStats(): Promise<{ proyectosActivos: number; analisisIA: number; riesgoPromedio: number; anomaliasDetectadas: number }>;
  
  // Proyectos
  getProyectos(): Promise<Proyecto[]>;
  createProyecto(p: InsertProyecto): Promise<Proyecto>;
  
  // Agentes
  getAgentes(): Promise<Agente[]>;
  getAgente(id: number): Promise<Agente | undefined>;
  
  // Tipos de Auditoría
  getTiposAuditoria(): Promise<TipoAuditoria[]>;
  
  // Auditorías (Workflows)
  getAuditorias(): Promise<Auditoria[]>;
  getAuditoria(id: number): Promise<Auditoria | undefined>;
  createAuditoria(a: InsertAuditoria): Promise<Auditoria>;
  updateAuditoria(id: number, updates: Partial<Auditoria>): Promise<Auditoria | undefined>;
  
  // Fases
  getAllFases(): Promise<FaseAuditoria[]>;
  getFasesByAuditoria(auditoriaId: number): Promise<FaseAuditoria[]>;
  updateFase(id: number, updates: Partial<FaseAuditoria>): Promise<FaseAuditoria | undefined>;
  
  // Evidencias
  getEvidenciasByFase(faseId: number): Promise<Evidencia[]>;
  
  // Entregables
  getEntregablesByAuditoria(auditoriaId: number): Promise<Entregable[]>;
  
  // Análisis
  getAnalisis(): Promise<Analisis[]>;
  
  // Casos
  getCasos(): Promise<Caso[]>;
  
  // Herramientas
  getHerramientas(): Promise<Herramienta[]>;
  toggleHerramienta(id: number): Promise<Herramienta | undefined>;
  
  // Logs
  getLogs(): Promise<LogSupervision[]>;
  createLog(log: InsertLog): Promise<LogSupervision>;
  
  // Configuración
  getConfiguracion(): Promise<ConfiguracionUsuario>;
  updateConfiguracion(config: Partial<ConfiguracionUsuario>): Promise<ConfiguracionUsuario>;
}

export class MemStorage implements IStorage {
  private proyectos: Map<number, Proyecto> = new Map();
  private agentes: Map<number, Agente> = new Map();
  private tiposAuditoria: Map<number, TipoAuditoria> = new Map();
  private auditorias: Map<number, Auditoria> = new Map();
  private fases: Map<number, FaseAuditoria> = new Map();
  private evidencias: Map<number, Evidencia> = new Map();
  private entregables: Map<number, Entregable> = new Map();
  private analisis: Map<number, Analisis> = new Map();
  private casos: Map<number, Caso> = new Map();
  private herramientas: Map<number, Herramienta> = new Map();
  private logs: Map<number, LogSupervision> = new Map();
  private config: ConfiguracionUsuario;
  
  private proyectoId = 1;
  private auditoriaId = 1;
  private faseId = 1;
  private logId = 1;

  constructor() {
    this.config = {
      id: 1,
      nombreCompleto: "Auditor Usuario",
      email: "auditor@macapa.com",
      rol: "Auditor Senior",
      suscripcion: "Verified Professional",
      avatarInicial: "AU"
    };
    this.seedData();
  }

  private seedData() {
    // Agentes IA con personalidades
    const agentesData: Omit<Agente, 'id'>[] = [
      { 
        nombre: "ALEX IA", 
        rol: "Auditor Forense Principal", 
        avatar: "brain", 
        experiencia: "25+ años, 15,000+ casos", 
        credenciales: "CPA, CFE, CIA, CISA", 
        especialidad: "Análisis forense profundo, detección de fraude", 
        estado: "En línea", 
        color: "blue",
        personalidad: "Mentor experimentado y accesible. Usa analogías para explicar conceptos complejos. Paciente pero riguroso.",
        estiloRespuesta: "profesional_amigable",
        saludoDefault: "Buen día. Soy ALEX IA, tu auditor forense principal. Como un buen detective financiero, mi trabajo es encontrar la verdad en los números. ¿En qué puedo ayudarte hoy?",
        precision: 98
      },
      { 
        nombre: "Alex Flash", 
        rol: "Director Visual Ejecutivo", 
        avatar: "zap", 
        experiencia: "20+ años, 10,000+ reportes", 
        credenciales: "MBA, Data Viz Expert", 
        especialidad: "Reportes de alto impacto para CEOs", 
        estado: "En línea", 
        color: "yellow",
        personalidad: "Dinámico, directo y entusiasta. Optimista pero realista. Enfocado en resultados rápidos.",
        estiloRespuesta: "energico_directo",
        saludoDefault: "¡Hola! Soy Alex Flash. Mi especialidad es convertir datos complejos en visualizaciones que impactan. ¿Listo para crear algo extraordinario?",
        precision: 96
      },
      { 
        nombre: "CONTRALOR", 
        rol: "Supervisor de Calidad IA", 
        avatar: "shield", 
        experiencia: "25+ años, PhD Audit Quality", 
        credenciales: "CPA, CIA, CISA", 
        especialidad: "Supervisión IA, control de calidad enterprise", 
        estado: "En línea", 
        color: "red",
        personalidad: "Meticuloso, imparcial y judicial. Habla con precisión matemática. Siempre objetivo.",
        estiloRespuesta: "formal_preciso",
        saludoDefault: "Saludos. Soy CONTRALOR, responsable de garantizar la calidad e imparcialidad de todos los análisis. Detecto sesgos con 94.2% de precisión.",
        precision: 94
      },
      { 
        nombre: "Agent Alpha", 
        rol: "Iniciador de Fases", 
        avatar: "search", 
        experiencia: "Especialista en evidencia", 
        credenciales: null, 
        especialidad: "Investigación profunda y recopilación de evidencia", 
        estado: "En línea", 
        color: "cyan",
        personalidad: "Investigador curioso con mentalidad de detective. Metódico en la recopilación de información.",
        estiloRespuesta: "investigativo_curioso",
        saludoDefault: "Hola, soy Alpha. Mi trabajo es iniciar cada fase asegurando que tengamos toda la evidencia necesaria. ¿Qué caso vamos a investigar?",
        precision: 97
      },
      { 
        nombre: "Agent Omega", 
        rol: "Finalizador de Fases", 
        avatar: "target", 
        experiencia: "Especialista en síntesis", 
        credenciales: null, 
        especialidad: "Síntesis de información y generación de reportes finales", 
        estado: "En línea", 
        color: "purple",
        personalidad: "Sintetizador y conclusivo. Enfocado en entregar resultados claros y accionables.",
        estiloRespuesta: "ejecutivo_conclusivo",
        saludoDefault: "Bienvenido. Soy Omega, especialista en sintetizar hallazgos y generar conclusiones. Mi rol es asegurar que cada fase cierre con entregables de calidad.",
        precision: 95
      },
    ];
    agentesData.forEach((a, i) => this.agentes.set(i + 1, { ...a, id: i + 1 }));

    // Tipos de Auditoría
    const tiposData: Omit<TipoAuditoria, 'id'>[] = [
      {
        nombre: "Auditoría Financiera",
        descripcion: "Examen de estados financieros para verificar su razonabilidad",
        normativaAplicable: "ISA, NIA, GAAP, IFRS",
        duracionEstimada: "4-8 semanas",
        fasesRequeridas: JSON.stringify(["Planificación", "Evaluación de Riesgos", "Ejecución", "Conclusión", "Informe"]),
        entregablesRequeridos: JSON.stringify(["Carta de Compromiso", "Plan de Auditoría", "Papeles de Trabajo", "Informe de Auditoría", "Carta de Gerencia"]),
        icono: "fileText",
        color: "blue"
      },
      {
        nombre: "Investigación de Fraude",
        descripcion: "Investigación forense de irregularidades y fraude corporativo",
        normativaAplicable: "ISA 240, ACFE Standards, Ley Sarbanes-Oxley",
        duracionEstimada: "2-12 semanas",
        fasesRequeridas: JSON.stringify(["Detección", "Investigación", "Análisis Forense", "Documentación", "Reporte Legal"]),
        entregablesRequeridos: JSON.stringify(["Informe de Detección", "Cronología de Hechos", "Evidencia Documentada", "Informe Forense", "Recomendaciones"]),
        icono: "shield",
        color: "red"
      },
      {
        nombre: "Due Diligence",
        descripcion: "Análisis exhaustivo para fusiones, adquisiciones o inversiones",
        normativaAplicable: "COSO, Mejores Prácticas M&A",
        duracionEstimada: "2-6 semanas",
        fasesRequeridas: JSON.stringify(["Alcance", "Análisis Financiero", "Análisis Legal", "Análisis Operacional", "Valoración"]),
        entregablesRequeridos: JSON.stringify(["Scope Letter", "Informe Financiero", "Red Flags", "Valoración", "Recomendación Final"]),
        icono: "search",
        color: "green"
      },
      {
        nombre: "Auditoría de Cumplimiento",
        descripcion: "Verificación del cumplimiento normativo y regulatorio",
        normativaAplicable: "SOX, COSO, ISO 27001, GDPR",
        duracionEstimada: "3-6 semanas",
        fasesRequeridas: JSON.stringify(["Mapeo Normativo", "Evaluación de Controles", "Pruebas", "Hallazgos", "Plan de Remediación"]),
        entregablesRequeridos: JSON.stringify(["Matriz de Cumplimiento", "Informe de Controles", "Gap Analysis", "Plan de Acción", "Certificación"]),
        icono: "checkCircle",
        color: "purple"
      }
    ];
    tiposData.forEach((t, i) => this.tiposAuditoria.set(i + 1, { ...t, id: i + 1 }));

    // Proyectos seed - Serch SAC como cliente principal
    const proyectosData: Omit<Proyecto, 'id'>[] = [
      { nombre: "Auditoría Financiera 2024", cliente: "Serch SAC", tipo: "Auditoría Financiera", estado: "En Progreso", nivelRiesgo: "Medio", probabilidadFraude: 18, anomalias: 3, fecha: new Date() },
      { nombre: "Revisión Caja Chica Q4", cliente: "Serch SAC", tipo: "Auditoría Financiera", estado: "En Progreso", nivelRiesgo: "Bajo", probabilidadFraude: 8, anomalias: 1, fecha: new Date() },
      { nombre: "Due Diligence Expansión", cliente: "Serch SAC", tipo: "Due Diligence", estado: "Completado", nivelRiesgo: "Bajo", probabilidadFraude: 5, anomalias: 0, fecha: new Date() },
    ];
    proyectosData.forEach((p, i) => {
      this.proyectos.set(i + 1, { ...p, id: i + 1 });
      this.proyectoId = i + 2;
    });

    // Auditoría ejemplo con fases - Serch SAC
    const auditoria: Auditoria = {
      id: 1,
      proyectoId: 1,
      tipoAuditoriaId: 1,
      nombre: "Auditoría Financiera Serch SAC 2024",
      descripcion: "Examen de estados financieros, caja chica y registros de compras",
      estado: "en_progreso",
      faseActual: 2,
      progreso: 35,
      fechaInicio: new Date(),
      fechaFin: null,
      agenteResponsable: "ALEX IA",
      createdAt: new Date()
    };
    this.auditorias.set(1, auditoria);
    this.auditoriaId = 2;

    // Fases de la auditoría ejemplo
    const fasesData: Omit<FaseAuditoria, 'id'>[] = [
      { auditoriaId: 1, numero: 1, nombre: "Planificación", descripcion: "Definir alcance y estrategia", estado: "completada", agenteAsignado: "Agent Alpha", fechaInicio: new Date(), fechaFin: new Date(), entregablesRequeridos: JSON.stringify(["Plan de Auditoría", "Carta de Compromiso"]), completado: true },
      { auditoriaId: 1, numero: 2, nombre: "Evaluación de Riesgos", descripcion: "Identificar áreas de riesgo", estado: "en_progreso", agenteAsignado: "ALEX IA", fechaInicio: new Date(), fechaFin: null, entregablesRequeridos: JSON.stringify(["Matriz de Riesgos", "Análisis COSO"]), completado: false },
      { auditoriaId: 1, numero: 3, nombre: "Ejecución", descripcion: "Pruebas sustantivas y de control", estado: "pendiente", agenteAsignado: "ALEX IA", fechaInicio: null, fechaFin: null, entregablesRequeridos: JSON.stringify(["Papeles de Trabajo", "Evidencia"]), completado: false },
      { auditoriaId: 1, numero: 4, nombre: "Conclusión", descripcion: "Evaluación de hallazgos", estado: "pendiente", agenteAsignado: "Agent Omega", fechaInicio: null, fechaFin: null, entregablesRequeridos: JSON.stringify(["Resumen de Hallazgos"]), completado: false },
      { auditoriaId: 1, numero: 5, nombre: "Informe", descripcion: "Emisión de opinión", estado: "pendiente", agenteAsignado: "Agent Omega", fechaInicio: null, fechaFin: null, entregablesRequeridos: JSON.stringify(["Informe de Auditoría", "Carta de Gerencia"]), completado: false },
    ];
    fasesData.forEach((f, i) => {
      this.fases.set(i + 1, { ...f, id: i + 1 });
      this.faseId = i + 2;
    });

    // Casos (Biblioteca)
    const casosData: Omit<Caso, 'id'>[] = [
      { nombre: "Caso Enron - Estudio", tipo: "Investigación de Fraude", fecha: new Date("2024-09-29"), anomalias: 15, probabilidadFraude: 98, nivelRiesgo: "Crítico", hallazgos: JSON.stringify(["Entidades fuera de balance", "Manipulación de ingresos", "Conflictos de interés"]), etiquetas: JSON.stringify(["Histórico", "Fraude Masivo", "Referencia"]) },
      { nombre: "Auditoría Banco Regional", tipo: "Auditoría Financiera", fecha: new Date("2024-08-14"), anomalias: 3, probabilidadFraude: 12, nivelRiesgo: "Bajo", hallazgos: JSON.stringify(["Provisiones subestimadas", "Documentación incompleta"]), etiquetas: JSON.stringify(["Banca", "Bajo Riesgo"]) },
    ];
    casosData.forEach((c, i) => this.casos.set(i + 1, { ...c, id: i + 1 }));

    // Herramientas Marketplace
    const herramientasData: Omit<Herramienta, 'id'>[] = [
      { nombre: "Detector de Anomalías", descripcion: "Identifica patrones inusuales en transacciones financieras usando IA", precio: 49, categoria: "Análisis", icono: "alertTriangle", color: "orange", suscrito: true },
      { nombre: "Análisis de Riesgos", descripcion: "Evaluación automatizada de niveles de riesgo con metodología COSO", precio: 59, categoria: "Evaluación", icono: "barChart", color: "purple", suscrito: true },
      { nombre: "Detector de Fraude", descripcion: "IA especializada en patrones de fraude financiero con 98.7% precisión", precio: 79, categoria: "Fraude", icono: "shield", color: "red", suscrito: false },
      { nombre: "Auditor de Compliance", descripcion: "Verificación automática de cumplimiento SOX, COSO, GDPR", precio: 69, categoria: "Compliance", icono: "checkCircle", color: "green", suscrito: false },
      { nombre: "Analizador Forense", descripcion: "Investigación profunda de evidencia digital con cadena de custodia", precio: 89, categoria: "Forense", icono: "search", color: "blue", suscrito: false },
      { nombre: "Generador de Reportes", descripcion: "Informes profesionales automáticos con valor probatorio", precio: 49, categoria: "Reportes", icono: "fileText", color: "indigo", suscrito: true },
    ];
    herramientasData.forEach((h, i) => this.herramientas.set(i + 1, { ...h, id: i + 1 }));

    // Logs iniciales
    const logsData: Omit<LogSupervision, 'id'>[] = [
      { agenteNombre: "ALEX IA", accion: "Escaneo de Patrones", detalles: "Analizando libro mayor para anomalías con Ley de Benford.", sesgoDetectado: false, correccionAplicada: null, timestamp: new Date(), auditoriaId: 1, faseId: 2 },
      { agenteNombre: "CONTRALOR", accion: "Verificación de Metodología", detalles: "Validando que ALEX IA aplica correctamente ISA 240.", sesgoDetectado: false, correccionAplicada: null, timestamp: new Date(), auditoriaId: 1, faseId: 2 },
    ];
    logsData.forEach((l, i) => {
      this.logs.set(i + 1, { ...l, id: i + 1 });
      this.logId = i + 2;
    });
  }

  async getDashboardStats() {
    const proyectos = Array.from(this.proyectos.values());
    const activos = proyectos.filter(p => p.estado !== 'Completado').length;
    const totalAnomalias = proyectos.reduce((sum, p) => sum + (p.anomalias || 0), 0);
    const riesgoPromedio = proyectos.length > 0 
      ? Math.round(proyectos.reduce((sum, p) => sum + (p.probabilidadFraude || 0), 0) / proyectos.length)
      : 0;
    return {
      proyectosActivos: activos,
      analisisIA: this.auditorias.size,
      riesgoPromedio,
      anomaliasDetectadas: totalAnomalias,
    };
  }

  async getProyectos() { return Array.from(this.proyectos.values()); }
  async createProyecto(p: InsertProyecto) {
    const proyecto: Proyecto = { 
      id: this.proyectoId++, 
      nombre: p.nombre,
      cliente: p.cliente,
      tipo: p.tipo,
      estado: p.estado,
      nivelRiesgo: p.nivelRiesgo,
      probabilidadFraude: p.probabilidadFraude ?? null,
      anomalias: p.anomalias ?? null,
      fecha: new Date() 
    };
    this.proyectos.set(proyecto.id, proyecto);
    return proyecto;
  }

  async getAgentes() { return Array.from(this.agentes.values()); }
  async getAgente(id: number) { return this.agentes.get(id); }

  async getTiposAuditoria() { return Array.from(this.tiposAuditoria.values()); }

  async getAuditorias() { return Array.from(this.auditorias.values()); }
  async getAuditoria(id: number) { return this.auditorias.get(id); }
  async createAuditoria(a: InsertAuditoria) {
    const auditoria: Auditoria = { 
      id: this.auditoriaId++,
      proyectoId: a.proyectoId,
      tipoAuditoriaId: a.tipoAuditoriaId,
      nombre: a.nombre,
      descripcion: a.descripcion ?? null,
      estado: a.estado ?? "borrador",
      faseActual: a.faseActual ?? 1,
      progreso: a.progreso ?? 0,
      fechaInicio: a.fechaInicio ?? null,
      fechaFin: a.fechaFin ?? null,
      agenteResponsable: a.agenteResponsable ?? "ALEX IA",
      createdAt: new Date()
    };
    this.auditorias.set(auditoria.id, auditoria);
    return auditoria;
  }
  async updateAuditoria(id: number, updates: Partial<Auditoria>) {
    const a = this.auditorias.get(id);
    if (!a) return undefined;
    const updated = { ...a, ...updates };
    this.auditorias.set(id, updated);
    return updated;
  }

  async getAllFases() {
    return Array.from(this.fases.values()).sort((a, b) => a.numero - b.numero);
  }

  async getFasesByAuditoria(auditoriaId: number) {
    return Array.from(this.fases.values())
      .filter(f => f.auditoriaId === auditoriaId)
      .sort((a, b) => a.numero - b.numero);
  }
  async updateFase(id: number, updates: Partial<FaseAuditoria>) {
    const f = this.fases.get(id);
    if (!f) return undefined;
    const updated = { ...f, ...updates };
    this.fases.set(id, updated);
    return updated;
  }

  async getEvidenciasByFase(faseId: number) {
    return Array.from(this.evidencias.values()).filter(e => e.faseId === faseId);
  }

  async getEntregablesByAuditoria(auditoriaId: number) {
    return Array.from(this.entregables.values()).filter(e => e.auditoriaId === auditoriaId);
  }

  async getAnalisis() { return Array.from(this.analisis.values()); }

  async getCasos() { return Array.from(this.casos.values()); }

  async getHerramientas() { return Array.from(this.herramientas.values()); }
  async toggleHerramienta(id: number) {
    const h = this.herramientas.get(id);
    if (!h) return undefined;
    const updated = { ...h, suscrito: !h.suscrito };
    this.herramientas.set(id, updated);
    return updated;
  }

  async getLogs() { 
    return Array.from(this.logs.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)); 
  }
  async createLog(log: InsertLog) {
    const newLog: LogSupervision = { 
      id: this.logId++,
      agenteNombre: log.agenteNombre,
      accion: log.accion,
      detalles: log.detalles,
      sesgoDetectado: log.sesgoDetectado ?? null,
      correccionAplicada: log.correccionAplicada ?? null,
      auditoriaId: log.auditoriaId ?? null,
      faseId: log.faseId ?? null,
      timestamp: new Date() 
    };
    this.logs.set(newLog.id, newLog);
    return newLog;
  }

  async getConfiguracion() { return this.config; }
  async updateConfiguracion(updates: Partial<ConfiguracionUsuario>) {
    this.config = { ...this.config, ...updates };
    return this.config;
  }
}

export const storage = new MemStorage();
