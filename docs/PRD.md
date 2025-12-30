---
document: "Product Requirements Document (PRD)"
product: "Trust Taller"
version: "1.0"
date: "2025-12-26"
author: "Marco C."
---

# PRD - Trust Taller (SaaS)

## 1. Resumen del producto

Trust Taller es una plataforma (web / mobile-first) para talleres de motos que permite registrar ordenes, documentar evidencia (fotos), gestionar estatus del servicio y compartir un enlace publico para que el cliente vea el avance con timeline completo, conceptos (servicios e insumos) y total.

Propuesta de valor (taller):
- Crear y administrar ordenes con friccion minima.
- Reducir mensajes repetitivos de seguimiento (auto-consulta del cliente).
- Aumentar confianza y reducir disputas: evidencia + conceptos + total claros.

Propuesta de valor (cliente):
- Transparencia del proceso: estatus, timeline, evidencias, conceptos y total.

## 2. Problematica

Problemas actuales (hipotesis):
- Seguimiento informal (libreta/WhatsApp), dificil de auditar.
- Clientes preguntan constantemente "¿como va mi moto?".
- Disputas por cobros y por "que se hizo".

Oportunidad:
Un flujo minimo centrado en evidencia + estatus + total reduce el costo operativo del taller y mejora la confianza.

## 3. Objetivos

### Objetivos del negocio
- Que los talleres adopten el sistema para su operacion diaria.
- Reducir tiempo administrativo y friccion de comunicacion.
- Aumentar retencion del taller (valor recurrente).
- Aumentar el volumen de trabajo gestionado en Trust Taller (mas ordenes por taller/semana).

### Objetivos del usuario (taller)
- Crear una orden en segundos.
- Definir cobro durante revision sin complicacion.
- Compartir link por WhatsApp con 1 click.
- Tener control operativo: asignacion, prioridades y visibilidad del trabajo.

### Objetivos del usuario (cliente)
- Consultar el avance sin preguntar.

## 4. No objetivos (fuera de alcance MVP)

- SuperAdmin / panel global de SaaS.
- Pagos, anticipos, facturacion.
- Inventario avanzado (compras, entradas/salidas, movimientos, lotes/series, multi-almacen) y control de stock estricto.
- Aprobacion formal del cliente (cotizacion/aceptacion).
- Multi-sucursal.
- Reportes avanzados.

## 5. Usuarios y roles

### Taller
- Admin del taller: configura taller, gestiona usuarios (si se incluye), crea y administra ordenes.
- Mecanico/Operador: actualiza estatus y sube evidencia (segun permisos).
- Recepcionista: captura ordenes, clientes y asignaciones (segun permisos).

### Cliente (sin cuenta)
- Accede por enlace publico con token a la vista de su orden.

## 6. Supuestos y reglas clave (decisiones actuales)

1. Registro self-serve: el taller se registra y entra a su workspace.
2. Estatus final: ultimo estatus es Entregado (no hay "Cerrado/Finalizado").
3. Link publico:
   - Se genera al crear la orden (token fijo).
   - Tras pasar a Entregado, expira en 30 dias (delivered_at + 30d).
   - Tras pasar a Cancelado, expira en 30 dias (canceled_at + 30d).
4. Vista cliente completa: muestra estatus, timeline, evidencias, conceptos y total.
5. Conceptos (cobro):
   - Solo se editan en En revision.
   - En En reparacion / Listo / Entregado / Cancelado la orden es solo lectura.
   - Cambios posteriores implican nueva orden.
6. Inventario basico de insumos (catalogo/autocompletar): el taller mantiene un catalogo de insumos/refacciones (nombre, unidad, precio sugerido) para seleccionarlos al capturar conceptos y que se autocompleten los campos. No es un inventario de stock y, por ahora, los conceptos no quedan ligados al catalogo (se guarda un "snapshot" del texto y precio en la orden).

## 7. Alcance del MVP (features)

### 7.1 Onboarding / Workspace
- Registro de taller (self-serve).
- Login.
- Workspace con modulos minimos: Ordenes, Clientes/Vehiculos, Ajustes.

### 7.2 Ordenes
- Crear orden (check-in) con token.
- Ver detalle de orden (interno) y timeline.
- Vista publica (cliente) por token.

### 7.3 Estatus (flujo y definiciones)

Flujo permitido (solo hacia adelante):
1. Recibido
2. En revision
3. En reparacion
4. Listo
5. Entregado

Salida alternativa: Cancelado (desde cualquier estatus; congela la orden).

