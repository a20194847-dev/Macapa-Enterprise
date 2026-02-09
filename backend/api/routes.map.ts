const api = {
  dashboard: {
    stats: "/api/dashboard/stats"
  },
  proyectos: {
    list: "/api/proyectos",
    create: "/api/proyectos"
  },
  agentes: {
    list: "/api/agentes",
    chat: "/api/agentes/:id/chat"
  },
  tiposAuditoria: {
    list: "/api/tipos-auditoria"
  },
  auditorias: {
    list: "/api/auditorias",
    get: "/api/auditorias/:id",
    create: "/api/auditorias",
    update: "/api/auditorias/:id",
    fases: "/api/auditorias/:id/fases"
  },
  fases: {
    list: "/api/fases",
    update: "/api/fases/:id"
  },
  analisis: {
    list: "/api/analisis",
    ejecutar: "/api/analisis/ejecutar"
  },
  casos: {
    list: "/api/casos"
  },
  herramientas: {
    list: "/api/herramientas",
    toggle: "/api/herramientas/:id/toggle"
  },
  logs: {
    list: "/api/logs"
  },
  configuracion: {
    get: "/api/configuracion",
    update: "/api/configuracion"
  }
};

export default api;
