# Feature Specification: Tienda Online para Clientes

*Created*: 2026-01-26

## User Scenarios & Testing (mandatory)

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Visualizar Catálogo de Productos (Priority: P1)

Como cliente potencial, quiero ver un listado de productos disponibles con sus precios para poder conocer la oferta de la tienda y decidir qué me interesa comprar.

*Why this priority*: Es la funcionalidad core del negocio. Sin un catálogo visible, los clientes no pueden ver los productos y no hay conversiones. Es el MVP mínimo que entrega valor inmediato.

*Independent Test*: Se puede probar completamente navegando a la página home y verificando que se muestran productos con imágenes, nombres y precios. Entrega valor porque permite al negocio mostrar su catálogo online.

*Acceptance Scenarios*:

1. *Given* que soy un visitante en la página home, *When* cargo la página, *Then* veo un listado de productos con foto, nombre, categoría y precio
2. *Given* que hay productos en la base de datos, *When* la página carga, *Then* los productos se muestran en un grid responsive (mobile, tablet, desktop)
3. *Given* que estoy viendo el catálogo, *When* hay más de X productos, *Then* se implementa paginación o scroll infinito para no sobrecargar la página
4. *Given* que no hay productos en la base de datos, *When* cargo la página, *Then* veo un mensaje informativo "Próximamente nuevos productos"

---

### User Story 2 - Ver Detalles de Producto (Priority: P1)

Como cliente interesado, quiero hacer click en un producto y ver sus detalles completos (descripción, imágenes, precio, stock) para tomar una decisión de compra informada.

*Why this priority*: Es crítico porque permite al cliente conocer el producto en detalle antes de contactar por WhatsApp. Sin esto, el flujo de compra está incompleto.

*Independent Test*: Navegando desde la home, hacer click en cualquier producto y verificar que se muestra una página con toda la información del producto. Puede testearse independientemente porque cada producto funciona como una landing page.

*Acceptance Scenarios*:

1. *Given* que estoy en la home viendo productos, *When* hago click en un producto, *Then* navego a `/producto/[id]` con los detalles completos
2. *Given* que estoy en la página de detalle, *When* la página carga, *Then* veo: nombre, precio efectivo, precio crédito (si aplica), descripción, categoría, imágenes y estado de stock
3. *Given* que el producto tiene múltiples imágenes, *When* estoy en la página de detalle, *Then* puedo ver un carousel/galería de imágenes
4. *Given* que el producto está agotado, *When* veo el detalle, *Then* el estado indica "Agotado" y el botón de WhatsApp está deshabilitado o muestra un mensaje alternativo
5. *Given* que accedo a `/producto/[id-invalido]`, *When* el producto no existe, *Then* veo una página 404 o mensaje "Producto no encontrado"

---

### User Story 3 - Contactar por WhatsApp para Comprar (Priority: P1)

Como cliente que decidió comprar, quiero hacer click en un botón que me lleve a WhatsApp con un mensaje pre-rellenado del producto que me interesa, para finalizar la compra de forma rápida y personal.

*Why this priority*: Es el objetivo final del funnel de conversión. Sin esto, no hay forma de concretar ventas. Es crítico para el modelo de negocio.

*Independent Test*: Desde la página de detalle de producto, hacer click en "Comprar por WhatsApp" y verificar que se abre WhatsApp con un mensaje pre-rellenado. Entrega valor completo porque permite cerrar ventas.

*Acceptance Scenarios*:

1. *Given* que estoy en la página de detalle de un producto, *When* hago click en el botón "Comprar por WhatsApp", *Then* se abre WhatsApp Web/App con un mensaje tipo: "Hola! Me interesa el [nombre producto] - Precio: $[precio]. ¿Está disponible?"
2. *Given* que abro WhatsApp desde el botón, *When* WhatsApp se abre, *Then* el número de destino es el número de la tienda configurado en el sistema
3. *Given* que el producto incluye precio efectivo y crédito, *When* genero el mensaje de WhatsApp, *Then* el mensaje menciona ambos precios
4. *Given* que estoy en mobile, *When* hago click en el botón, *Then* se abre la app de WhatsApp nativa (no web)
5. *Given* que estoy en desktop, *When* hago click en el botón, *Then* se abre WhatsApp Web en una nueva pestaña

---

### User Story 4 - Ver Productos Destacados en Carousel (Priority: P2)

Como visitante de la tienda, quiero ver un carousel con productos destacados o promociones en la home para conocer rápidamente las ofertas más atractivas.