Definiciones:
- Recibido: se registro la orden y la moto esta en el taller.
- En revision: diagnostico/inspeccion; aqui se definen conceptos y total.
- En reparacion: ejecucion del trabajo; conceptos bloqueados.
- Listo: trabajo concluido; orden congelada.
- Entregado: moto entregada; orden congelada; se guarda delivered_at; inicia expiracion del link.
- Cancelado: la orden se detuvo; queda congelada y se guarda canceled_at y un motivo de cancelacion.

### 7.4 Evidencias (fotos)
- Subida de imagenes con compresion/optimizacion.
- Permitido solo en: Recibido, En revision, En reparacion.
- No permitido en: Listo, Entregado, Cancelado.

### 7.5 Conceptos y total
- CRUD de conceptos unicamente en En revision.
- Tipos de concepto:
  1. Servicio (mano de obra)
  2. Insumo/refaccion vendida por el taller
  3. Insumo/refaccion aportada por el cliente (visible, puede ser $0)
- Total = suma de conceptos cobrables (MVP sin impuestos/descuentos).

### 7.6 Catalogo de insumos (autocompletar)

Objetivo: acelerar la captura de conceptos cuando el taller proporciona aceite/refacciones, evitando escribir a mano y estandarizando nombres/precios sugeridos.

Incluye (MVP):
- CRUD de catalogo de insumos: nombre, unidad, precio de venta sugerido; opcional: SKU/codigo.
- Busqueda/seleccion del insumo al crear un concepto tipo Insumo/refaccion vendida por el taller.
- Al seleccionar un insumo, autocompletar descripcion/unidad/precio sugerido en la linea de concepto.
- La linea autocompletada se puede editar (nombre/descr./unidad/precio/cantidad) solo en En revision.
- Si se edita una linea autocompletada, se marca como Editado.
- La linea de concepto puede ser manual (sin seleccion).
- Los conceptos guardan un snapshot (texto/precio/cantidad) y no dependen de cambios futuros del catalogo.

No incluye (MVP):
- Existencias/stock, compras, entradas/salidas, kardex, costos, lotes/series, multi-almacen.

### 7.7 Compartir por WhatsApp
- Generar mensaje prellenado con link a la orden.
- Click-to-chat (wa.me) usando el telefono del cliente.

### 7.8 Vista publica del cliente
- Muestra: estatus actual + timeline (todas las fases), evidencias, conceptos y total.
- Si la orden esta Cancelada, el cliente ve el detalle completo con una etiqueta visible de Cancelado (hasta que expire el link).
- Expiracion: si expirado -> pantalla "Enlace expirado. Contacta al taller".

### 7.9 Checklist de recepcion y entrega

Objetivo: estandarizar la inspeccion inicial y la entrega para aumentar confianza y reducir disputas.

Incluye (MVP):
- Checklist de recepcion por orden (odometro/km, nivel de gasolina, accesorios, danos visibles, notas y fotos asociadas).
- Checklist de entrega por orden (confirmacion de entrega, notas y fotos finales).
- Plantillas fijas por defecto (no personalizables por taller en esta fase).

### 7.10 Notas internas vs notas publicas

Incluye (MVP):
- Notas por orden con bandera de visibilidad: Interna (solo taller) o Publica (visible en link del cliente).

### 7.11 Asignacion de ordenes y tablero Kanban interno

Incluye (MVP):
- Asignar una orden a un responsable (mecanico) y opcionalmente ayudantes.
- Vista tipo Kanban con columnas fijas que coinciden con los estatus del flujo principal:
  Recibido / En revision / En reparacion / Listo / Entregado / Cancelado
- Mover una tarjeta entre columnas actualiza el estatus respetando reglas (forward-only y cancelacion).

### 7.12 Fecha promesa y alertas de atraso

Incluye (MVP):
- Campo fecha promesa (promesa de entrega) por orden.
- Indicador de "atrasada" si se excede la promesa y no esta Entregada/Cancelada.

### 7.13 Notificaciones por estatus (plantillas)

Incluye (MVP):
- Plantillas configurables por taller para mensajes de WhatsApp (por estatus).
- Boton para copiar mensaje y abrir WhatsApp (sin API de envio en MVP).

### 7.14 Reportes operativos basicos

Incluye (MVP):
- Ordenes por semana (y por estatus).
- Tiempo promedio por fase (Recibido -> Entregado) y tiempos por estatus.
- % cancelaciones.
- % ordenes entregadas a tiempo vs fecha promesa (si se usa).

### 7.15 Catalogo de servicios (autocompletar)

