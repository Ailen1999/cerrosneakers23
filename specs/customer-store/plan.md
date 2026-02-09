# Implementation Plan: Tienda Online para Clientes

*Date*: 2026-01-26  
*Spec*: [spec.md](file:///c:/Users/USER/Desktop/TiendaEdgar/specs/customer-store/spec.md)  
*Design Reference*: [home-reference.html](file:///c:/Users/USER/Desktop/TiendaEdgar/specs/customer-store/home-reference.html)

## Summary

Implementar la tienda online orientada al cliente final, permitiendo visualizar productos, ver detalles y contactar por WhatsApp para comprar. El diseño HTML de referencia debe seguirse EXACTAMENTE sin cambios en los estilos. La implementación se divide en user stories independientes empezando por el MVP (catálogo → detalle → WhatsApp).

## Technical Context

*Language/Version*: JavaScript (ES6+) / React 18  
*Primary Dependencies*: React, React Router DOM, Tailwind CSS, Material Symbols Icons  
*Storage*: API REST desde el backend existente (productos)  
*Testing*: Manual testing + navegación de user flow  
*Target Platform*: Web (Mobile-first responsive)  
*Project Type*: Web (Frontend React SPA)  
*Performance Goals*: Home page cargar en <3s, smooth transitions, responsive design  
*Constraints*: Debe usar los estilos exactos del HTML de referencia, mobile-first  
*Scale/Scope*: MVP con 3 páginas (Home, Product Detail, posiblemente 404), ~100 productos

## Project Structure

### Documentation (this feature)

```
specs/customer-store/
├── plan.md                    # This file
├── spec.md                    # Feature specification
└── home-reference.html        # EXACT design reference - DO NOT modify styles
```

### Source Code (repository root)

```
backend/
├── src/
│   ├── models/
│   │   └── carousel_slide.py  # NEW: Carousel slides model
│   ├── services/
│   │   └── carousel_service.py # NEW: Carousel business logic
│   └── api/
│       └── carousel_routes.py  # NEW: GET /carousel-slides endpoint
└── migrations/
    └── xxx_create_carousel_slides.py

frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/           # Shared components
│   │   │   ├── Header.jsx    # Customer header (from reference HTML)
│   │   │   └── Footer.jsx    # Customer footer (from reference HTML)
│   │   ├── home/             # Home page components
│   │   │   ├── HeroCarousel.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   └── FeatureCards.jsx
│   │   └── product/          # Product detail components
│   │       ├── ProductGallery.jsx
│   │       ├── ProductInfo.jsx
│   │       └── WhatsAppButton.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/
│   │   ├── productService.js   # API calls for products
│   │   └── carouselService.js  # NEW: API calls for carousel
│   ├── utils/
│   │   ├── whatsappHelpers.js # WhatsApp URL generation
│   │   └── formatters.js      # Price formatting etc.
│   ├── App.jsx
│   ├── index.js
│   └── index.css              # Tailwind + custom styles from reference HTML
└── tailwind.config.js         # EXACT config from reference HTML
```

*Structure Decision*: Separamos componentes por dominio (home vs product) y por tipo (common para shared). Los estilos Tailwind se configuran exactamente como en `home-reference.html` para mantener la fidelidad del diseño.

---

## Phase 1: Setup (Shared Infrastructure)

*Purpose*: Configurar el proyecto React con las dependencias y estilos exactos del diseño de referencia

- [x] T001 Verificar que el proyecto React existe en `frontend/` (ya debería existir del panel admin)
- [x] T002 Actualizar `tailwind.config.js` con la configuración EXACTA de `home-reference.html` (colores custom, fonts, borderRadius, etc.)
- [x] T003 Agregar Google Fonts (Playfair Display, Inter) y Material Symbols al `index.html`
- [x] T004 Copiar estilos custom del `<style>` de reference HTML a `index.css` (scrollbar, text-shadow, aspect-3-4)
- [x] T005 Crear estructura de directorios: `components/{common,home,product}`, `pages/`, `services/`, `utils/`

---

## Phase 2: Foundational (Blocking Prerequisites)

*Purpose*: Core infrastructure que DEBE estar completa antes de cualquier user story

⚠️ **CRITICAL**: No se puede empezar ninguna user story hasta completar esta fase

#### Backend - Carousel Slides

- [x] T006 [BACKEND] Crear migración para tabla `carousel_slides` con campos:
  - `id` (PK)
  - `titulo` (varchar)
  - `subtitulo` (varchar)
  - `imagen_url` (varchar)
  - `link_cta` (varchar, nullable)
  - `producto_id` (FK nullable a productos)
  - `orden` (integer)
  - `activo` (boolean, default true)
  - `created_at`, `updated_at`
- [x] T007 [BACKEND] Crear modelo `CarouselSlide` en `models/carousel_slide.go`
- [x] T008 [BACKEND] Crear servicio `carousel_service.go` con `get_active_slides()` ordenados por `orden`
- [x] T009 [BACKEND] Crear endpoint `GET /api/carousel-slides` (solo slides activos)
- [x] T010 [BACKEND] Seed de datos: crear 2-3 slides de ejemplo para testing

#### Frontend - Foundation

- [x] T011 Configurar React Router con rutas `/`, `/producto/:id`, `/404`
- [x] T012 Crear `productService.js` con método `getAllProducts()` que consume la API backend existente
- [x] T013 Crear `carouselService.js` con método `getActiveSlides()` para carousel
- [x] T014 Crear componente `Header.jsx` (customer) usando estilos EXACTOS del reference HTML
- [x] T015 Crear componente `Footer.jsx` usando estilos EXACTOS del reference HTML
- [x] T016 Crear layout wrapper que incluya Header + children + Footer para todas las páginas
- [x] T017 Implementar toggle de dark mode (ya existe en admin, adaptarlo para customer)
- [x] T018 Crear `NotFoundPage.jsx` básica para productos no encontrados

*Checkpoint*: Foundation ready - las user stories pueden comenzar en paralelo

---

## Phase 3: User Story 1 - Visualizar Catálogo de Productos (Priority: P1)

*Goal*: Mostrar en la home un grid responsive de productos con imagen, nombre, categoría y precio

*Independent Test*: Navegar a `/` y verificar que se muestran productos del backend, responsive en mobile/tablet/desktop

### Tests for User Story 1

- [x] T019 [P] [US1] Test manual: Abrir `/` y verificar que carga productos desde backend
- [x] T020 [P] [US1] Test manual: Verificar grid responsive (1 col mobile, 2 cols tablet, 4 cols desktop)
- [x] T021 [P] [US1] Test manual: Verificar que si no hay productos muestra mensaje informativo

### Implementation for User Story 1

- [x] T022 [P] [US1] Crear `HomePage.jsx` con estructura básica (sin carousel todavía)
- [x] T023 [P] [US1] Crear `ProductGrid.jsx` que consume `productService.getAllProducts()`
- [x] T024 [US1] Crear `ProductCard.jsx` con estilos EXACTOS de reference HTML
  - Imagen con aspect-ratio 3/4
  - Hover: scale imagen + mostrar botón WhatsApp
  - Nombre, categoría, precio (efectivo + crédito tachado si aplica)
- [x] T025 [US1] Implementar loading state (skeleton o spinner) mientras cargan productos
- [x] T026 [US1] Implementar empty state si no hay productos
- [x] T027 [US1] Verificar dark mode funciona en toda la página

*Checkpoint*: User Story 1 completa - se puede ver catálogo de productos en home

---

## Phase 4: User Story 2 - Ver Detalles de Producto (Priority: P1)

*Goal*: Al hacer click en un producto, navegar a página de detalle con toda la información

*Independent Test*: Click en cualquier producto de la home → ver página `/producto/:id` con detalles completos

### Tests for User Story 2

- [x] T028 [P] [US2] Test manual: Click en producto desde home navega a `/producto/:id`
- [x] T029 [P] [US2] Test manual: Página de detalle muestra imagen(es), nombre, precio, descripción, stock
- [x] T030 [P] [US2] Test manual: Producto no válido muestra página 404

### Implementation for User Story 2

- [x] T031 [P] [US2] Extender `productService.js` con `getProductById(id)`
- [x] T032 [US2] Crear `ProductDetailPage.jsx` con layout de 2 columnas (galería + info)
- [x] T033 [US2] Crear `ProductGallery.jsx`
  - Si múltiples imágenes: carousel/galería
  - Si una imagen: mostrarla grande
  - Si sin imagen: placeholder
- [x] T034 [US2] Crear `ProductInfo.jsx` que muestre:
  - Nombre (Playfair Display font)
  - Categoría (badge similar a productos grid)
  - Precio efectivo (bold)
  - Precio crédito si existe (tachado, gris)
  - Descripción
  - Estado de stock (badge) - reusar `ProductStatusBadge` del admin
- [x] T035 [US2] Implementar navegación: botón "volver" o breadcrumb
- [x] T036 [US2] Manejar producto no encontrado → redirect a `/404`

*Checkpoint*: User Stories 1 Y 2 funcionan independientemente

---

## Phase 5: User Story 3 - Contactar por WhatsApp para Comprar (Priority: P1)

*Goal*: Botón en página de detalle que abre WhatsApp con mensaje pre-rellenado del producto

*Independent Test*: Desde detalle de producto, click en "Comprar por WhatsApp" → abre WhatsApp con mensaje correcto

### Tests for User Story 3

- [x] T037 [P] [US3] Test manual: Click en botón abre WhatsApp web/app con mensaje pre-rellenado
- [x] T038 [P] [US3] Test manual: Mensaje incluye nombre producto + precio + consulta disponibilidad
- [x] T039 [P] [US3] Test manual: En mobile abre app nativa, en desktop abre WhatsApp Web
- [x] T040 [P] [US3] Test manual: Si producto agotado, botón disabled o muestra mensaje alternativo

### Implementation for User Story 3

- [x] T041 [P] [US3] Crear función `generateWhatsAppMessage(product)` en `utils/whatsappHelpers.js`
  - Template: "Hola! Me interesa el {nombre} - Precio: ${precio_efectivo} (Efvo) / ${precio_credito} (Crédito). ¿Está disponible?"
- [x] T042 [US3] Crear `WhatsAppButton.jsx` con estilos EXACTOS de reference HTML
  - Botón negro, uppercase, tracking-widest, icono chat
  - onClick genera URL `https://wa.me/{numero}?text={mensaje}`
  - Disabled si stock agotado
- [x] T043 [US3] Configurar número de WhatsApp (hardcoded por ahora o variable de entorno)
- [x] T044 [US3] Integrar `WhatsAppButton` en `ProductDetailPage`
- [x] T045 [US3] Agregar botón WhatsApp en hover de `ProductCard` (grid de home)
- [x] T046 [US3] Verificar funciona en mobile vs desktop (app vs web)

*Checkpoint*: MVP completo - Catálogo + Detalle + WhatsApp funcionando

---

## Phase 6: User Story 4 - Ver Productos Destacados en Carousel (Priority: P2)

*Goal*: Hero carousel full-screen en la home con slides auto-avanzando, consumiendo datos de tabla `carousel_slides`

*Independent Test*: Cargar home → ver carousel con controles funcionales y slides dinámicos del backend

*Data Source*: Tabla `carousel_slides` en backend con campos: título, subtítulo, imagen_url, link_cta, producto_id, orden, activo

### Tests for User Story 4

- [x] T047 [P] [US4] Test manual: Carousel carga slides desde backend `GET /api/carousel-slides`
- [x] T048 [P] [US4] Test manual: Carousel auto-avanza cada 5 segundos
- [x] T049 [P] [US4] Test manual: Flechas prev/next funcionan
- [x] T050 [P] [US4] Test manual: Swipe funciona en mobile
- [x] T051 [P] [US4] Test manual: Click en CTA navega correctamente (producto o link custom)
- [x] T052 [P] [US4] Test manual: Si no hay slides activos, carousel no se muestra

### Implementation for User Story 4

- [x] T053 [US4] Crear `HeroCarousel.jsx` con estilos EXACTOS de reference HTML
  - Full screen (h-screen)
  - Imagen con overlay gradiente
  - Texto overlay (título, subtítulo del slide)
  - Botón CTA con link_cta del slide
  - Botones prev/next con backdrop-blur
- [x] T054 [US4] Consumir `carouselService.getActiveSlides()` en `HeroCarousel`
- [x] T055 [US4] Implementar auto-advance (setInterval cada 5 segundos)
- [x] T056 [US4] Implementar navegación manual (flechas)
- [x] T057 [US4] Agregar swipe support para mobile (touch events o librería como `react-swipeable`)
- [x] T058 [US4] Manejar click en CTA:
  - Si `producto_id` existe → navigate to `/producto/{producto_id}`
  - Si `link_cta` existe → navigate to `link_cta`
- [x] T059 [US4] Integrar carousel en `HomePage.jsx` antes del ProductGrid
- [x] T060 [US4] Manejar empty state: si no hay slides activos, no mostrar carousel

*Checkpoint*: Home tiene carousel + grid de productos

---

## Phase 7: User Story 5 - Navegación con Header y Footer (Priority: P2)

*Goal*: Header y footer consistentes en todas las páginas con links funcionales

*Independent Test*: Navegar por la app y verificar header/footer presentes y funcionales

### Tests for User Story 5

- [ ] T051 [US5] Test manual: Header se muestra en todas las páginas
- [ ] T052 [US5] Test manual: Click en logo "Cerro Sneakers" va a home
- [ ] T053 [US5] Test manual: Links del footer funcionan (WhatsApp, email, redes)
- [ ] T054 [US5] Test manual: Header responsive en mobile (menú hamburguesa si necesario)

### Implementation for User Story 5

- [ ] T055 [US5] Completar links de navegación en `Header.jsx`
  - Logo clickeable → navigate to `/`
- [x] T055 [US5] Completar links de navegación en `Header.jsx`
- [x] T056 [US5] Completar links en `Footer.jsx`
- [x] T057 [US5] Implementar click en teléfono/WhatsApp del footer → abrir WhatsApp
- [x] T058 [US5] Verificar header responsive
- [x] T059 [US5] Implementar header "fixed" con backdrop-blur (ya realizado)

*Checkpoint*: Navegación completa y profesional

---

## Phase 8: User Story 6 - Filtrar y Buscar Productos (Priority: P3)

*Goal*: Barra de búsqueda y filtros de categoría en la home

*Independent Test*: Usar búsqueda/filtros y verificar productos se filtran en tiempo real

### Tests for User Story 6

- [x] T060 [US6] Test manual: Escribir en búsqueda filtra productos en tiempo real
- [x] T061 [US6] Test manual: Click en categoría filtra productos
- [x] T062 [US6] Test manual: Limpiar filtros muestra todos los productos
- [x] T063 [US6] Test manual: Sin resultados muestra mensaje apropiado

### Implementation for User Story 6

- [x] T064 [US6] Crear CategoryFilter.jsx (Implementado directamente en HomePage.jsx)
- [x] T065 [US6] Agregar state en `HomePage` para categoría seleccionada
- [x] T066 [US6] Filtrar productos por categoría en `ProductGrid`
- [x] T067 [US6] Agregar search input en header o antes del grid
- [x] T068 [US6] Implementar búsqueda en tiempo real (filter por nombre)
- [x] T069 [US6] Mostrar mensaje "No se encontraron productos" cuando filtros vacíos

*Checkpoint*: Búsqueda y filtros funcionando

---

## Phase 9: Feature Cards Section (Priority: P2)

*Goal*: Sección debajo del grid con tarjetas de features (como en reference HTML)

*Independent Test*: Scroll en home hasta ver feature cards con imágenes y CTAs

### Tests for User Story - Feature Cards

- [ ] T070 [Features] Test manual: Feature cards se muestran en grid 3 columnas desktop
- [ ] T071 [Features] Test manual: Hover effect en imágenes funciona
- [ ] T072 [Features] Test manual: CTAs navegan a secciones correspondientes

### Implementation for Feature Cards

- [x] T073 [Features] Crear `FeatureCards.jsx` con grid layout EXACTO de reference HTML
- [x] T074 [Features] Implementar las 4 tarjetas:
- [x] T075 [Features] Agregar hover effects (scale img, transitions)
- [x] T076 [Features] Integrar en `HomePage` después del ProductGrid y conectar links funcionales

---

## Phase 10: Polish & Cross-Cutting Concerns

*Purpose*: Mejoras que afectan múltiples user stories

- [ ] T077 **Performance**: Implementar lazy loading de imágenes en ProductGrid
- [ ] T078 **Performance**: Optimizar imágenes (comprimir, usar WebP si posible)
- [ ] T079 **UX**: Agregar loading skeletons en ProductGrid mientras carga
- [ ] T080 **UX**: Smooth scroll behavior en navegación
- [ ] T081 **UX**: Agregar meta tags SEO en cada página (title, description)
- [ ] T082 **Accessibility**: Verificar alt text en todas las imágenes
- [ ] T083 **Accessibility**: Verificar keyboard navigation funciona
- [ ] T084 **Error Handling**: Mensaje amigable si API backend falla
- [ ] T085 **Mobile**: Testing exhaustivo en mobile (iOS Safari, Android Chrome)
- [ ] T086 **Dark Mode**: Verificar todos los componentes funcionan en dark mode
- [ ] T087 **Code Quality**: Cleanup de console.logs, código comentado, etc.
- [ ] T088 **Documentation**: Actualizar README con instrucciones para customer store

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories P1 (Phases 3-5)**: Depend on Foundational
  - US1 (Catálogo) → US2 (Detalle) → US3 (WhatsApp) en secuencia (cada uno usa el anterior)
- **User Stories P2 (Phases 6-7, 9)**: Pueden hacerse en paralelo después de P1
- **User Story P3 (Phase 8)**: Depende de US1 (Catálogo)
- **Polish (Phase 10)**: Depende de todas las stories deseadas

### User Story Dependencies

- **US1 (P1 - Catálogo)**: Foundational complete → independiente
- **US2 (P1 - Detalle)**: Foundational + US1 (necesita ProductCard clickeable)
- **US3 (P1 - WhatsApp)**: Foundational + US2 (botón va en detalle)
- **US4 (P2 - Carousel)**: Foundational → independiente de otras US
- **US5 (P2 - Nav)**: Foundational → independiente
- **US6 (P3 - Búsqueda)**: Foundational + US1
- **Feature Cards (P2)**: Foundational → independiente

### Recommended Execution Order

1. Phase 1 + 2 (Setup + Foundation)
2. Phase 3 → 4 → 5 (US1 → US2 → US3) - MVP Core en secuencia
3. Phase 6, 7, 9 en paralelo (Carousel, Nav, Features) - Mejoras visuales
4. Phase 8 (Búsqueda) - Nice to have
5. Phase 10 (Polish) - Final touches

---

## Notes

### Critical Design Constraints

> **IMPORTANTE**: El archivo `home-reference.html` contiene los estilos EXACTOS a seguir. NO modificar:
> - Colores (background-light, background-dark, surface-light, surface-dark, etc.)
> - Tipografías (Playfair Display para headings, Inter para body)
> - Border radius (0px default, sharp edges)
> - Tracking/spacing (tracking-widest, tracking-[0.2em], etc.)
> - Aspect ratios (3:4 para product cards)
> - Grid layouts (4 cols desktop, 2 cols tablet, 1 col mobile)
> - Hover effects (scale-105, opacity transitions)

### WhatsApp Integration

- Número debe ser configurable (env variable o backend config)
- Formato URL: `https://wa.me/5491234567890?text=mensaje_encoded`
- Detectar mobile vs desktop para app vs web

### API Integration

- Usar backend existente desde panel admin (misma API `/productos`)
- Manejar errores de red con mensajes amigables
- Considerar caching para performance

### Testing Strategy

- Manual testing por user story
- Verificar en Chrome, Safari, Firefox
- Probar en mobile real (no solo emulador)
- Validar dark mode en todos los flujos

---

## Verification Checklist

Antes de considerar el feature completo:

- [ ] Home page carga en <3 segundos
- [ ] usuario puede ir de Home → Detalle → WhatsApp en 2 clicks
- [ ] diseño es pixel-perfect con reference HTML
- [ ] funciona en mobile (responsive)
- [ ] dark mode funciona en todas las páginas
- [ ] errores de API se manejan gracefully
- [ ] todas las imágenes tienen alt text
- [ ] no hay console errors en producción