*Why this priority*: Mejora la experiencia y conversión, pero no es crítico para el MVP. La tienda funciona sin esto, pero con carousel es más profesional y atractiva.

*Independent Test*: Navegar a la home y verificar que hay un carousel funcionando con productos destacados. Se puede agregar después del MVP básico.

*Acceptance Scenarios*:

1. *Given* que cargo la página home, *When* la página se renderiza, *Then* veo un carousel de imágenes destacadas en la parte superior
2. *Given* que estoy viendo el carousel, *When* pasan X segundos, *Then* el carousel avanza automáticamente a la siguiente imagen
3. *Given* que estoy viendo el carousel, *When* hago click en los controles (flechas o dots), *Then* puedo navegar manualmente entre slides
4. *Given* que una imagen del carousel es de un producto, *When* hago click en la imagen, *Then* navego a la página de detalle de ese producto
5. *Given* que estoy en mobile, *When* veo el carousel, *Then* puedo deslizar (swipe) para cambiar de slide

---

### User Story 5 - Navegación con Header y Footer (Priority: P2)

Como usuario navegando la tienda, quiero tener un header con el logo/nombre de la tienda y un footer con información de contacto para una mejor experiencia de navegación.

*Why this priority*: Mejora la profesionalidad y UX, pero no es crítico para el MVP funcional. Se puede agregar una vez que el flujo de compra básico funcione.

*Independent Test*: Navegar por las páginas y verificar que header y footer se muestran consistentemente. Puede desarrollarse independientemente como mejora de UI.

*Acceptance Scenarios*:

1. *Given* que estoy en cualquier página de la tienda, *When* la página carga, *Then* veo un header con el logo/nombre "Cerro Sneakers"
2. *Given* que estoy viendo el header, *When* hago click en el logo, *Then* navego de vuelta a la home
3. *Given* que estoy en cualquier página, *When* scrolleo hasta abajo, *Then* veo un footer con información de contacto (teléfono, email, redes sociales)
4. *Given* que estoy en el footer, *When* hago click en el teléfono, *Then* se abre WhatsApp o app de llamadas
5. *Given* que estoy en mobile, *When* veo el header, *Then* el diseño es responsive y se adapta al tamaño de pantalla

---

### User Story 6 - Filtrar y Buscar Productos (Priority: P3)

Como cliente buscando algo específico, quiero poder filtrar productos por categoría o buscar por nombre para encontrar rápidamente lo que necesito.

*Why this priority*: Es una mejora de UX importante para cuando el catálogo crece, pero no es necesaria para el MVP inicial con pocos productos.

*Independent Test*: Usar la barra de búsqueda o filtros y verificar que los resultados se actualizan. Puede agregarse más adelante sin afectar funcionalidad core.

*Acceptance Scenarios*:

1. *Given* que estoy en la home, *When* escribo en la barra de búsqueda, *Then* los productos se filtran en tiempo real mostrando solo los que coinciden
2. *Given* que hay filtros de categoría visibles, *When* selecciono una categoría, *Then* solo veo productos de esa categoría
3. *Given* que apliqué filtros/búsqueda, *When* hago click en "Limpiar" o borro la búsqueda, *Then* vuelvo a ver todos los productos
4. *Given* que busco un término que no existe, *When* no hay resultados, *Then* veo mensaje "No se encontraron productos"

---

### Edge Cases

- ¿Qué pasa cuando un producto no tiene imagen? → Se muestra un placeholder genérico
- ¿Qué pasa si el número de WhatsApp no está configurado? → El botón no se muestra o muestra error
- ¿Qué pasa cuando un producto no tiene precio de crédito? → Solo se muestra el precio de efectivo
- ¿Qué pasa si la API del backend falla? → Se muestra mensaje de error amigable "No pudimos cargar los productos. Intenta más tarde."
- ¿Qué pasa si el usuario no tiene WhatsApp instalado? → En desktop abre WhatsApp Web, en mobile sugiere instalar la app
- ¿Qué pasa cuando hay muchísimos productos (ej: 1000+)? → Implementar paginación o lazy loading para no cargar todos a la vez
- ¿Qué pasa si el carousel no tiene imágenes configuradas? → No se muestra el carousel, solo el catálogo

---

## Requirements (mandatory)

### Functional Requirements