Incluye (MVP):
- CRUD de catalogo de servicios: nombre/descripcion, precio sugerido, duracion estimada (opcional).
- Autocompletar al crear conceptos tipo Servicio (editable solo en En revision) y marcado "Editado" si se modifica.
- Snapshot en la orden (no depende de cambios futuros del catalogo).

### 7.16 Aprobacion del cliente (opcional)

Incluye (MVP opcional / configurable):
- En el link del cliente, permitir Aprobar/Rechazar la propuesta de conceptos cuando la orden esta en En revision.
- Registrar fecha/hora y comentario.
- No incluye pagos.

## 8. Requerimientos funcionales (RF)

> Todos los requerimientos siguientes cumplen con la anatomía: ID, Título, Prioridad, Actor, Descripción (Statement), Pre-condición, Criterios de Aceptación.

### 8.1 Autenticación y Workspace

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-AUTH-001 | Registro self-serve de taller | Alta | Administrador del Taller | El Sistema debe permitir al Administrador del Taller registrar un taller y crear un workspace cuando proporcione los datos requeridos. | El Administrador del Taller no tiene una cuenta activa asociada al correo/usuario. | Se solicita al menos nombre del taller, nombre del administrador, correo y contraseña.<br>Si el correo ya existe, el sistema rechaza el registro.<br>Al finalizar, el sistema crea el workspace del taller y una cuenta de Administrador. |
| RF-AUTH-002 | Inicio de sesión | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller iniciar sesión cuando ingrese credenciales válidas. | Existe una cuenta activa del Usuario del Taller. | Si el correo/usuario y contraseña son correctos, el sistema permite el acceso.<br>Si las credenciales son incorrectas, el sistema rechaza el acceso.<br>Al iniciar sesión, el usuario accede únicamente a su workspace. |
| RF-TEN-001 | Aislamiento de datos por taller | Alta | Sistema | El Sistema debe validar que un Usuario del Taller solo pueda acceder a información del workspace al que pertenece cuando realice cualquier consulta o acción. | El Usuario del Taller ha iniciado sesión. | Un usuario no puede ver órdenes de otro taller.<br>Un usuario no puede editar datos de otro taller.<br>Los intentos de acceso cruzado son rechazados. |

### 8.2 Usuarios y roles

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-USR-001 | Crear usuario del taller | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller crear un usuario para su workspace cuando capture los datos mínimos requeridos. | El Administrador del Taller ha iniciado sesión. | Se permite capturar al menos: nombre, correo y rol.<br>El usuario creado queda asociado al workspace del taller. |
| RF-USR-002 | Desactivar usuario del taller | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller desactivar un usuario cuando el usuario pertenezca a su workspace. | El Administrador del Taller ha iniciado sesión. | Un usuario desactivado no puede iniciar sesión.<br>La desactivación no elimina el historial de acciones del usuario. |
| RF-ROLE-001 | Asignar rol a usuario | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller asignar un rol a un usuario cuando el usuario pertenezca a su workspace. | El Administrador del Taller ha iniciado sesión y el usuario existe. | El sistema permite asignar al menos los roles: Administrador del Taller y Usuario del Taller.<br>El rol asignado se refleja en los permisos del usuario. |
| RF-PERM-001 | Validar permisos por rol | Alta | Sistema | El Sistema debe validar el acceso a funciones según el rol del usuario cuando el usuario intente ejecutar una acción. | El Usuario del Taller ha iniciado sesión. | Acciones de administración (ej. catálogos, plantillas, usuarios) solo están disponibles para Administrador del Taller.<br>Acciones operativas (ej. crear/editar órdenes en estatus permitidos) están disponibles para Usuario del Taller. |

### 8.3 Configuración del taller

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-SET-001 | Actualizar información del taller | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller actualizar la información del taller cuando se encuentre en su workspace. | El Administrador del Taller ha iniciado sesión. | Se permite actualizar al menos: nombre del taller y teléfono.<br>La información actualizada se usa en mensajes de WhatsApp y vistas del cliente. |

