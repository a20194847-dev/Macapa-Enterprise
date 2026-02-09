import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === PROYECTOS ===
export const proyectos = pgTable("proyectos", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  cliente: text("cliente").notNull(),
  tipo: text("tipo").notNull(),
  estado: text("estado").notNull(),
  nivelRiesgo: text("nivel_riesgo").notNull(),
  probabilidadFraude: integer("probabilidad_fraude").default(0),
  anomalias: integer("anomalias").default(0),
  fecha: timestamp("fecha").defaultNow(),
});

// === AGENTES IA ===
export const agentes = pgTable("agentes", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  rol: text("rol").notNull(),
  avatar: text("avatar").notNull(),
  experiencia: text("experiencia").notNull(),
  credenciales: text("credenciales"),
  especialidad: text("especialidad").notNull(),
  estado: text("estado").default("En línea"),
  color: text("color").notNull(),
  personalidad: text("personalidad"),
  estiloRespuesta: text("estilo_respuesta"),
  saludoDefault: text("saludo_default"),
  precision: integer("precision").default(95),
});

// === TIPOS DE AUDITORÍA ===
export const tiposAuditoria = pgTable("tipos_auditoria", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion").notNull(),
  normativaAplicable: text("normativa_aplicable").notNull(), // COSO, ISA, SOX, etc.
  duracionEstimada: text("duracion_estimada").notNull(),
  fasesRequeridas: text("fases_requeridas").notNull(), // JSON array
  entregablesRequeridos: text("entregables_requeridos").notNull(), // JSON array
  icono: text("icono").notNull(),
  color: text("color").notNull(),
});

