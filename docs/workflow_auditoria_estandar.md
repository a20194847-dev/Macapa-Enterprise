# Workflow de Auditoría — Proceso Estándar MACAPA

Este workflow define el ciclo de vida de una auditoría típica:

1. Planificación  
2. Ejecución  
3. Cierre  
4. Seguimiento  

MACAPA y sus agentes IA (incluyendo LAVID LITE) se integran en cada fase.

## 1. Planificación

- Emisión de la Carta de Apertura  
- Reunión de Apertura / Kick-Off  
- Identificación y relevamiento de procesos significativos  
- Elaboración de Matriz de Riesgos Administrativos y de Negocio  

**Intervención LAVID LITE:**

- Sugiere procesos críticos a priorizar.  
- Propone KPI clave por proceso.  
- Señala riesgos emergentes (ambientales, sociales, financieros, reputacionales).

## 2. Ejecución

- Ejecución de pruebas de auditoría  
- Identificación, comunicación y validación de hallazgos  
- Reunión de resultados con auditado (Informe Borrador)  
- Validación del Informe Borrador por auditado vía e-mail  

**Intervención LAVID LITE:**

- Detecta patrones en hallazgos.  
- Propone automatizaciones y controles adicionales.  
- Evalúa impacto en ecosistemas (equipos, proveedores, clientes).

## 3. Cierre

- Clasificación de la Unidad Auditada (RATING)  
- Envío de Carta de Resguardo de hechos posteriores  
- Emisión de Informe Final de observaciones  
- Solicitud de planes de acción al auditado  

**Intervención LAVID LITE:**

- Sugiere planes de acción sostenibles y alcanzables.  
- Prioriza acciones por impacto y factibilidad.  
- Conecta hallazgos con KPI y riesgos estructurales.

## 4. Seguimiento

- Obtención de planes de acción  
- Ingreso de planes de acción a herramienta de seguimiento  
- Implementación de planes de acción por la Unidad  
- Verificación de planes de acción y emisión de Informe de Seguimiento  

**Intervención LAVID LITE:**

- Evalúa avance real vs planificado.  
- Propone ajustes, automatizaciones y reingenierías.  
- Mide impacto en sostenibilidad, eficiencia y riesgo.

Este workflow será implementado en:

- `/core/services/workflow_engine.ts`  
- `/backend/api/workflow.routes.ts`  
- `/frontend/pages/Audit_Workflow.tsx`  

y será uno de los ejes centrales de MACAPA ENTERPRISE.