### 8.4 Órdenes (creación y consulta interna)

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-ORD-001 | Crear orden en estatus Recibido | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller crear una orden y asignarle el estatus “Recibido” cuando capture los datos mínimos requeridos. | El Usuario del Taller ha iniciado sesión. | La orden se crea con estatus “Recibido”.<br>La orden queda asociada al taller del usuario.<br>El sistema genera un token de link público para la orden.<br>La orden queda visible en el listado del taller. |
| RF-ORD-002 | Consultar listado de órdenes del taller | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller consultar el listado de órdenes cuando se encuentre dentro de su workspace. | El Usuario del Taller ha iniciado sesión. | El listado incluye órdenes del taller únicamente.<br>El listado muestra al menos: folio, estatus, cliente, vehículo, fecha de creación. |
| RF-ORD-003 | Consultar detalle de una orden | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller consultar el detalle de una orden cuando seleccione una orden del listado. | El Usuario del Taller ha iniciado sesión y la orden pertenece a su taller. | Se muestra estatus actual y timeline.<br>Se muestran conceptos, evidencias, notas y checklists (si existen).<br>Si la orden no pertenece al taller, el sistema rechaza el acceso. |
| RF-ORD-004 | Editar datos base de una orden en estatus permitidos | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller editar los datos base de una orden cuando el estatus sea “Recibido” o “En revisión”. | La orden pertenece al taller y está en “Recibido” o “En revisión”. | Se permite editar datos base como: cliente, vehículo y notas internas (si aplica).<br>Si la orden está en “En reparación”, “Listo”, “Entregado” o “Cancelado”, el sistema rechaza la edición. |

### 8.5 Clientes

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-CLI-001 | Crear cliente | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller registrar un cliente cuando capture los datos mínimos requeridos. | El Usuario del Taller ha iniciado sesión. | Se permite capturar al menos: nombre y teléfono.<br>El cliente queda asociado al taller del usuario. |
| RF-CLI-002 | Buscar y seleccionar cliente | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller buscar y seleccionar un cliente cuando capture una orden. | El Usuario del Taller ha iniciado sesión. | La búsqueda permite localizar clientes del taller por nombre o teléfono.<br>El usuario puede seleccionar un cliente encontrado para asociarlo a la orden. |

### 8.6 Vehículos

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-VEH-001 | Registrar vehículo asociado a cliente | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller registrar un vehículo y asociarlo a un cliente cuando capture los datos mínimos requeridos. | Existe un cliente del taller seleccionado. | Se permite capturar al menos: tipo (moto/carro), marca y modelo.<br>El vehículo queda asociado al cliente seleccionado y al taller. |
| RF-VEH-002 | Buscar y seleccionar vehículo del cliente | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller buscar y seleccionar un vehículo existente cuando capture una orden. | Existe un cliente seleccionado. | El sistema muestra únicamente vehículos del cliente seleccionado.<br>El usuario puede seleccionar un vehículo para asociarlo a la orden. |

### 8.7 Estatus (flujo, cancelación y fechas)

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-STS-001 | Cambiar estatus siguiendo flujo permitido | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller cambiar el estatus de una orden cuando el cambio respete el flujo definido. | El Usuario del Taller ha iniciado sesión y la orden pertenece a su taller. | El flujo permitido es: Recibido → En revisión → En reparación → Listo → Entregado.<br>El sistema rechaza cambios que retrocedan estatus (ej. En reparación → En revisión). |
| RF-STS-001.1 | Registrar historial de cambios de estatus | Alta | Sistema | El Sistema debe calcular y registrar un evento en el historial de estatus cuando una orden cambie de estatus. | La orden cambia de estatus. | Cada evento registra: estatus anterior, estatus nuevo, fecha/hora y usuario (si aplica).<br>El historial se muestra como timeline en el detalle de la orden. |
| RF-STS-002 | Cancelar orden desde cualquier estatus | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller cambiar el estatus de una orden a “Cancelado” cuando la orden pertenezca a su taller. | El Usuario del Taller ha iniciado sesión. | Se permite cancelar desde cualquier estatus.<br>Al cancelar, el estatus queda en “Cancelado” y la orden queda solo lectura. |
| RF-STS-002.1 | Guardar fecha de cancelación | Alta | Sistema | El Sistema debe calcular y guardar la fecha/hora de cancelación cuando una orden cambie a estatus “Cancelado”. | La orden cambia a “Cancelado”. | Se guarda canceled_at con fecha/hora.<br>La orden queda solo lectura después de “Cancelado”. |
| RF-STS-003 | Capturar motivo de cancelación (lista fija + Otro) | Alta | Usuario del Taller | El Sistema debe validar que el Usuario del Taller seleccione un motivo de cancelación cuando cambie una orden a “Cancelado”. | El Usuario del Taller ha iniciado sesión y está cancelando una orden. | El sistema muestra una lista fija con los motivos:<br>1. Cliente canceló / ya no procede<br>2. No se autorizó la reparación<br>3. No se consiguió refacción / insumo<br>4. Falla no reproducible / diagnóstico inconcluso<br>5. Error al crear la orden (duplicada)<br>6. Taller no puede atender (capacidad/tiempo)<br>7. Garantía / se canalizó a otro proceso<br>8. Otro<br>Si se elige “Otro”, el sistema permite capturar texto libre.<br>Si no se elige motivo, el sistema rechaza la cancelación. |
| RF-STS-004 | Guardar fecha de entrega | Alta | Sistema | El Sistema debe calcular y guardar la fecha/hora de entrega cuando una orden cambie a estatus “Entregado”. | La orden cambia a “Entregado”. | Se guarda delivered_at con fecha/hora.<br>La orden queda solo lectura después de “Entregado”. |
| RF-STS-005 | Congelar edición en Listo, Entregado y Cancelado | Alta | Sistema | El Sistema debe validar que no se permitan modificaciones a una orden cuando su estatus sea “Listo”, “Entregado” o “Cancelado”. | La orden se encuentra en Listo, Entregado o Cancelado. | El sistema rechaza edición de datos base, conceptos, evidencias, notas y checklists.<br>El sistema solo permite consulta de la orden. |

