import { z } from 'zod';
import { proyectos, agentes, casos, herramientas, logsSupervision, configuracionUsuario, analisis, tiposAuditoria, auditorias, fasesAuditoria } from './schema';

export const errorSchemas = {
  notFound: z.object({ message: z.string() }),
  validation: z.object({ message: z.string(), field: z.string().optional() }),
};

export const api = {
  // Dashboard stats
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/dashboard/stats',
      responses: {
        200: z.object({
          proyectosActivos: z.number(),
          analisisIA: z.number(),
          riesgoPromedio: z.number(),
          anomaliasDetectadas: z.number(),
        }),
      },
    },
  },

  // Proyectos
  proyectos: {
    list: {
      method: 'GET' as const,
      path: '/api/proyectos',
      responses: { 200: z.array(z.custom<typeof proyectos.$inferSelect>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/proyectos',
      responses: { 201: z.custom<typeof proyectos.$inferSelect>() },
    },
  },

  // Agentes
  agentes: {
    list: {
      method: 'GET' as const,
      path: '/api/agentes',
      responses: { 200: z.array(z.custom<typeof agentes.$inferSelect>()) },
    },
    chat: {
      method: 'POST' as const,
      path: '/api/agentes/:id/chat',
      responses: { 
        200: z.object({
          respuesta: z.string(),
          agenteNombre: z.string(),
          supervisionLog: z.custom<typeof logsSupervision.$inferSelect>().optional(),
        }),
      },
    },
  },

  // Tipos de Auditoría
  tiposAuditoria: {
    list: {
      method: 'GET' as const,
      path: '/api/tipos-auditoria',
      responses: { 200: z.array(z.custom<typeof tiposAuditoria.$inferSelect>()) },
    },
  },

  // Auditorías (Workflows)
  auditorias: {
    list: {
      method: 'GET' as const,
      path: '/api/auditorias',
      responses: { 200: z.array(z.custom<typeof auditorias.$inferSelect>()) },
    },
    get: {
      method: 'GET' as const,
      path: '/api/auditorias/:id',
      responses: { 200: z.custom<typeof auditorias.$inferSelect>() },
    },
    create: {
      method: 'POST' as const,
      path: '/api/auditorias',
      responses: { 201: z.custom<typeof auditorias.$inferSelect>() },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/auditorias/:id',
      responses: { 200: z.custom<typeof auditorias.$inferSelect>() },
    },
    fases: {
      method: 'GET' as const,
      path: '/api/auditorias/:id/fases',
      responses: { 200: z.array(z.custom<typeof fasesAuditoria.$inferSelect>()) },
    },
  },

  // Fases
  fases: {
    list: {
      method: 'GET' as const,
      path: '/api/fases',
      responses: { 200: z.array(z.custom<typeof fasesAuditoria.$inferSelect>()) },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/fases/:id',
      responses: { 200: z.custom<typeof fasesAuditoria.$inferSelect>() },
    },
  },

  // Análisis
  analisis: {
    list: {
      method: 'GET' as const,
      path: '/api/analisis',
      responses: { 200: z.array(z.custom<typeof analisis.$inferSelect>()) },
    },
    ejecutar: {
      method: 'POST' as const,
      path: '/api/analisis/ejecutar',
      responses: { 
        200: z.object({
          logs: z.array(z.custom<typeof logsSupervision.$inferSelect>()),
          resultado: z.string(),
        }),
      },
    },
  },

  // Casos (Biblioteca)
  casos: {
    list: {
      method: 'GET' as const,
      path: '/api/casos',
      responses: { 200: z.array(z.custom<typeof casos.$inferSelect>()) },
    },
  },

  // Herramientas (Marketplace)
  herramientas: {
    list: {
      method: 'GET' as const,
      path: '/api/herramientas',
      responses: { 200: z.array(z.custom<typeof herramientas.$inferSelect>()) },
    },
    toggle: {
      method: 'POST' as const,
      path: '/api/herramientas/:id/toggle',
      responses: { 200: z.custom<typeof herramientas.$inferSelect>() },
    },
  },

  // Logs de supervisión
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/logs',
      responses: { 200: z.array(z.custom<typeof logsSupervision.$inferSelect>()) },
    },
  },

  // Configuración
  configuracion: {
    get: {
      method: 'GET' as const,
      path: '/api/configuracion',
      responses: { 200: z.custom<typeof configuracionUsuario.$inferSelect>() },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/configuracion',
      responses: { 200: z.custom<typeof configuracionUsuario.$inferSelect>() },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
