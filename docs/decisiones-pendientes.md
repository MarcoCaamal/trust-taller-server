# Decisiones pendientes (PRD)

Este documento lista ambigüedades detectadas en el PRD y por qué deben definirse. No agrega reglas de negocio nuevas; solo aclara decisiones técnicas/operativas necesarias.

## Identidad, multi-tenant y seguridad
- Zona horaria por taller: define si fechas/expiraciones se calculan en UTC o local; evita expiraciones incorrectas y reportes inconsistentes. Propuesta: almacenar en UTC y mostrar en zona horaria del taller configurable (default America/Mexico_City).
- Política de autenticación (JWT/refresh/expiración): define sesiones, caducidad y renovación segura; evita huecos de seguridad y UX erratica. Propuesta: JWT de acceso corto (15-30 min) + refresh token rotativo (7-30 dias) con revocacion.
- Matriz minima de permisos por rol: aclara qué puede hacer Admin vs Usuario por modulo; evita accesos inconsistentes y facilita pruebas. Propuesta: Admin gestiona usuarios/catalogos/ajustes; Usuario gestiona ordenes, evidencias y checklists.
- Enforcement de aislamiento multi-tenant: define cómo se aplica el `tenant_id` en queries; evita fugas de datos. Propuesta: capa de repositorios con scoping obligatorio y middleware que inyecta tenant.
- Politica de bloqueo ante intentos invalidos: define limite de intentos y respuesta; reduce riesgo de abuso. Propuesta: rate limit por IP/cuenta y backoff progresivo.

## Ordenes y flujo operativo
- Formato y unicidad del folio: define estructura y reinicio; mejora busqueda y trazabilidad. Propuesta: folio por taller con secuencia incremental y prefijo (ej. TT-000123).
- Campos minimos obligatorios al crear orden: aclara qué datos son requeridos; evita ordenes incompletas. Propuesta: cliente + vehiculo + fecha de recepcion + estatus inicial.
- Alcance exacto de "datos base" editables: define qué campos se pueden modificar en Recibido/En revision. Propuesta: cliente, vehiculo, notas internas y fecha promesa.
- Manejo de concurrencia en edicion: define si hay versionado o locks; evita sobrescrituras silenciosas. Propuesta: versionado optimista con `updated_at`/`version` y rechazo si hay conflicto.
- Criterio exacto de "atrasada": define si se evalua por fecha o por fecha+hora; evita indicadores inconsistentes. Propuesta: comparar datetime completo contra fecha promesa.

## Conceptos, precios y catalogos
- Moneda y regla de redondeo: define precision del total; evita discrepancias por centavos. Propuesta: MXN con redondeo a 2 decimales, almacenar en centavos (int) para evitar floats.
- Validaciones numericas: define limites para cantidad/precio (ej. no negativos); evita datos invalidos. Propuesta: cantidad > 0, precio >= 0, subtotal >= 0.
- Edicion de conceptos con aprobacion del cliente: define qué pasa si el cliente rechaza; evita contradicciones. Propuesta: rechazo desbloquea edicion y requiere nuevo envio.
- Politica de desactivacion de catalogos: define cómo se muestran items historicos; evita romper ordenes previas. Propuesta: soft-delete y ocultar solo en autocompletar, nunca borrar snapshots.
- Criterio para marcar "Editado": define qué cambios activan el indicador; asegura consistencia UI/BE. Propuesta: cualquier cambio en nombre/descripcion/unidad/precio/cantidad.

## Evidencias, links publicos y visibilidad
- Limites de evidencias: define cantidad maxima y si es por orden o por checklist; controla costos. Propuesta: limite por orden + limite por checklist (ej. 20 orden, 5 checklist).
- Tamano maximo y formatos de imagen: define tipos permitidos; evita fallas en moviles y abuso. Propuesta: JPEG/PNG/WEBP, max 5 MB por imagen, compresion server-side.
- Almacenamiento de imagenes: define si es local o S3/externo; impacta backups y serving. Propuesta: almacenamiento en S3-compatible con URLs firmadas y cache CDN opcional.
- Regeneracion del token publico: define si se permite antes de expirar y bajo qué condicion; evita confusion operativa. Propuesta: permitir siempre, invalida token previo sin extender expiracion.
- Campos visibles al cliente: define qué datos internos se ocultan; protege privacidad. Propuesta: ocultar notas internas, datos del usuario interno y metadatos operativos.

## Reportes y metricas
- Rango de fechas y zona horaria en reportes: define si el rango usa created_at/delivered_at; evita KPIs inconsistentes. Propuesta: usar created_at para volumen y delivered_at para tiempos, siempre en TZ del taller.
- Inclusion de canceladas en promedios: define regla unica (excluir/separar); evita metricas enganiosas. Propuesta: excluir canceladas de tiempos promedio y mostrar apartado separado.
- Definicion de "semana": define calendario (ISO vs domingo-sabado); mejora comparabilidad. Propuesta: semana ISO (lunes-domingo).
