# KPI Institucionales MACAPA — Fase 1

Este documento define los KPI clave que MACAPA utilizará para auditoría continua, riesgos, cumplimiento y sostenibilidad.  
Muchos de estos KPI provienen de prácticas reales de auditoría de grandes grupos empresariales.

Cada KPI tiene:

- **Nombre en dashboard**
- **Objetivo**
- **Categoría**
- **Fuente principal (ej. SAP, SUNAT, RRHH)**
- **Tipo de riesgo**

## 1. Compras y Proveedores

### 1.1 Proveedores exclusivos

- **Nombre en dashboard:** Proveedores exclusivos  
- **Objetivo:** Identificar proveedores que han brindado de manera exclusiva y por más de un año un mismo SKU.  
- **Categoría:** Compras / Proveedores  
- **Fuente:** SAP (MM), maestro de proveedores  
- **Riesgo:** Concentración, dependencia, posible colusión.

### 1.2 Pagos sin recepción de material

- **Nombre en dashboard:** Pagos sin recepción de material  
- **Objetivo:** Verificar la existencia de pagos realizados sin confirmación de recepción de bien/servicio en SAP.  
- **Categoría:** Compras / Finanzas  
- **Fuente:** SAP (FI/MM)  
- **Riesgo:** Fraude, errores contables, pérdidas.

### 1.3 Precio unitario histórico promedio

- **Nombre en dashboard:** Precio unitario histórico promedio  
- **Objetivo:** Identificar variaciones no razonables de precios en un SKU.  
- **Categoría:** Compras / Control de costos  
- **Fuente:** SAP (OC, facturas)  
- **Riesgo:** Sobreprecio, colusión, mala negociación.

### 1.4 Facturas emitidas antes de la OC

- **Nombre en dashboard:** Facturas emitidas antes de la OC  
- **Objetivo:** Verificar compras realizadas previo a la generación y aprobación de la OC (regularización).  
- **Categoría:** Compras / Cumplimiento  
- **Fuente:** SAP (OC, facturas)  
- **Riesgo:** Saltos de control, compras no autorizadas.

### 1.5 Proveedores con deuda coactiva

- **Nombre en dashboard:** Deuda coactiva  
- **Objetivo:** Identificar proveedores con deuda pendiente y en cobranza coactiva en SUNAT.  
- **Categoría:** Proveedores / Riesgo reputacional  
- **Fuente:** SUNAT + maestro de proveedores  
- **Riesgo:** Reputacional, legal, continuidad.

### 1.6 Pagos duplicados

- **Nombre en dashboard:** Pagos duplicados  
- **Objetivo:** Identificar transferencias con significativo grado de similitud con otra transferencia.  
- **Categoría:** Finanzas / Pagos  
- **Fuente:** SAP (FI, REGUH)  
- **Riesgo:** Pérdida financiera, fraude, error.

*(… aquí se continúan todos los KPI que listaste, siguiendo este mismo formato. En Fase 1, MACAPA puede cargar esta lista desde un JSON o YAML para alimentar el motor de KPI.)*

## 2. Recursos Humanos y Conflictos de Interés

### 2.1 Conflicto de interés entre empleados

- **Nombre en dashboard:** Conflicto de interés entre empleados  
- **Objetivo:** Identificar y validar vínculos familiares entre trabajadores para detectar posibles conflictos de interés.  
- **Categoría:** RRHH / Ética  
- **Fuente:** SAP HCM, declaraciones de conflicto de interés  
- **Riesgo:** Fraude, favoritismo, decisiones sesgadas.

### 2.2 Usuarios SAP vigentes de personal cesado

- **Nombre en dashboard:** Usuarios SAP vigentes de personal cesado  
- **Objetivo:** Verificar si los usuarios SAP han sido dados de baja oportunamente.  
- **Categoría:** Seguridad / Accesos  
- **Fuente:** SAP, RRHH  
- **Riesgo:** Uso indebido de credenciales, fraude.

*(… y así con el resto de KPI de RRHH, legales, financieros, etc.)*

## 3. Sostenibilidad y Entorno

En Fase 1, MACAPA comenzará a derivar KPI de sostenibilidad a partir de:

- uso de papel (procesos manuales vs digitales),
- reprocesos,
- tiempos de ciclo,
- concentración de proveedores,
- conflictos de interés,
- sanciones y observaciones regulatorias.

LAVID LITE utilizará estos KPI para proponer:

- automatizaciones,
- digitalizaciones,
- mejoras de procesos,
- políticas de compra responsable,
- reingenierías de flujo.

Este documento es la **fuente institucional** para el motor de KPI de MACAPA.
