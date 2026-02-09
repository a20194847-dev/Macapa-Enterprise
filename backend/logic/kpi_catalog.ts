// backend/logic/kpi_catalog.ts

export interface KpiDefinition {
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  riesgoInherente: "Bajo" | "Medio" | "Alto" | "Crítico";
  normativa: string[];
  fuenteDatos: string[];
  logica: string;
  variables: string[];
}

export const KPI_CATALOG: KpiDefinition[] = [

  /* ============================
     COMPRAS & PROVEEDORES
  ============================ */

  {
    codigo: "KPI001",
    nombre: "Proveedores exclusivos",
    categoria: "Compras",
    descripcion: "Identificar proveedores que han brindado de manera exclusiva y por más de un año un mismo SKU.",
    riesgoInherente: "Alto",
    normativa: ["COSO", "Fraude"],
    fuenteDatos: ["SAP MM"],
    logica: "Proveedor con >90% participación en un SKU durante 12 meses.",
    variables: ["proveedor", "sku", "fecha", "cantidad"]
  },

  {
    codigo: "KPI002",
    nombre: "Pagos sin recepción de material",
    categoria: "Compras",
    descripcion: "Verificar pagos realizados sin confirmación de recepción de bien/servicio en SAP.",
    riesgoInherente: "Crítico",
    normativa: ["ISA 240", "COSO"],
    fuenteDatos: ["SAP FI", "SAP MM"],
    logica: "Pago registrado sin documento de recepción (MIGO/MIRO).",
    variables: ["oc", "factura", "fechaPago", "fechaRecepcion"]
  },

  {
    codigo: "KPI003",
    nombre: "Precio unitario histórico promedio",
    categoria: "Compras",
    descripcion: "Identificar variaciones no razonables de precios en un SKU.",
    riesgoInherente: "Alto",
    normativa: ["COSO"],
    fuenteDatos: ["SAP MM"],
    logica: "Comparar precio actual vs. promedio histórico de 12 meses.",
    variables: ["sku", "precio", "fecha"]
  },

  {
    codigo: "KPI004",
    nombre: "Facturas emitidas antes de la OC",
    categoria: "Compras",
    descripcion: "Verificar compras realizadas previo a la generación y aprobación de la OC.",
    riesgoInherente: "Crítico",
    normativa: ["ISA 240"],
    fuenteDatos: ["SAP MM", "SAP FI"],
    logica: "Factura con fecha anterior a la orden de compra.",
    variables: ["oc", "factura", "fechaFactura", "fechaOC"]
  },

  {
    codigo: "KPI005",
    nombre: "OC regularizadas no identificadas",
    categoria: "Compras",
    descripcion: "Analizar facturas emitidas antes de la OC no identificadas como regularización.",
    riesgoInherente: "Alto",
    normativa: ["COSO"],
    fuenteDatos: ["SAP MM"],
    logica: "Factura previa a OC sin marca de regularización.",
    variables: ["oc", "factura", "usuario"]
  },

  {
    codigo: "KPI006",
    nombre: "OC pendientes de recepción",
    categoria: "Compras",
    descripcion: "Identificar órdenes de compra con cantidades pendientes de entrega con antigüedad.",
    riesgoInherente: "Medio",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM"],
    logica: "OC con saldo pendiente mayor a X días.",
    variables: ["oc", "cantidadPendiente", "fecha"]
  },

  {
    codigo: "KPI007",
    nombre: "Proveedores con deuda coactiva",
    categoria: "Proveedores",
    descripcion: "Identificar proveedores con deuda pendiente y en cobranza coactiva en SUNAT.",
    riesgoInherente: "Crítico",
    normativa: ["Compliance", "LAFT"],
    fuenteDatos: ["SUNAT"],
    logica: "Proveedor con estado 'Deuda Coactiva' en SUNAT.",
    variables: ["ruc", "estadoSunat"]
  },

  {
    codigo: "KPI008",
    nombre: "Bienes/servicios recibidos sin factura",
    categoria: "Compras",
    descripcion: "Analizar bienes/servicios recibidos sin factura registrada.",
    riesgoInherente: "Alto",
    normativa: ["COSO"],
    fuenteDatos: ["SAP MM", "SAP FI"],
    logica: "Recepción registrada sin documento financiero.",
    variables: ["oc", "recepcion", "factura"]
  },

  {
    codigo: "KPI009",
    nombre: "Pagos duplicados",
    categoria: "Finanzas",
    descripcion: "Identificar pagos duplicados por monto, fecha y proveedor.",
    riesgoInherente: "Crítico",
    normativa: ["ISA 240"],
    fuenteDatos: ["SAP FI"],
    logica: "Pagos con mismo monto, fecha y proveedor.",
    variables: ["monto", "proveedor", "fecha"]
  },

  {
    codigo: "KPI010",
    nombre: "Pagos adelantados",
    categoria: "Finanzas",
    descripcion: "Verificar pagos realizados previo a su fecha de vencimiento.",
    riesgoInherente: "Medio",
    normativa: ["Finanzas"],
    fuenteDatos: ["SAP FI"],
    logica: "Pago con fecha anterior al vencimiento.",
    variables: ["fechaPago", "fechaVencimiento"]
  },

  {
    codigo: "KPI011",
    nombre: "Pagos no compensados",
    categoria: "Finanzas",
    descripcion: "Identificar pagos realizados que no han sido compensados con su factura.",
    riesgoInherente: "Medio",
    normativa: ["Finanzas"],
    fuenteDatos: ["SAP FI"],
    logica: "Pago sin documento de compensación.",
    variables: ["pago", "factura"]
  },

  {
    codigo: "KPI012",
    nombre: "Condición de pago inconsistente",
    categoria: "Compras",
    descripcion: "Diferencias entre condición de crédito del maestro y facturas.",
    riesgoInherente: "Medio",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM", "SAP FI"],
    logica: "Condición de pago distinta entre maestro y factura.",
    variables: ["proveedor", "condicionMaestro", "condicionFactura"]
  },

  {
    codigo: "KPI013",
    nombre: "Pagos sin sustento",
    categoria: "Finanzas",
    descripcion: "Pagos enviados a cuenta de gastos sin documento tributario.",
    riesgoInherente: "Crítico",
    normativa: ["ISA 240"],
    fuenteDatos: ["SAP FI"],
    logica: "Pago registrado sin factura/boleta.",
    variables: ["pago", "cuentaContable"]
  },

  {
    codigo: "KPI014",
    nombre: "Conflicto de interés entre empleados",
    categoria: "RRHH",
    descripcion: "Identificar vínculos familiares entre trabajadores.",
    riesgoInherente: "Alto",
    normativa: ["Ética", "Compliance"],
    fuenteDatos: ["SAP HR"],
    logica: "Coincidencia de apellidos, direcciones o teléfonos.",
    variables: ["dni", "direccion", "telefono"]
  },

  {
    codigo: "KPI015",
    nombre: "Derechohabientes repetidos",
    categoria: "RRHH",
    descripcion: "Asegurar que un derechohabiente no esté asignado a múltiples colaboradores.",
    riesgoInherente: "Medio",
    normativa: ["RRHH"],
    fuenteDatos: ["SAP HR"],
    logica: "Mismo DNI de derechohabiente en más de un colaborador.",
    variables: ["dniHijo", "dniColaborador"]
  },

  {
    codigo: "KPI016",
    nombre: "Colaboradores menores de edad",
    categoria: "RRHH",
    descripcion: "Asegurar contratación de personal mayor a 18 años.",
    riesgoInherente: "Crítico",
    normativa: ["Laboral"],
    fuenteDatos: ["SAP HR"],
    logica: "Edad < 18 años.",
    variables: ["fechaNacimiento"]
  },

  {
    codigo: "KPI017",
    nombre: "Usuarios SAP de personal cesado",
    categoria: "SAP",
    descripcion: "Verificar si los usuarios SAP han sido dados de baja oportunamente.",
    riesgoInherente: "Crítico",
    normativa: ["Seguridad TI"],
    fuenteDatos: ["SAP BASIS", "SAP HR"],
    logica: "Usuario activo con colaborador cesado.",
    variables: ["usuarioSAP", "fechaCese"]
  },

  {
    codigo: "KPI018",
    nombre: "Concentración de funciones",
    categoria: "SAP",
    descripcion: "Identificar usuarios con privilegios no compatibles.",
    riesgoInherente: "Crítico",
    normativa: ["Segregación de funciones"],
    fuenteDatos: ["SAP BASIS"],
    logica: "Usuario con roles incompatibles asignados.",
    variables: ["usuario", "roles"]
  },

  {
    codigo: "KPI019",
    nombre: "Cuentas bancarias similares",
    categoria: "Fraude",
    descripcion: "Comparación de cuentas bancarias entre proveedores y colaboradores.",
    riesgoInherente: "Crítico",
    normativa: ["Fraude"],
    fuenteDatos: ["SAP FI", "SAP HR"],
    logica: "Coincidencia de cuentas bancarias.",
    variables: ["cuentaProveedor", "cuentaEmpleado"]
  },

  {
    codigo: "KPI020",
    nombre: "LAFT",
    categoria: "Compliance",
    descripcion: "Verificar denuncias/noticias de proveedores relacionadas a LAFT.",
    riesgoInherente: "Crítico",
    normativa: ["LAFT"],
    fuenteDatos: ["SUNAT", "Listas restrictivas"],
    logica: "Proveedor listado en listas de riesgo.",
    variables: ["ruc"]
  },

  {
    codigo: "KPI021",
    nombre: "Compras descentralizadas",
    categoria: "Compras",
    descripcion: "Analizar la cantidad de órdenes de compra descentralizadas.",
    riesgoInherente: "Medio",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM"],
    logica: "OC creadas fuera del flujo estándar.",
    variables: ["oc", "usuario", "centro"]
  },

  {
    codigo: "KPI022",
    nombre: "Correlatividad de facturas",
    categoria: "Compras",
    descripcion: "Análisis de concentración de proveedores por correlación de facturas.",
    riesgoInherente: "Alto",
    normativa: ["Fraude"],
    fuenteDatos: ["SAP FI"],
    logica: "Facturas con secuencia sospechosa.",
    variables: ["factura", "fecha", "proveedor"]
  },

  {
    codigo: "KPI023",
    nombre: "Direcciones empleados vs proveedores",
    categoria: "Fraude",
    descripcion: "Comparación de direcciones y teléfonos entre proveedores y empleados.",
    riesgoInherente: "Crítico",
    normativa: ["Fraude"],
    fuenteDatos: ["SAP HR", "SAP MM"],
    logica: "Coincidencia de dirección o teléfono.",
    variables: ["direccion", "telefono"]
  },

  {
    codigo: "KPI024",
    nombre: "OC con un solo liberador",
    categoria: "Compras",
    descripcion: "Análisis de cantidad de aprobadores en estrategias de liberación.",
    riesgoInherente: "Medio",
    normativa: ["Segregación de funciones"],
    fuenteDatos: ["SAP MM"],
    logica: "OC aprobada por un único liberador.",
    variables: ["oc", "liberadores"]
  },

  {
    codigo: "KPI025",
    nombre: "Proveedores con pocos días de creación",
    categoria: "Proveedores",
    descripcion: "Comparación de fechas de creación: SUNAT vs SAP.",
    riesgoInherente: "Alto",
    normativa: ["Fraude"],
    fuenteDatos: ["SUNAT", "SAP MM"],
    logica: "Proveedor creado recientemente en SUNAT y SAP.",
    variables: ["fechaSunat", "fechaSAP"]
  },

  {
    codigo: "KPI026",
    nombre: "Sanciones con el Estado",
    categoria: "Compliance",
    descripcion: "Verificar existencia de sanciones de proveedores con el Estado.",
    riesgoInherente: "Crítico",
    normativa: ["Compliance"],
    fuenteDatos: ["OSCE", "SUNAT"],
    logica: "Proveedor con sanciones vigentes.",
    variables: ["ruc"]
  },

  {
    codigo: "KPI027",
    nombre: "Sanciones medioambientales",
    categoria: "Compliance",
    descripcion: "Verificar existencia de sanciones medioambientales.",
    riesgoInherente: "Alto",
    normativa: ["Ambiental"],
    fuenteDatos: ["OEFA"],
    logica: "Proveedor con sanciones ambientales.",
    variables: ["ruc"]
  },

  {
    codigo: "KPI028",
    nombre: "Fraccionamiento de OC",
    categoria: "Compras",
    descripcion: "Verificar la existencia de posibles OC fraccionadas.",
    riesgoInherente: "Crítico",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM"],
    logica: "Múltiples OC pequeñas para evitar liberación.",
    variables: ["oc", "monto", "fecha"]
  },

  {
    codigo: "KPI029",
    nombre: "Grupo económico de proveedores",
    categoria: "Proveedores",
    descripcion: "Comparación de direcciones, teléfonos y representantes legales.",
    riesgoInherente: "Alto",
    normativa: ["Fraude"],
    fuenteDatos: ["SUNAT", "SAP MM"],
    logica: "Proveedores relacionados entre sí.",
    variables: ["direccion", "telefono", "representante"]
  },

  {
    codigo: "KPI030",
    nombre: "Proveedores observados por SUNAT",
    categoria: "Proveedores",
    descripcion: "Análisis de proveedores observados por SUNAT.",
    riesgoInherente: "Crítico",
    normativa: ["Compliance"],
    fuenteDatos: ["SUNAT"],
    logica: "Proveedor con estado 'Observado'.",
    variables: ["ruc"]
  },

  {
    codigo: "KPI031",
    nombre: "Ley de Benford",
    categoria: "Fraude",
    descripcion: "Verificar cumplimiento de la Ley de Benford en facturas y OC.",
    riesgoInherente: "Crítico",
    normativa: ["Fraude"],
    fuenteDatos: ["SAP FI", "SAP MM"],
    logica: "Distribución de dígitos no cumple Benford.",
    variables: ["monto"]
  },

  {
    codigo: "KPI032",
    nombre: "Primera factura del proveedor",
    categoria: "Proveedores",
    descripcion: "Análisis de registro de primera factura con proveedores.",
    riesgoInherente: "Medio",
    normativa: ["Compras"],
    fuenteDatos: ["SAP FI"],
    logica: "Primera factura con monto elevado o irregular.",
    variables: ["factura", "fecha", "monto"]
  },

  {
    codigo: "KPI033",
    nombre: "Factura mayor a la OC",
    categoria: "Compras",
    descripcion: "Consistencia de montos: análisis de órdenes de compra y facturas.",
    riesgoInherente: "Crítico",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM", "SAP FI"],
    logica: "Factura > monto OC.",
    variables: ["oc", "factura", "monto"]
  },

  {
    codigo: "KPI034",
    nombre: "Conflicto de interés proveedor–empleado",
    categoria: "Fraude",
    descripcion: "Comparación de representantes legales vs empleados.",
    riesgoInherente: "Crítico",
    normativa: ["Fraude"],
    fuenteDatos: ["SUNAT", "SAP HR"],
    logica: "Coincidencia de DNI, dirección o teléfono.",
    variables: ["dni", "direccion", "telefono"]
  },

  {
    codigo: "KPI035",
    nombre: "Registro de facturas antiguas",
    categoria: "Compras",
    descripcion: "Revisar diferencia entre fecha de emisión y fecha de registro.",
    riesgoInherente: "Medio",
    normativa: ["Compras"],
    fuenteDatos: ["SAP FI"],
    logica: "Factura registrada con antigüedad excesiva.",
    variables: ["fechaFactura", "fechaRegistro"]
  },

  {
    codigo: "KPI036",
    nombre: "Uso indebido de OC",
    categoria: "Compras",
    descripcion: "Verificar antigüedad de facturas respecto a la OC.",
    riesgoInherente: "Alto",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM", "SAP FI"],
    logica: "Factura con fecha incompatible con OC.",
    variables: ["fechaFactura", "fechaOC"]
  },

  {
    codigo: "KPI037",
    nombre: "Facturas en posiciones eliminadas",
    categoria: "Compras",
    descripcion: "Verificar registro de facturas a posiciones eliminadas.",
    riesgoInherente: "Crítico",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM"],
    logica: "Factura asociada a posición eliminada.",
    variables: ["oc", "posicion"]
  },

 {
  codigo: "KPI038",
  nombre: "Compras sin orden de compra (FICO)",
  categoria: "Finanzas",
  descripcion: "Análisis de facturas no vinculadas a órdenes de compra, lo cual puede indicar compras irregulares, saltos de control o uso indebido del flujo FICO.",
  riesgoInherente: "Crítico",
  normativa: ["ISA 240", "COSO", "Control Interno"],
  fuenteDatos: ["SAP FI", "SAP MM"],
  logica: "Factura registrada en SAP FI sin referencia a una orden de compra válida en SAP MM (campo EBELN vacío o inconsistente).",
  variables: ["factura", "monto", "fecha", "proveedor", "oc"]
}

  {
    codigo: "KPI038",
    nombre: "Compras sin orden de compra (FICO)",
    categoria: "Finanzas",
    descripcion: "Análisis de facturas no vinculadas a órdenes de compra.",
    riesgoInherente: "Crítico",
    normativa: ["ISA 240", "COSO"],
    fuenteDatos: ["SAP FI"],
    logica: "Factura registrada sin referencia a OC.",
    variables: ["factura", "monto", "fecha"]
  },

  {
    codigo: "KPI039",
    nombre: "OC y factura con moneda diferente",
    categoria: "Compras",
    descripcion: "Verificar inconsistencias de moneda entre OC y factura.",
    riesgoInherente: "Medio",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM", "SAP FI"],
    logica: "Moneda de factura distinta a moneda de OC.",
    variables: ["oc", "factura", "moneda"]
  },

  {
    codigo: "KPI040",
    nombre: "Pagos duplicados REGUH",
    categoria: "Finanzas",
    descripcion: "Identificar pagos duplicados usando tabla REGUH.",
    riesgoInherente: "Crítico",
    normativa: ["ISA 240"],
    fuenteDatos: ["SAP FI"],
    logica: "Registros duplicados en REGUH por monto y proveedor.",
    variables: ["monto", "proveedor", "fecha"]
  },

  {
    codigo: "KPI041",
    nombre: "Inventario en tránsito con antigüedad",
    categoria: "Logística",
    descripcion: "Revisar stock en tránsito sin recepción con antigüedad.",
    riesgoInherente: "Medio",
    normativa: ["Logística"],
    fuenteDatos: ["SAP MM"],
    logica: "Material en tránsito > X días.",
    variables: ["material", "fechaEnvio", "fechaActual"]
  },

  {
    codigo: "KPI042",
    nombre: "Facturas con fecha futura",
    categoria: "Finanzas",
    descripcion: "Identificar facturas con fecha de emisión posterior a la fecha de registro.",
    riesgoInherente: "Crítico",
    normativa: ["ISA 240"],
    fuenteDatos: ["SAP FI"],
    logica: "Fecha de factura > fecha de registro.",
    variables: ["fechaFactura", "fechaRegistro"]
  },

  {
    codigo: "KPI043",
    nombre: "Documentos con alto valor en caja chica",
    categoria: "Caja Chica",
    descripcion: "Identificar documentos con importes iguales o superiores a 700.",
    riesgoInherente: "Alto",
    normativa: ["Control Interno"],
    fuenteDatos: ["SAP FI"],
    logica: "Monto >= 700 en caja chica.",
    variables: ["monto", "fecha", "proveedor"]
  },

  {
    codigo: "KPI044",
    nombre: "Proveedores de caja chica",
    categoria: "Caja Chica",
    descripcion: "Identificar proveedores con compras significativas en caja chica.",
    riesgoInherente: "Medio",
    normativa: ["Control Interno"],
    fuenteDatos: ["SAP FI"],
    logica: "Proveedor con alta frecuencia de compras en caja chica.",
    variables: ["proveedor", "monto", "fecha"]
  },

  {
    codigo: "KPI045",
    nombre: "OC con salto de liberador",
    categoria: "Compras",
    descripcion: "Identificar OC que no siguen la secuencia de liberación establecida.",
    riesgoInherente: "Crítico",
    normativa: ["Segregación de funciones"],
    fuenteDatos: ["SAP MM"],
    logica: "Liberador 2 aprueba sin aprobación de liberador 1.",
    variables: ["oc", "liberadores"]
  },

  {
    codigo: "KPI046",
    nombre: "% de concentración de proveedor",
    categoria: "Compras",
    descripcion: "Identificar concentración de proveedor para un mismo SKU.",
    riesgoInherente: "Alto",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM"],
    logica: "Proveedor con >X% de participación en un SKU.",
    variables: ["proveedor", "sku", "cantidad"]
  },

  {
    codigo: "KPI047",
    nombre: "Pagos atrasados",
    categoria: "Finanzas",
    descripcion: "Identificar pagos realizados después de su fecha de vencimiento.",
    riesgoInherente: "Medio",
    normativa: ["Finanzas"],
    fuenteDatos: ["SAP FI"],
    logica: "Fecha de pago > fecha de vencimiento.",
    variables: ["fechaPago", "fechaVencimiento"]
  },

  {
    codigo: "KPI048",
    nombre: "Proveedores con pocos trabajadores",
    categoria: "Proveedores",
    descripcion: "Identificar proveedores con pocos trabajadores según SUNAT.",
    riesgoInherente: "Alto",
    normativa: ["Fraude"],
    fuenteDatos: ["SUNAT"],
    logica: "Proveedor con < X trabajadores.",
    variables: ["ruc", "numTrabajadores"]
  },

  {
    codigo: "KPI049",
    nombre: "Compras a proveedores dados de baja",
    categoria: "Proveedores",
    descripcion: "Identificar compras a proveedores dados de baja por SUNAT.",
    riesgoInherente: "Crítico",
    normativa: ["Compliance"],
    fuenteDatos: ["SUNAT", "SAP FI"],
    logica: "Proveedor con estado 'Baja' en SUNAT.",
    variables: ["ruc", "estadoSunat"]
  },

  {
    codigo: "KPI050",
    nombre: "Ingresos SAP con usuario de personal cesado",
    categoria: "SAP",
    descripcion: "Identificar ingresos al sistema SAP posteriores al cese del empleado.",
    riesgoInherente: "Crítico",
    normativa: ["Seguridad TI"],
    fuenteDatos: ["SAP BASIS", "SAP HR"],
    logica: "Usuario SAP activo después del cese.",
    variables: ["usuarioSAP", "fechaCese", "fechaIngreso"]
  },

  {
    codigo: "KPI051",
    nombre: "Empleados con pensión alimentaria morosa (REDAM)",
    categoria: "RRHH",
    descripcion: "Identificar empleados registrados en REDAM.",
    riesgoInherente: "Medio",
    normativa: ["Legal"],
    fuenteDatos: ["REDAM", "SAP HR"],
    logica: "Empleado listado en REDAM.",
    variables: ["dni"]
  },

  {
    codigo: "KPI052",
    nombre: "Empleados con deudas judiciales (REDEJUM)",
    categoria: "RRHH",
    descripcion: "Identificar empleados registrados en REDEJUM.",
    riesgoInherente: "Medio",
    normativa: ["Legal"],
    fuenteDatos: ["REDEJUM", "SAP HR"],
    logica: "Empleado listado en REDEJUM.",
    variables: ["dni"]
  },

  {
    codigo: "KPI053",
    nombre: "Usuario SAP sin personal asignado",
    categoria: "SAP",
    descripcion: "Identificar usuarios SAP sin código de personal asignado.",
    riesgoInherente: "Alto",
    normativa: ["Seguridad TI"],
    fuenteDatos: ["SAP BASIS"],
    logica: "Usuario SAP sin vínculo a colaborador.",
    variables: ["usuarioSAP"]
  },

  {
    codigo: "KPI054",
    nombre: "Existencias enviadas a cuenta de gastos",
    categoria: "Finanzas",
    descripcion: "Pagos registrados contablemente en cuenta de gastos sin sustento.",
    riesgoInherente: "Crítico",
    normativa: ["ISA 240"],
    fuenteDatos: ["SAP FI"],
    logica: "Movimiento contable directo a gasto sin documento.",
    variables: ["cuentaContable", "monto"]
  },

  {
    codigo: "KPI055",
    nombre: "Días de atención de SOLPES",
    categoria: "Compras",
    descripcion: "Calcular los días entre liberación de SOLPE y creación de OC.",
    riesgoInherente: "Medio",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM"],
    logica: "Fecha OC - Fecha liberación SOLPE.",
    variables: ["fechaSolpe", "fechaOC"]
  },

  {
    codigo: "KPI056",
    nombre: "SOLPES no atendidas",
    categoria: "Compras",
    descripcion: "Verificar SOLPEs liberadas no atendidas.",
    riesgoInherente: "Alto",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM"],
    logica: "SOLPE liberada sin OC asociada.",
    variables: ["solpe", "fecha"]
  },

  {
    codigo: "KPI057",
    nombre: "SOLPE según nivel de urgencia",
    categoria: "Compras",
    descripcion: "Mostrar cantidad de SOLPEs por indicador de urgencia.",
    riesgoInherente: "Medio",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM"],
    logica: "Clasificación por urgencia.",
    variables: ["solpe", "urgencia"]
  },

  {
    codigo: "KPI058",
    nombre: "Concentración de proveedor por SKU",
    categoria: "Compras",
    descripcion: "Identificar % de concentración de proveedor para un SKU.",
    riesgoInherente: "Alto",
    normativa: ["Compras"],
    fuenteDatos: ["SAP MM"],
    logica: "Proveedor dominante en SKU.",
    variables: ["proveedor", "sku", "cantidad"]
  },

  {
    codigo: "KPI059",
    nombre: "Pagos registrados en cuenta de gastos",
    categoria: "Finanzas",
    descripcion: "Pagos registrados contablemente en cuenta de gastos sin intermediación de CxP.",
    riesgoInherente: "Crítico",
    normativa: ["ISA 240"],
    fuenteDatos: ["SAP FI"],
    logica: "Pago directo a gasto sin factura.",
    variables: ["cuentaContable", "monto"]
  },

  {
    codigo: "KPI060",
    nombre: "Conflicto de interés proveedor–empleado (SUNAT)",
    categoria: "Fraude",
    descripcion: "Comparación de representantes legales vs empleados.",
    riesgoInherente: "Crítico",
    normativa: ["Fraude"],
    fuenteDatos: ["SUNAT", "SAP HR"],
    logica: "Coincidencia de DNI, dirección o teléfono.",
    variables: ["dni", "direccion", "telefono"]
  }

];