### 8.8 Conceptos (servicios e insumos) y validaciones

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-CONC-001 | Agregar concepto solo en En revisión | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller agregar un concepto a una orden cuando el estatus sea "En revisión". | La orden está en "En revisión". | Permite capturar tipo de concepto, descripción, cantidad y precio unitario.<br>Si la orden no está en "En revisión", el sistema rechaza la acción. |
| RF-CONC-001.1 | Validar tipos permitidos de concepto | Alta | Sistema | El Sistema debe validar que el tipo de concepto seleccionado pertenezca a la lista de tipos permitidos cuando el Usuario del Taller agregue un concepto. | El Usuario del Taller está agregando un concepto en "En revisión". | Los tipos permitidos son: Servicio, Insumo/refacción vendida por el taller, Insumo aportado por el cliente.<br>Si el tipo no está en la lista, el sistema rechaza el guardado del concepto. |
| RF-CONC-002 | Editar concepto solo en En revisión | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller editar un concepto cuando el estatus de la orden sea "En revisión". | La orden está en "En revisión" y existe el concepto. | Permite editar descripción, cantidad y precio unitario.<br>Si la orden no está en "En revisión", el sistema rechaza la acción. |
| RF-CONC-003 | Calcular total por conceptos cobrables | Alta | Sistema | El Sistema debe calcular el total de la orden cuando existan conceptos capturados en "En revisión". | Existe al menos un concepto en la orden. | El total es la suma de (cantidad x precio unitario) de conceptos cobrables.<br>Los conceptos "Insumo aportado por el cliente" pueden tener precio 0 y se muestran sin incrementar el total. |
| RF-CONC-003.1 | Mostrar desglose del total | Media | Sistema | El Sistema debe permitir mostrar un desglose del total cuando el Usuario del Taller consulte el detalle de una orden. | La orden tiene uno o más conceptos. | El desglose muestra subtotal por línea (cantidad x precio unitario).<br>El desglose muestra el total final como suma de subtotales. |
| RF-CONC-004 | Validar conceptos obligatorios antes de En reparación | Alta | Sistema | El Sistema debe validar que una orden tenga al menos un concepto antes de permitir el cambio de estatus a "En reparación". | Se intenta cambiar estatus a "En reparación". | Si la orden tiene 0 conceptos, el sistema rechaza el cambio a "En reparación".<br>Si la orden tiene 1 o más conceptos, el sistema permite el cambio (si respeta el flujo). |
| RF-CONC-005 | Guardar snapshot de conceptos | Alta | Sistema | El Sistema debe permitir guardar los conceptos como snapshot cuando el Usuario del Taller guarde cambios de conceptos en "En revisión". | El Usuario del Taller guarda cambios de conceptos en "En revisión". | Si el catálogo cambia después, los conceptos ya guardados no se alteran.<br>La orden mantiene descripción/precio/cantidad exactamente como se guardó. |

### 8.9 Catálogo de Insumos (autocompletar)

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-CATINS-001 | Administrar catálogo de insumos | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller crear, editar y desactivar insumos del catálogo cuando se encuentre en su workspace. | El Administrador del Taller ha iniciado sesión. | Un insumo incluye: nombre, unidad, precio sugerido y SKU opcional.<br>Un insumo desactivado no aparece para selección. |
| RF-CATINS-002 | Autocompletar concepto con insumo del catálogo | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller autocompletar un concepto de insumo cuando seleccione un ítem del catálogo en "En revisión". | La orden está en "En revisión" y existe catálogo de insumos. | Al seleccionar el insumo, se autocompletan nombre/unidad/precio sugerido.<br>El usuario puede editar los campos del concepto antes de guardar. |
| RF-CATINS-003 | Calcular indicador "Editado" en insumos autocompletados | Media | Sistema | El Sistema debe calcular el indicador "Editado" cuando el Usuario del Taller modifique un concepto autocompletado de insumo en "En revisión". | El concepto se creó mediante autocompletar y el usuario modifica sus campos. | La línea muestra un indicador "Editado".<br>El indicador se guarda en el detalle de la orden. |