// === AUDITORÍAS (Flujos de Trabajo) ===
export const auditorias = pgTable("auditorias", {
  id: serial("id").primaryKey(),
  proyectoId: integer("proyecto_id").notNull(),
  tipoAuditoriaId: integer("tipo_auditoria_id").notNull(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  estado: text("estado").notNull().default("borrador"), // borrador, en_progreso, revision, completada
  faseActual: integer("fase_actual").default(1),
  progreso: integer("progreso").default(0),
  fechaInicio: timestamp("fecha_inicio"),
  fechaFin: timestamp("fecha_fin"),
  agenteResponsable: text("agente_responsable").default("ALEX IA"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === FASES DE AUDITORÍA ===
export const fasesAuditoria = pgTable("fases_auditoria", {
  id: serial("id").primaryKey(),
  auditoriaId: integer("auditoria_id").notNull(),
  numero: integer("numero").notNull(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  estado: text("estado").notNull().default("pendiente"), // pendiente, en_progreso, revision, completada
  agenteAsignado: text("agente_asignado").notNull(), // Alpha, ALEX IA, Omega
  fechaInicio: timestamp("fecha_inicio"),
  fechaFin: timestamp("fecha_fin"),
  entregablesRequeridos: text("entregables_requeridos"), // JSON array
  completado: boolean("completado").default(false),
});

// === EVIDENCIAS ===
export const evidencias = pgTable("evidencias", {
  id: serial("id").primaryKey(),
  faseId: integer("fase_id").notNull(),
  auditoriaId: integer("auditoria_id").notNull(),
  nombre: text("nombre").notNull(),
  tipo: text("tipo").notNull(), // documento, imagen, excel, pdf, otro
  tamanio: integer("tamanio"), // en bytes
  ruta: text("ruta").notNull(),
  descripcion: text("descripcion"),
  subidoPor: text("subido_por"),
  fechaSubida: timestamp("fecha_subida").defaultNow(),
  analizado: boolean("analizado").default(false),
  resultadoAnalisis: text("resultado_analisis"),
});

// === ENTREGABLES ===
export const entregables = pgTable("entregables", {
  id: serial("id").primaryKey(),
  auditoriaId: integer("auditoria_id").notNull(),
  faseId: integer("fase_id"),
  tipo: text("tipo").notNull(), // reporte_ejecutivo, dashboard, presentacion, excel, informe_tecnico
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  estado: text("estado").notNull().default("pendiente"), // pendiente, generando, completado, error
  formato: text("formato"), // pdf, xlsx, pptx, html
  ruta: text("ruta"),
  contenido: text("contenido"), // JSON para dashboards dinámicos
  fechaGeneracion: timestamp("fecha_generacion"),
  generadoPor: text("generado_por"), // Agente que lo generó
});

// === ANÁLISIS ===
export const analisis = pgTable("analisis", {
  id: serial("id").primaryKey(),
  proyectoId: integer("proyecto_id").notNull(),
  tipo: text("tipo").notNull(),
  estado: text("estado").notNull(),
  resultados: text("resultados"),
  fecha: timestamp("fecha").defaultNow(),
});

// === CASOS (Biblioteca) ===
export const casos = pgTable("casos", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  tipo: text("tipo").notNull(),
  fecha: timestamp("fecha").defaultNow(),
  anomalias: integer("anomalias").default(0),
  probabilidadFraude: integer("probabilidad_fraude").default(0),
  nivelRiesgo: text("nivel_riesgo").notNull(),
  hallazgos: text("hallazgos").notNull(),
  etiquetas: text("etiquetas").notNull(),
});

// === HERRAMIENTAS MARKETPLACE ===
export const herramientas = pgTable("herramientas", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion").notNull(),
  precio: integer("precio").notNull(),
  categoria: text("categoria").notNull(),
  icono: text("icono").notNull(),
  color: text("color").notNull(),
  suscrito: boolean("suscrito").default(false),
});

// === LOGS DE SUPERVISIÓN ===
export const logsSupervision = pgTable("logs_supervision", {
  id: serial("id").primaryKey(),
  agenteNombre: text("agente_nombre").notNull(),
  accion: text("accion").notNull(),
  detalles: text("detalles").notNull(),
  sesgoDetectado: boolean("sesgo_detectado").default(false),
  correccionAplicada: text("correccion_aplicada"),
  timestamp: timestamp("timestamp").defaultNow(),
  auditoriaId: integer("auditoria_id"),
  faseId: integer("fase_id"),
});

// === MENSAJES DE CHAT ===
export const mensajesChat = pgTable("mensajes_chat", {
  id: serial("id").primaryKey(),
  agenteId: integer("agente_id").notNull(),
  auditoriaId: integer("auditoria_id"),
  rol: text("rol").notNull(), // user, agent
  contenido: text("contenido").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === CONFIGURACIÓN USUARIO ===
export const configuracionUsuario = pgTable("configuracion_usuario", {
  id: serial("id").primaryKey(),
  nombreCompleto: text("nombre_completo").notNull(),
  email: text("email").notNull(),
  rol: text("rol").notNull(),
  suscripcion: text("suscripcion").notNull(),
  avatarInicial: text("avatar_inicial").notNull(),
});

// === SCHEMAS ===
export const insertProyectoSchema = createInsertSchema(proyectos).omit({ id: true });
export const insertAgenteSchema = createInsertSchema(agentes).omit({ id: true });
export const insertTipoAuditoriaSchema = createInsertSchema(tiposAuditoria).omit({ id: true });
export const insertAuditoriaSchema = createInsertSchema(auditorias).omit({ id: true });
export const insertFaseSchema = createInsertSchema(fasesAuditoria).omit({ id: true });
export const insertEvidenciaSchema = createInsertSchema(evidencias).omit({ id: true });
export const insertEntregableSchema = createInsertSchema(entregables).omit({ id: true });
export const insertAnalisisSchema = createInsertSchema(analisis).omit({ id: true });
export const insertCasoSchema = createInsertSchema(casos).omit({ id: true });
export const insertHerramientaSchema = createInsertSchema(herramientas).omit({ id: true });
export const insertLogSchema = createInsertSchema(logsSupervision).omit({ id: true });
export const insertMensajeSchema = createInsertSchema(mensajesChat).omit({ id: true });
export const insertConfigSchema = createInsertSchema(configuracionUsuario).omit({ id: true });

// === TYPES ===
export type Proyecto = typeof proyectos.$inferSelect;
export type Agente = typeof agentes.$inferSelect;
export type TipoAuditoria = typeof tiposAuditoria.$inferSelect;
export type Auditoria = typeof auditorias.$inferSelect;
export type FaseAuditoria = typeof fasesAuditoria.$inferSelect;
export type Evidencia = typeof evidencias.$inferSelect;
export type Entregable = typeof entregables.$inferSelect;
export type Analisis = typeof analisis.$inferSelect;
export type Caso = typeof casos.$inferSelect;
export type Herramienta = typeof herramientas.$inferSelect;
export type LogSupervision = typeof logsSupervision.$inferSelect;
export type MensajeChat = typeof mensajesChat.$inferSelect;
export type ConfiguracionUsuario = typeof configuracionUsuario.$inferSelect;

export type InsertProyecto = z.infer<typeof insertProyectoSchema>;
export type InsertAgente = z.infer<typeof insertAgenteSchema>;
export type InsertTipoAuditoria = z.infer<typeof insertTipoAuditoriaSchema>;
export type InsertAuditoria = z.infer<typeof insertAuditoriaSchema>;
export type InsertFase = z.infer<typeof insertFaseSchema>;
export type InsertEvidencia = z.infer<typeof insertEvidenciaSchema>;
export type InsertEntregable = z.infer<typeof insertEntregableSchema>;
export type InsertAnalisis = z.infer<typeof insertAnalisisSchema>;
export type InsertCaso = z.infer<typeof insertCasoSchema>;
export type InsertHerramienta = z.infer<typeof insertHerramientaSchema>;
export type InsertLog = z.infer<typeof insertLogSchema>;
export type InsertMensaje = z.infer<typeof insertMensajeSchema>;
export type InsertConfig = z.infer<typeof insertConfigSchema>;
