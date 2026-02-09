# Implementation Plan: Panel de Administración de Productos

*Date*: 2026-01-25
*Spec*: [spec.md](file:///c:/Users/USER/Desktop/TiendaEdgar/specs/admin-panel/spec.md)

## Summary

Implementar un panel de administración para gestionar productos de la tienda web. El backend ya existe con endpoints CRUD completos en `/api/products`. El trabajo principal consiste en crear el frontend con React + Vite que permita: crear productos, editarlos, eliminarlos, listarlos y buscar por nombre.

## Technical Context

*Language/Version*: JavaScript ES6+ (React 18+)
*Primary Dependencies*: React 18, Vite, React Router, Axios (para llamadas API), Tailwind CSS
*Storage*: Backend existente con PostgreSQL (no se modifica)
*Testing*: Vitest para unit tests, React Testing Library para componentes
*Target Platform*: Web (navegadores modernos)
*Project Type*: Web (SPA - Single Page Application)
*Performance Goals*: <1s para búsqueda, <500ms para renderizado inicial
*Constraints*: Usar diseños HTML proporcionados por el usuario, adaptarlos a React
*Scale/Scope*: ~5-8 componentes React, 2-3 páginas principales

## Project Structure

### Documentation (this feature)

```
specs/admin-panel/
├── plan.md              # This file
└── spec.md              # Feature specification
```

### Source Code (repository root)

```
frontend/
├── public/              # Assets estáticos
├── src/
│   ├── components/      
│   │   ├── layout/      # Componentes de layout
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── products/    # Componentes de productos
│   │   │   ├── ProductTable.jsx
│   │   │   ├── ProductTableRow.jsx
│   │   │   ├── ProductStatusBadge.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── ProductActions.jsx
│   │   │   └── form/    # Sub-componentes del formulario
│   │   │       ├── ImageGallery.jsx
│   │   │       ├── ProductFormFields.jsx
│   │   │       ├── ProductPricing.jsx
│   │   │       └── InventorySizeManager.jsx
│   │   ├── shared/      # Componentes compartidos
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterButton.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   └── FormFooter.jsx
│   ├── pages/           # Páginas principales
│   │   ├── Dashboard.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── CreateProductPage.jsx
│   │   └── EditProductPage.jsx
│   ├── services/        # API calls
│   │   └── productService.js
│   ├── hooks/           # Custom hooks
│   │   └── useProducts.js
│   ├── utils/           # Utilidades
│   │   └── validators.js
│   ├── App.jsx          # Router principal
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globales (Tailwind + minimal-input)
├── tailwind.config.js   # Configuración Tailwind
├── package.json
└── vite.config.js
```

*Structure Decision*: React SPA con Vite como bundler para mejor performance. Separación clara entre componentes reutilizables, páginas, y lógica de API. Los diseños HTML serán adaptados a componentes React manteniendo la estructura y estilos proporcionados.

---

## Phase 1: Setup (Shared Infrastructure)

*Purpose*: Inicialización del proyecto React con Vite

- [x] T001 Crear proyecto React con Vite en directorio `frontend/`
- [x] T002 Instalar dependencias: React Router, Axios, Tailwind CSS
- [x] T003 Configurar estructura de carpetas (components, pages, services)
- [x] T004 Configurar variables de entorno para URL del backend

---

## Phase 2: Foundational (Blocking Prerequisites)

*Purpose*: Infraestructura base del frontend que todas las user stories necesitan

*⚠️ CRITICAL*: No se puede implementar ninguna user story hasta completar esta fase

- [x] T005 Configurar Tailwind CSS con tema personalizado del diseño (colores, fuentes Playfair Display + Inter)
- [x] T006 Crear servicio base `productService.js` con métodos CRUD vacíos
- [x] T007 Configurar React Router con rutas principales
- [x] T008 Crear custom hook `useProducts.js` para gestión de estado de productos
- [x] T009 Crear utilidades de validación en `utils/validators.js`
- [x] T010 Implementar manejo global de errores (backend caído, errores de red)
- [x] T011 Crear componente base `ErrorMessage.jsx` para mostrar errores
- [x] T012 Crear componente `MainLayout.jsx` como wrapper principal

*Checkpoint*: Infraestructura lista - las user stories pueden implementarse en paralelo

---

## Phase 3: Layout Components (Shared UI)

*Purpose*: Componentes de layout que serán usados en todas las páginas

- [x] T013 Adaptar diseño HTML del Sidebar a componente `Sidebar.jsx`
- [x] T014 Implementar navegación activa en Sidebar (highlight de ruta actual)
- [x] T015 Adaptar diseño HTML del Header a componente `Header.jsx`
- [x] T016 Implementar funcionalidad de toggle dark mode en Header
- [/] T017 Integrar SearchBar en Header (componente reutilizable)
- [x] T018 Crear componente `Modal.jsx` genérico para confirmaciones

*Checkpoint*: Layout completo y reutilizable para todas las páginas

---

## Phase 4: User Story 1 - Gestión de Productos (CRUD) (Priority: P1)

*Goal*: Permitir al admin crear, editar y eliminar productos

*Independent Test*: Crear un producto desde el formulario, verificar que aparece en la lista, editarlo, y eliminarlo

### Implementación para User Story 1

- [x] T019 [US1] Implementar `createProduct()` en `productService.js` (POST /api/products)
- [x] T020 [US1] Implementar `updateProduct()` en `productService.js` (PUT /api/products/:id)
- [x] T021 [US1] Implementar `deleteProduct()` en `productService.js` (DELETE /api/products/:id)
- [x] T022 [US1] Implementar `getProductById()` en `productService.js` (GET /api/products/:id)
- [x] T023 [US1] Crear componente `Breadcrumb.jsx` para navegación jerárquica
- [x] T024 [US1] Crear componente `ImageGallery.jsx` adaptando diseño HTML del formulario
- [x] T025 [US1] Implementar upload de imágenes en ImageGallery (main + 3 thumbnails)
- [x] T026 [US1] Crear componente `ProductFormFields.jsx` con inputs minimalistas
- [x] T027 [US1] Crear componente `ProductPricing.jsx` con precios efectivo/lista
- [x] T028 [US1] Crear componente `InventorySizeManager.jsx` con checkboxes de tallas
- [x] T029 [US1] Crear componente `FormFooter.jsx` fijo con botones Cancelar/Guardar
- [x] T030 [US1] Ensamblar `ProductForm.jsx` integrando todos los sub-componentes
- [x] T031 [US1] Implementar validación de campos en ProductForm (precio > 0, campos requeridos)
- [x] T032 [US1] Crear página `CreateProductPage.jsx` usando ProductForm
- [x] T033 [US1] Crear página `EditProductPage.jsx` usando ProductForm con datos pre-cargados
- [x] T034 [US1] Crear componente `ProductActions.jsx` con botones de editar/eliminar
- [x] T035 [US1] Implementar confirmación de eliminación usando Modal
- [x] T036 [US1] Agregar manejo de errores específicos (validación fallida, producto no encontrado)
- [x] T037 [US1] Agregar redirección después de crear/editar exitosamente
- [x] T038 [US1] Agregar notificaciones toast para acciones exitosas

*Checkpoint*: El admin puede crear, editar y eliminar productos de forma independiente

---

## Phase 5: User Story 2 - Listado y Búsqueda de Productos (Priority: P1)

*Goal*: Mostrar todos los productos y permitir búsqueda por nombre

*Independent Test*: Ver la lista de productos al cargar la página, buscar un producto por nombre y verificar filtrado

### Implementación para User Story 2

- [x] T039 [US2] Implementar `getAllProducts()` en `productService.js` (GET /api/products)
- [x] T040 [US2] Implementar `searchProducts()` en `productService.js` (GET /api/products?search=nombre)
- [x] T041 [US2] Crear componente `ProductStatusBadge.jsx` (En Stock, Agotado, Bajo Stock)
- [x] T042 [US2] Crear componente `ProductTableRow.jsx` adaptando diseño HTML de las filas
- [x] T043 [US2] Crear componente `ProductTable.jsx` que use ProductTableRow
- [x] T044 [US2] Integrar ProductActions en ProductTableRow (botones editar/eliminar)
- [x] T045 [US2] Crear componente `Pagination.jsx` adaptando diseño HTML del footer
- [/] T046 [US2] Crear componente `SearchBar.jsx` con debounce para búsqueda
- [ ] T047 [US2] Crear componente `FilterButton.jsx` para filtros (diseño del HTML)
- [x] T048 [US2] Crear página `ProductsPage.jsx` integrando todos los componentes de tabla
- [/] T049 [US2] Implementar estado de carga mientras se obtienen productos (skeleton/spinner)
- [/] T050 [US2] Implementar mensaje "No se encontraron productos" cuando búsqueda está vacía
- [ ] T051 [US2] Conectar búsqueda del Header con filtrado de productos
- [/] T052 [US2] Implementar funcionalidad de paginación (navegación entre páginas)
- [/] T053 [US2] Agregar hover effects en filas de tabla según diseño HTML

*Checkpoint*: El admin puede ver todos los productos y buscarlos por nombre independientemente

---

## Phase 6: Polish & Cross-Cutting Concerns

*Purpose*: Mejoras visuales y experiencia de usuario

- [ ] T054 Agregar indicadores de carga (spinners/skeletons) durante llamadas API
- [ ] T055 Agregar animaciones suaves en transiciones (según diseño HTML)
- [ ] T056 Implementar sistema de notificaciones toast para acciones exitosas
- [ ] T057 Revisar responsive design en móviles (sidebar colapsable)
- [ ] T058 Agregar mensajes amigables para todos los casos de error
- [ ] T059 Optimizar performance (memoización de componentes, lazy loading)
- [ ] T060 Verificar accesibilidad (a11y) y navegación por teclado
- [ ] T061 Pulir animaciones de hover y transiciones del diseño HTML
- [ ] T062 Agregar estilos CSS personalizados (minimal-input, scrollbar)

---

## Dependencies & Execution Order

### Phase Dependencies

- *Setup (Phase 1)*: Sin dependencias - puede iniciar inmediatamente
- *Foundational (Phase 2)*: Depende de Setup - BLOQUEA todas las fases siguientes
- *Layout Components (Phase 3)*: Depende de Foundational - Requerido para todas las páginas
- *User Story 1 (Phase 4)*: Depende de Foundational y Layout - CRUD de productos
- *User Story 2 (Phase 5)*: Depende de Foundational y Layout - Listado y búsqueda (puede proceder en paralelo con Phase 4)
- *Polish (Phase 6)*: Depende de que todas las user stories estén completas

### User Story Dependencies

- *User Story 1 (P1)*: Puede iniciar después de Phase 3 (Layout) - Sin dependencias de otras stories
- *User Story 2 (P1)*: Puede iniciar después de Phase 3 (Layout) - Usa ProductActions de US1 pero es independiente

### Within Each User Story

- Servicios API antes que componentes
- Componentes atómicos (StatusBadge, ProductActions) antes que compuestos (ProductTable)
- Componentes antes que páginas
- Validaciones y manejo de errores después de funcionalidad básica
- Tests después de implementación

## Notes

- El backend ya está completo, solo se consume la API existente
- Se proporcionaron 2 diseños HTML completos:
  1. **Tabla de productos**: Diseño premium con Playfair Display + Inter, dark mode
  2. **Formulario de crear/editar**: Diseño minimalista con inputs border-bottom only
- Componentes identificados: 19 componentes React totales
  - Layout: Sidebar, Header, MainLayout (3)
  - Products: ProductTable, ProductTableRow, ProductStatusBadge, ProductForm, ProductActions (5)
  - Form: ImageGallery, ProductFormFields, ProductPricing, InventorySizeManager (4)
  - Shared: SearchBar, FilterButton, Pagination, Modal, ErrorMessage, Breadcrumb, FormFooter (7)
- Tema personalizado de Tailwind: Playfair Display (tabla) + Inter (todo), colores black/white
- Estilos personalizados: `.minimal-input` (border-bottom only), scrollbar custom
- Cada user story debe ser testeable independientemente
- Usar Tailwind CSS para los estilos (configuración personalizada incluida en HTML)
- La tabla de productos usa un diseño premium con hover effects y transiciones suaves
- El formulario usa un layout de 2 columnas con sticky gallery
- Commit después de cada tarea o grupo lógico
- Validar en cada checkpoint que las stories funcionan independientemente
- Total: 62 tareas organizadas en 6 fases