### 8.10 Catálogo de Servicios (autocompletar)

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-CATSERV-001 | Administrar catálogo de servicios | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller crear, editar y desactivar servicios del catálogo cuando se encuentre en su workspace. | El Administrador del Taller ha iniciado sesión. | Un servicio incluye: nombre/descripcion, precio sugerido y duración estimada opcional.<br>Un servicio desactivado no aparece para selección. |
| RF-CATSERV-002 | Autocompletar concepto con servicio del catálogo | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller autocompletar un concepto de servicio cuando seleccione un ítem del catálogo en "En revisión". | La orden está en "En revisión" y existe catálogo de servicios. | Al seleccionar el servicio, se autocompleta nombre/descripcion/precio sugerido.<br>El usuario puede editar antes de guardar. |
| RF-CATSERV-003 | Calcular indicador "Editado" en servicios autocompletados | Media | Sistema | El Sistema debe calcular el indicador "Editado" cuando el Usuario del Taller modifique un concepto autocompletado de servicio en "En revisión". | El concepto se creó mediante autocompletar y el usuario modifica sus campos. | La línea muestra un indicador "Editado".<br>El indicador se guarda en el detalle de la orden. |

### 8.11 Evidencias (fotos)

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-EVID-001 | Subir evidencia en estatus permitidos | Alta | Usuario del Taller | El Sistema debe permitir al Usuario del Taller agregar evidencias a una orden cuando el estatus sea "Recibido", "En revisión" o "En reparación". | La orden pertenece al taller y está en un estatus permitido. | Permite subir evidencias en Recibido/En revisión/En reparación.<br>Rechaza subir evidencias en Listo/Entregado/Cancelado. |
| RF-EVID-002 | Validar límite de evidencias por orden | Media | Sistema | El Sistema debe validar que no se exceda el límite de evidencias por orden cuando el Usuario del Taller intente agregar una nueva evidencia. | El usuario intenta subir una evidencia. | Si se alcanza el límite configurado, el sistema rechaza nuevas evidencias.<br>Si no se alcanza el límite, el sistema permite la carga. |

### 8.12 Link público y vista del cliente

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-LINK-001 | Generar link público al crear orden | Alta | Sistema | El Sistema debe calcular y generar un token de link público cuando se cree una orden. | Se crea una orden. | El token es único por orden.<br>El token permite acceder a la vista pública del cliente. |
| RF-LINK-002 | Expirar link 30 días después de Entregado o Cancelado | Alta | Sistema | El Sistema debe validar el acceso al link público y rechazarlo cuando hayan transcurrido 30 días desde delivered_at o canceled_at. | La orden está Entregada o Cancelada y existe fecha correspondiente. | Antes de expirar, el link muestra el detalle de la orden.<br>Después de expirar, el link muestra "Enlace expirado". |
| RF-LINK-003 | Regenerar link público sin extender expiración | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller regenerar el token de link público cuando el cliente lo haya perdido o el token anterior haya expirado. | El Usuario del Taller ha iniciado sesión y la orden pertenece a su taller. | Al regenerar, el token anterior queda inválido.<br>El nuevo token permite acceso.<br>La fecha de expiración no cambia (se mantiene por delivered_at/canceled_at). |
| RF-VIEW-001 | Mostrar detalle completo al cliente | Alta | Cliente | El Sistema debe permitir al Cliente visualizar el detalle de su orden cuando acceda al link público válido. | El cliente tiene un link válido no expirado. | Se muestra estatus actual y timeline completo.<br>Se muestran evidencias, conceptos y total.<br>Se muestran notas públicas y se ocultan notas internas. |
| RF-VIEW-002 | Mostrar detalle completo si la orden está Cancelada | Media | Cliente | El Sistema debe permitir al Cliente visualizar el detalle completo de la orden cuando el estatus sea "Cancelado" y el link sea válido. | La orden está en "Cancelado" y el link no ha expirado. | El cliente ve toda la información disponible de la orden.<br>El sistema muestra una etiqueta visible "Cancelado". |

