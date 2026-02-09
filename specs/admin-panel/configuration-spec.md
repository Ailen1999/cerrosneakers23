# Feature Specification: Panel de Configuración del Administrador

*Created*: 2026-01-30

## User Scenarios & Testing (mandatory)

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE.
-->

### User Story 1 - Editar Datos de la Página (Priority: P1)

Como administrador, quiero poder modificar el nombre de la tienda y cargar un nuevo logo para que la identidad de la marca se mantenga actualizada en toda la plataforma.

*Why this priority*: Es la función más básica de personalización de la tienda y afecta la identidad visual principal.

*Independent Test*: Se puede probar modificando el nombre/logo y verificando que cambie en `Header.jsx`, `Sidebar.jsx`, etc.

*Acceptance Scenarios*:

1. *Given* que estoy en el panel de configuración, *When* cambio el nombre de la tienda a "Cerro Store", *Then* el título de la página y el encabezado deben reflejar el nuevo nombre.
2. *Given* que estoy en el panel, *When* subo una nueva imagen de logo, *Then* la imagen del logo debe actualizarse en el header y footer.

---

### User Story 2 - Configuración de Contacto (Priority: P1)

Como administrador, quiero poder editar el número de WhatsApp y el mensaje predeterminado para que los clientes sean redirigidos correctamente cuando hacen consultas.

*Why this priority*: Fundamental para la conversión y atención al cliente. Un número incorrecto significa ventas perdidas.

*Independent Test*: Se puede probar cambiando el número y haciendo clic en el botón de WhatsApp del footer o de un producto.

*Acceptance Scenarios*:

1. *Given* un número de WhatsApp actual, *When* lo actualizo a uno nuevo, *Then* los enlaces de `WhatsAppButton` y el footer deben apuntar al nuevo número.
2. *Given* un mensaje predeterminado, *When* lo edito, *Then* al hacer clic en contactar, el mensaje pre-llenado en WhatsApp debe coincidir con el nuevo texto.

---

### User Story 3 - Configuración Financiera (Priority: P2)

Como administrador, quiero definir un porcentaje de recargo para tarjetas de crédito para que el cálculo de precios en cuotas sea automático y transparente.

*Why this priority*: Permite flexibilidad en la estrategia de precios y adaptación a costos financieros.

*Independent Test*: Se puede probar cambiando el % y verificando el cálculo visual en el detalle del producto (si se implementa visualización de cuotas).

*Acceptance Scenarios*:

1. *Given* un recargo del 10%, *When* lo cambio al 15%, *Then* el sistema debe guardar el nuevo valor para futuros cálculos de precio final.

---

### User Story 4 - Alertas de Stock (Priority: P2)

Como administrador, quiero configurar alertas de bajo stock para recibir notificaciones cuando un producto se esté agotando.

*Why this priority*: Ayuda a mantener el inventario saludable y prevenir quiebres de stock.

*Independent Test*: Se puede probar estableciendo un umbral y verificando si el dashboard muestra alertas para productos debajo de ese nivel.

*Acceptance Scenarios*:

1. *Given* un umbral de stock de 5 unidades, *When* guardo la configuración, *Then* el sistema debe usar este valor para marcar productos en rojo/alerta en el listado de productos.

---

### Edge Cases

- What happens when el logo subido es demasiado grande o en un formato no soportado? (Debería mostrar error).
- How does system handle si el porcentaje de tarjeta es negativo? (Validación de entrada).
- What happens when se deja el número de WhatsApp vacío? (Debería impedir guardar o usar un default seguro).

## Requirements (mandatory)

### Functional Requirements

- *FR-001*: El sistema DEBE permitir actualizar el nombre de la tienda (string).
- *FR-002*: El sistema DEBE permitir subir y almacenar una URL/archivo para el logo.
- *FR-003*: El sistema DEBE permitir editar el número de teléfono de WhatsApp (validación básica de formato).
- *FR-004*: El sistema DEBE permitir editar el template del mensaje de WhatsApp.
- *FR-005*: El sistema DEBE permitir definir un porcentaje (numérico) para recargo de tarjeta de crédito.
- *FR-006*: El sistema DEBE permitir configurar un umbral numérico para alertas de stock bajo.
- *FR-007*: Los cambios en la configuración DEBEN persistir y reflejarse inmediatamente en la tienda (frontend).

### Key Entities

- *[SiteConfig]*:
    - `storeName` (string)
    - `logoUrl` (string)
    - `whatsappNumber` (string)
    - `whatsappMessageTemplate` (string)
    - `creditCardSurcharge` (float)
    - `lowStockThreshold` (int)

## Success Criteria (mandatory)

### Measurable Outcomes

- *SC-001*: El administrador puede cambiar el número de WhatsApp y verificar el cambio en el frontend en menos de 1 minuto.
- *SC-002*: La identidad de la marca (logo/nombre) es consistente en todas las páginas tras la actualización.
- *SC-003*: El sistema valida correctamente entradas inválidas (números negativos, formatos de imagen erróneos).
