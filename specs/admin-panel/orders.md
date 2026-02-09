# Feature Specification: Gestión de Pedidos (Admin Panel)

*Created*: 2026-01-29

## User Scenarios & Testing (mandatory)

<!--
  Prioritized user stories for Order Management in a "WhatsApp-First" e-commerce.
  Since there is no automatic checkout, "Orders" acts as a Sales Ledger/CRM for the admin.
-->

### User Story 1 - Registrar Venta Manual (Priority: P1)

Como administrador, quiero registrar manualmente una venta concretada por WhatsApp para mantener un control de mi inventario y mis ingresos.

*Why this priority*: Al no haber checkout automatizado, el administrador necesita una forma de descontar stock y registrar ingresos de las ventas que cierra por chat. Es fundamental para la consistencia del negocio.

*Independent Test*: Entrar al panel, ir a "Pedidos", hacer click en "Nuevo Pedido", seleccionar productos y cliente, guardar, y verificar que el stock de los productos se descontó.

*Acceptance Scenarios*:

1. *Given* que estoy en la sección de Pedidos, *When* hago click en "Nuevo Pedido", *Then* veo un formulario para ingresar datos del cliente y seleccionar productos.
2. *Given* que selecciono un producto en el formulario, *When* lo agrego al pedido, *Then* se calcula automáticamente el subtotal.
3. *Given* que confirmo el pedido como "Pagado", *When* guardo el registro, *Then* el stock de los productos involucrados se reduce automáticamente.
4. *Given* que ingreso un cliente nuevo, *When* guardo el pedido, *Then* el sistema permite guardar nombre y contacto del cliente asociado al pedido.

---

### User Story 2 - Listar y Filtrar Pedidos (Priority: P1)

Como administrador, quiero ver una lista de todas mis ventas con su estado (Pendiente, Pagado, Enviado) para saber qué tengo pendiente de entrega o cobro.

*Why this priority*: Permite el control operativo diario. Sin esto, el administrador pierde el rastro de qué debe enviar o cobrar.

*Independent Test*: Crear varios pedidos con diferentes estados y verificar que aparecen en la lista. Usar filtros y verificar resultados.

*Acceptance Scenarios*:

1. *Given* que tengo ventas registradas, *When* entro a "Pedidos", *Then* veo una tabla con ID, Fecha, Cliente, Total y Estado.
2. *Given* que quiero ver solo lo pendiente, *When* filtro por estado "Pendiente", *Then* solo veo esos registros.
3. *Given* que la lista es larga, *When* navego, *Then* veo paginación (10/20 items por página).

---

### User Story 3 - Gestionar Estados del Pedido (Priority: P2)

Como administrador, quiero cambiar el estado de un pedido (ej: de "Pendiente" a "Enviado") para hacer seguimiento del proceso de entrega.

*Why this priority*: Es necesario para el flujo de trabajo post-venta, especialmente si hay envíos involucrados.

*Independent Test*: Abrir un pedido existente "Pendiente", cambiar estado a "Enviado", guardar, y verificar que el cambio persiste.

*Acceptance Scenarios*:

1. *Given* un pedido "Pendiente", *When* cambio el estado a "Enviado", *Then* el sistema guarda la fecha de actualización.
2. *Given* un pedido "Enviado", *When* lo marco como "Cancelado", *Then* el sistema pregunta si deseo reponer el stock de los productos (Edge Case management).

---

### Edge Cases

- ¿Qué pasa si intento agregar un producto sin stock a un pedido? → El sistema debe advertir pero permitirlo (overbooking) o bloquearlo según configuración. Por defecto: Advertir.
- ¿Qué pasa si elimino un pedido "Pagado"? → El sistema debe preguntar si restituir el stock.
- ¿Qué pasa si el cliente ya existe? → El sistema debería autocompletar o permitir seleccionarlo (si se implementa módulo de Clientes).

## Requirements (mandatory)

### Functional Requirements

#### Gestión de Pedidos
- *FR-001*: El sistema DEBE permitir crear pedidos manuales seleccionando productos del catálogo existente.
- *FR-002*: El sistema DEBE permitir registrar datos básicos del cliente (Nombre, Teléfono/WhatsApp, Dirección, Notas).
- *FR-003*: El sistema DEBE calcular automáticamente totales basados en los precios de los productos.
- *FR-004*: El sistema DEBE permitir aplicar un descuento manual (monto fijo o porcentaje) al total.
- *FR-005*: El sistema DEBE manejar los siguientes estados de pedido: `Pendiente`, `Pagado`, `En Preparación`, `Enviado`, `Entregado`, `Cancelado`.
- *FR-006*: Al cambiar a estado `Pagado` o `Enviado` (configurable), el sistema DEBE descontar el stock de los productos.
- *FR-007*: Al cambiar a estado `Cancelado`, el sistema DEBE ofrecer la opción de restituir el stock.

#### Visualización
- *FR-008*: El listado de pedidos DEBE mostrar: ID (#), Cliente, Fecha, Cantidad de Items, Total, Estado.
- *FR-009*: Debe haber indicadores visuales (badges de color) para los diferentes estados (ej: Verde=Pagado, Rojo=Cancelado, Amarillo=Pendiente).

### Key Entities

- *[Order]*:
    - ID (Auto-incremental)
    - Customer Name (String)
    - Customer Contact (String)
    - Items (Array of Product + Quantity + PriceAtMoment)
    - Total Amount (Decimal)
    - Status (Enum)
    - CreatedAt (Date)
    - ShippingAddress (String, optional)
    - Notes (Text, optional)

- *[OrderItem]*:
    - ProductID (Relación)
    - Quantity (Int)
    - UnitPrice (Decimal - snapshot del precio al momento de la venta)

## Success Criteria (mandatory)

### Measurable Outcomes

- *SC-001*: El administrador puede registrar una venta manual completa en menos de 1 minuto.
- *SC-002*: El inventario refleja con 100% de precisión las ventas registradas manualmente (se descuenta stock correctamente).
- *SC-003*: El sistema permite filtrar y encontrar un pedido específico por nombre de cliente en menos de 5 segundos.