#### Página Home
- *FR-001*: El sistema DEBE mostrar un listado de productos disponibles con imagen, nombre, categoría y precio
- *FR-002*: El sistema DEBE implementar un diseño responsive que se adapte a mobile, tablet y desktop
- *FR-003*: El sistema DEBE mostrar un carousel de imágenes destacadas en la parte superior de la home (P2)
- *FR-004*: El carousel DEBE auto-avanzar cada X segundos y permitir navegación manual (P2)
- *FR-005*: El sistema DEBE implementar paginación o scroll infinito si hay más de 20 productos
- *FR-006*: Cada producto en el listado DEBE ser clickeable y navegar a su página de detalle

#### Página de Detalle de Producto
- *FR-007*: El sistema DEBE mostrar toda la información del producto: nombre, descripción, precio efectivo, precio crédito (opcional), categoría, imágenes y stock
- *FR-008*: Si el producto tiene múltiples imágenes, el sistema DEBE mostrar un carousel/galería de imágenes
- *FR-009*: El sistema DEBE mostrar un botón "Comprar por WhatsApp" visible y accesible
- *FR-010*: El sistema DEBE mostrar el estado del stock (En Stock, Bajo Stock, Agotado)
- *FR-011*: Si el producto está agotado, el botón de WhatsApp DEBE estar deshabilitado o mostrar mensaje alternativo
- *FR-012*: El sistema DEBE manejar productos no encontrados con una página 404 o mensaje apropiado

#### Integración WhatsApp
- *FR-013*: Al hacer click en "Comprar por WhatsApp", el sistema DEBE abrir WhatsApp con un mensaje pre-rellenado
- *FR-014*: El mensaje de WhatsApp DEBE incluir: nombre del producto, precio(s), y consulta de disponibilidad
- *FR-015*: El número de WhatsApp destino DEBE ser configurable desde el backend
- *FR-016*: En mobile, el sistema DEBE abrir la app nativa de WhatsApp
- *FR-017*: En desktop, el sistema DEBE abrir WhatsApp Web en nueva pestaña

#### Header y Footer
- *FR-018*: El sistema DEBE mostrar un header consistente en todas las páginas con el logo/nombre de la tienda (P2)
- *FR-019*: El logo en el header DEBE ser clickeable y navegar a la home (P2)
- *FR-020*: El sistema DEBE mostrar un footer con información de contacto (teléfono, email, redes) (P2)
- *FR-021*: Los links de contacto en el footer DEBEN ser funcionales (abrir WhatsApp, email, etc.) (P2)

#### Búsqueda y Filtros (P3)
- *FR-022*: El sistema DEBE proporcionar una barra de búsqueda para filtrar productos por nombre (P3)
- *FR-023*: El sistema DEBE proporcionar filtros por categoría (P3)
- *FR-024*: La búsqueda DEBE actualizar resultados en tiempo real mientras el usuario escribe (P3)

#### Performance y UX
- *FR-025*: Las imágenes DEBEN estar optimizadas (lazy loading, compresión) para carga rápida
- *FR-026*: El sistema DEBE mostrar estados de carga apropiados (spinners, skeletons) mientras carga datos
- *FR-027*: El sistema DEBE mostrar mensajes de error amigables si la API falla

### Key Entities

- **Producto (desde customer perspective)**:
  - ID único
  - Nombre
  - Descripción
  - Precio efectivo (número)
  - Precio crédito/lista (número, opcional)
  - Categoría
  - Imágenes (array de URLs)
  - Stock (número o estado: en stock, bajo stock, agotado)
  - Destacado (booleano, para carousel)

- **Configuración de la Tienda**:
  - Nombre de la tienda
  - Logo
  - Número de WhatsApp
  - Información de contacto (email, redes sociales)
  - Imágenes destacadas para carousel

---

## Success Criteria (mandatory)

### Measurable Outcomes

- *SC-001*: Un usuario puede ver el catálogo de productos en menos de 2 segundos desde que carga la página home
- *SC-002*: Un usuario puede navegar de home → detalle de producto → WhatsApp en menos de 3 clicks
- *SC-003*: El 95% de los usuarios puede completar el flujo de "ver producto y contactar por WhatsApp" sin asistencia
- *SC-004*: La tasa de rebote en la home es menor al 60% (indicando que los usuarios encuentran productos de interés)
- *SC-005*: Al menos el 30% de los usuarios que visitan la página de detalle hacen click en "Comprar por WhatsApp"
- *SC-006*: La página es completamente funcional y navegable en mobile (donde ocurre el 70%+ del tráfico)
- *SC-007*: El tiempo de carga de la página home es menor a 3 segundos en conexión 3G
- *SC-008*: El sistema puede manejar al menos 100 productos sin degradación de performance
- *SC-009*: El 90% de los clicks en el botón de WhatsApp resultan en apertura exitosa de la app/web