### 8.13 WhatsApp (compartir)

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-WA-001 | Generar mensaje para compartir por WhatsApp | Media | Sistema | El Sistema debe calcular un mensaje de WhatsApp para una orden cuando el Usuario del Taller solicite compartir el link. | El Usuario del Taller ha iniciado sesión y la orden pertenece a su taller. | El mensaje incluye al menos: nombre del taller, folio de orden y URL pública.<br>El mensaje usa el token vigente de la orden. |
| RF-WA-002 | Abrir WhatsApp con mensaje prellenado | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller abrir WhatsApp con un mensaje prellenado cuando elija la acción de compartir. | Existe un mensaje generado para la orden. | El sistema genera un enlace wa.me con el texto del mensaje.<br>El usuario puede copiar el mensaje si no desea abrir WhatsApp. |

### 8.14 Notas internas vs públicas

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-NOTES-001 | Crear nota con visibilidad Interna o Pública | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller crear una nota en una orden cuando seleccione la visibilidad "Interna" o "Pública". | El Usuario del Taller ha iniciado sesión y la orden no está congelada. | El usuario puede marcar la nota como Interna o Pública.<br>El sistema guarda autor y fecha de la nota. |
| RF-NOTES-002 | Mostrar solo notas públicas al cliente | Alta | Sistema | El Sistema debe validar que solo las notas marcadas como "Pública" se muestren en la vista del cliente cuando este abra el link. | Existe al menos una nota en la orden. | Notas internas no se muestran en la vista del cliente.<br>Notas públicas sí se muestran en la vista del cliente. |

### 8.15 Checklist (plantillas fijas)

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-CHK-001 | Capturar checklist de recepción con plantilla fija | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller capturar el checklist de recepción cuando la orden esté en un estatus permitido y usando una plantilla fija del sistema. | La orden está en Recibido/En revisión/En reparación. | El checklist incluye campos mínimos (odómetro, gasolina, accesorios, daños, notas).<br>Permite asociar fotos al checklist.<br>Si la orden está congelada, el sistema no permite edición. |
| RF-CHK-002 | Capturar checklist de entrega con plantilla fija | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller capturar el checklist de entrega cuando la orden esté en un estatus permitido y usando una plantilla fija del sistema. | La orden está en Recibido/En revisión/En reparación. | Permite capturar confirmación de entrega, notas y fotos finales.<br>Si la orden está congelada, el sistema no permite edición. |

### 8.16 Kanban, asignación y promesa

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-ASG-001 | Asignar responsable a una orden | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller asignar un responsable a una orden cuando la orden no esté congelada. | La orden no está en Listo/Entregado/Cancelado. | Se asigna un responsable seleccionado de usuarios del taller.<br>La asignación se muestra en el detalle de la orden. |
| RF-KAN-001 | Mostrar tablero Kanban con columnas fijas | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller visualizar un tablero Kanban con columnas fijas cuando consulte la sección de órdenes. | El Usuario del Taller ha iniciado sesión. | Las columnas son: Recibido, En revisión, En reparación, Listo, Entregado, Cancelado.<br>Las tarjetas se muestran en la columna de su estatus actual. |
| RF-KAN-002 | Validar movimiento de tarjeta para actualizar estatus | Alta | Sistema | El Sistema debe validar el cambio de estatus cuando el Usuario del Taller mueva una tarjeta de Kanban a otra columna. | El Usuario del Taller mueve una tarjeta a una columna destino. | El sistema permite mover solo hacia adelante en el flujo principal.<br>El sistema permite mover a Cancelado desde cualquier estatus.<br>Si el movimiento viola reglas, el sistema lo rechaza y mantiene la tarjeta en su columna original.<br>Si el destino es En reparación y no hay conceptos, el sistema rechaza el movimiento. |
| RF-PROM-001 | Registrar fecha promesa de entrega | Media | Usuario del Taller | El Sistema debe permitir al Usuario del Taller registrar una fecha promesa de entrega cuando la orden no esté congelada. | La orden no está en Listo/Entregado/Cancelado. | Permite guardar una fecha/hora de promesa.<br>La promesa se muestra en el detalle y en el listado. |
| RF-PROM-002 | Calcular indicador de orden atrasada | Media | Sistema | El Sistema debe calcular si una orden está atrasada cuando exista fecha promesa y la orden no esté Entregada o Cancelada. | La orden tiene fecha promesa registrada. | Si la fecha actual supera la promesa y la orden no está Entregada/Cancelada, se marca como atrasada.<br>Si se entrega o cancela, deja de considerarse atrasada. |

