# Especificación del Interfaz de Proyectos (PIM)

## 1. Objetivo

El Interfaz de Proyectos es el núcleo del sistema.
Permite:

- Crear y configurar proyectos
- Asignar fases y productos
- Cargar evidencia inicial
- Disparar análisis con agentes
- Generar entregables por fase
- Validar y firmar resultados
- Cerrar el proyecto con expediente probatorio

## 2. Entidades mínimas

### 2.1. Proyecto
- id
- nombre
- cliente
- tipo_proyecto (auditoria_forense, consultoria_estrategica, etc.)
- estado (nuevo, en_proceso, en_revision, cerrado)
- riesgo_global
- fecha_creacion
- fecha_cierre

### 2.2. Fase
- id
- proyecto_id
- nombre
- orden
- estado (pendiente, en_progreso, completada, bloqueada)
- fecha_inicio
- fecha_fin

### 2.3. Entregable
- id
- proyecto_id
- fase_id
- tipo (AIP, EII, PAI, EID, etc.)
- nombre
- formato (pdf, json, md)
- ruta_archivo / storage_key
- estado (borrador, enviado, aprobado)
- fecha_generacion

### 2.4. Evidencia
- id
- proyecto_id
- nombre
- tipo
- ruta_archivo / storage_key
- hash
- fecha_carga
- usuario_id

### 2.5. Validacion
- id
- proyecto_id
- fase_id
- entregable_id
- cliente_usuario_id
- estado (pendiente, aprobado, rechazado)
- fecha_validacion
- hash_firma

## 3. Pantallas clave

### 3.1. Tablero de Proyecto
- Card de resumen: nombre, cliente, tipo, estado, riesgo
- Progreso por fases (barra 0–100%)
- Lista de fases con estado
- Alertas (riesgo, validaciones pendientes)
- Entradas rápidas:
  - Cargar evidencia
  - Ver entregables
  - Validar fase

### 3.2. Vista de Fase
- Información de la fase
- Entregables requeridos
- Entregables generados
- Evidencia asociada
- Panel de interacción con agentes (mensajes, prompts)
- Botón: “Enviar a validación”
- Estado de validación y firma

### 3.3. Vista de Evidencia
- Lista de archivos
- Hash
- Cadena de custodia
- Descarga
- Asociación a fases y entregables

## 4. Integración con templates

Cada entregable tiene un **tipo** y **plantilla** definida en `/templates/...`.

Ejemplo:

- Para auditoría forense:
  - Fase 1 → AIP, EII, EID
  - Fase 2 → OMB
  - Fase 3 → REM
  - Fase 4 → FFI
  - Fase 5 → SAB
  - Fase 6 → SIR
  - Fase 7 → LPD, FFR, AVF

El backend debe:
- Registrar el entregable (tipo, fase, proyecto)
- Guardar el contenido generado (pdf, json, md)
- Asociarlo a la fase y al proyecto
- Exponerlo en la UI del PIM

## 5. Condición para avanzar de fase

Una fase solo puede pasar a “completada” si:
- Se generaron los entregables requeridos
- El cliente los marcó como “aprobado”
- Se registró una validación (tabla Validacion)
- Se generó hash de la aprobación

## 6. Recomendación para el desarrollador

- Implementar primero:
  - Creación de proyectos
  - Listado de fases
  - Registro de entregables
  - Carga de evidencia
- Luego:
  - Validación por fase
  - Estado de proyecto
  - Integración con templates