### 8.17 Notificaciones por estatus (plantillas + modal)

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-TPL-001 | Configurar plantillas por estatus | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller configurar plantillas de mensaje por estatus cuando administre ajustes del taller. | El Administrador del Taller ha iniciado sesión. | Se permite configurar plantilla para cada estatus del flujo.<br>La plantilla admite insertar la URL pública de la orden. |
| RF-TPL-002 | Reemplazar variables de plantilla en mensajes | Media | Sistema | El Sistema debe calcular el texto final del mensaje cuando aplique una plantilla a una orden. | Existe una plantilla configurada y existe una orden seleccionada. | El sistema reemplaza variables definidas por valores de la orden.<br>El resultado incluye la URL pública vigente de la orden. |
| RF-NOTIF-001 | Mostrar modal sugerido al cambiar estatus | Media | Sistema | El Sistema debe permitir mostrar un modal sugerido con el mensaje correspondiente cuando se cambie el estatus de una orden. | La orden cambia de estatus exitosamente. | El modal muestra el texto de la plantilla del estatus.<br>Incluye acciones: Copiar, Abrir WhatsApp, Cerrar.<br>Si se cierra, el estatus se mantiene cambiado. |

### 8.18 Reportes operativos

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-RPT-001 | Reporte de órdenes por semana | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller consultar un reporte de órdenes agregadas por semana cuando se encuentre en su workspace. | El Administrador del Taller ha iniciado sesión. | El reporte incluye únicamente órdenes del taller.<br>El reporte muestra conteo de órdenes por semana para un rango de fechas.<br>El reporte puede agrupar por estatus (conteo por estatus por semana) al menos para el flujo principal y Cancelado. |
| RF-RPT-002 | Reporte de tiempo promedio por fase | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller consultar el tiempo promedio en cada estatus y el tiempo total Recibido a Entregado para sus órdenes. | Existen órdenes con historial de cambios de estatus. | El reporte calcula el tiempo promedio por estatus usando el historial (timeline) de cambios.<br>El reporte calcula el tiempo total promedio Recibido a Entregado para órdenes entregadas.<br>El reporte excluye del cálculo final las órdenes Canceladas o, alternativamente, las muestra en una sección separada. |
| RF-RPT-003 | Reporte de porcentaje de cancelaciones | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller consultar el porcentaje de órdenes canceladas dentro de un rango de fechas. | Existen órdenes en el rango de fechas. | El sistema calcula % cancelaciones = (órdenes canceladas / órdenes totales) en el rango.<br>El reporte muestra el conteo total, conteo canceladas y el porcentaje. |
| RF-RPT-004 | Reporte de entregas a tiempo vs fecha promesa | Media | Administrador del Taller | El Sistema debe permitir al Administrador del Taller consultar qué porcentaje de órdenes se entregaron a tiempo comparando delivered_at contra la fecha promesa. | Existen órdenes entregadas con fecha promesa. | El sistema calcula "a tiempo" cuando delivered_at es menor o igual a la fecha promesa.<br>El reporte muestra % a tiempo, % tarde, y los conteos asociados. |

### 8.19 Aprobación del cliente (opcional / configurable)

| ID | Título | Prioridad | Actor | Descripción (Statement) | Pre-condición | Criterios de Aceptación |
| --- | --- | --- | --- | --- | --- | --- |
| RF-APP-001 | Mostrar opción de Aprobar/Rechazar en "En revisión" | Baja | Cliente | El Sistema debe permitir al Cliente aprobar o rechazar la propuesta de conceptos cuando la orden esté en "En revisión" y la aprobación esté habilitada para el taller. | La orden está en "En revisión", el link es válido y el taller tiene habilitada la aprobación. | El cliente ve botones Aprobar y Rechazar.<br>Si se rechaza, el sistema permite capturar comentario. |
| RF-APP-002 | Registrar respuesta del cliente | Baja | Sistema | El Sistema debe registrar la respuesta de aprobación o rechazo del cliente cuando se envíe desde la vista pública. | El cliente envía una respuesta válida. | Se guarda estado (Aprobada/Rechazada), fecha/hora y comentario (si aplica).<br>El taller puede ver esta respuesta en el detalle interno de la orden. |
| RF-APP-003 | Restringir cambios si la propuesta fue aprobada | Baja | Sistema | El Sistema debe impedir que el taller modifique conceptos después de que el cliente apruebe la propuesta cuando la aprobación esté habilitada. | La orden está en "En revisión" y está marcada como Aprobada. | El sistema bloquea el CRUD de conceptos y muestra una advertencia.<br>El taller solo puede continuar el flujo a "En reparación" o cancelar. |
