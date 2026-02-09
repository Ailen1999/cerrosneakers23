# Componentes Identificados del HTML - Panel de Administración

Este documento describe los componentes React que deben crearse basándose en el diseño HTML proporcionado.

## Estructura de Componentes

### Layout Components (`src/components/layout/`)

#### 1. **Sidebar.jsx**
- Navegación lateral completa (negro sólido)
- Logo "CerroSn ADMIN"
- Navegación con iconos de Material Symbols
- Secciones: Principal, Sistema
- Perfil de usuario en el footer
- Estado activo con borde blanco izquierdo
- Badges de notificación (ej: "3" en Pedidos)
- Hover effects con escala en iconos

**Props:**
```jsx
{
  activeRoute: string,
  userProfile: { name: string, email: string, initials: string }
}
```

#### 2. **Header.jsx**
- Barra superior con fondo blanco/dark
- Título de página actual
- Búsqueda global integrada
- Botón de notificaciones con badge rojo
- Toggle de dark/light mode
- Botón de menú mobile (hamburger)

**Props:**
```jsx
{
  pageTitle: string,
  onSearch: (query) => void,
  notificationCount: number
}
```

#### 3. **MainLayout.jsx**
- Wrapper que combina Sidebar + Header + children
- Manejo de overflow y altura completa
- Responsive: sidebar oculto en mobile

**Props:**
```jsx
{
  children: ReactNode
}
```

---

### Product Components (`src/components/products/`)

#### 4. **ProductTable.jsx**
- Tabla completa con headers
- Columnas: Imagen, Nombre, Categoría, Efectivo, Crédito, Estado, Acciones
- Sort indicator en columna "Nombre"
- Wrapper de overflow-x-auto
- Integra ProductTableRow

**Props:**
```jsx
{
  products: Product[],
  onEdit: (id) => void,
  onDelete: (id) => void,
  onSort: (column) => void
}
```

#### 5. **ProductTableRow.jsx**
- Fila individual de producto
- Imagen 16x12 (h-16 w-12)
- Nombre con font Playfair Display
- SKU en texto gris pequeño
- Precios alineados a la derecha
- Hover effect (bg-gray-50 dark)
- Integra ProductStatusBadge y ProductActions

**Props:**
```jsx
{
  product: Product,
  onEdit: () => void,
  onDelete: () => void
}
```

#### 6. **ProductStatusBadge.jsx**
- Badge redondeado con punto de color
- Estados:
  - En Stock (verde)
  - Agotado (gris)
  - Bajo Stock (naranja)
- Uppercase, tracking-wider, bold

**Props:**
```jsx
{
  status: 'in-stock' | 'out-of-stock' | 'low-stock'
}
```

#### 7. **ProductActions.jsx**
- Botones de Editar y Eliminar
- Iconos: edit, delete (Material Symbols)
- Hover: blue para edit, red para delete
- Opacity 60% por defecto, 100% en hover de la fila
- Border-radius circular

**Props:**
```jsx
{
  onEdit: () => void,
  onDelete: () => void
}
```

#### 8. **ProductForm.jsx**
- Formulario completo para crear/editar producto
- Layout de 2 columnas: Galería (izq) + Campos (der)
- Integra: ImageGallery, ProductFormFields, ProductPricing, InventorySizeManager
- Footer fijo con botones Cancelar/Guardar
- Validación: precio > 0, campos requeridos
- Modo: create | edit

**Props:**
```jsx
{
  initialData?: Product,
  onSubmit: (data) => void,
  onCancel: () => void,
  mode: 'create' | 'edit'
}
```

---

### Form Components (`src/components/products/form/`)

#### 9. **ImageGallery.jsx**
- Componente de galería de imágenes del producto
- Imagen principal (aspect-ratio 3:4)
- 3 miniaturas secundarias (aspect-ratio 1:1)
- Placeholders con icono "add"
- Hover effects: border-black, grayscale-0
- Upload de imágenes

**Props:**
```jsx
{
  images: string[],
  onImageUpload: (file, index) => void,
  onImageRemove: (index) => void
}
```

#### 10. **ProductFormFields.jsx**
- Sección "Información General"
- Campos: Nombre, Categoría, SKU (auto-generado, disabled), Descripción
- Input minimalista con border-bottom only
- Focus effect: border-bottom-black

**Props:**
```jsx
{
  formData: { name, category, sku, description },
  onChange: (field, value) => void,
  errors?: Record<string, string>
}
```

#### 11. **ProductPricing.jsx**
- Sección "Precios"
- Precio Efectivo y Precio Lista
- Símbolo $ a la izquierda
- Input type="number" con minimal-input style

**Props:**
```jsx
{
  prices: { cash: number, card: number },
  onChange: (type, value) => void,
  errors?: Record<string, string>
}
```

#### 12. **InventorySizeManager.jsx**
- Sección "Inventario"
- Tabla con checkboxes para tallas (XS, S, M, L, XL)
- Input de stock habilitado solo si checkbox está marcado
- Hover effect en filas no seleccionadas
- Background neutral-50 en filas seleccionadas

**Props:**
```jsx
{
  sizes: Array<{ size: string, enabled: boolean, stock: number }>,
  onSizeToggle: (size) => void,
  onStockChange: (size, stock) => void
}
```

#### 13. **Breadcrumb.jsx**
- Navegación breadcrumb
- Formato: Inicio / Productos / Añadir Producto
- Separador: "/" en neutral-300
- Links hover en negro, último ítem en negro sin hover

**Props:**
```jsx
{
  items: Array<{ label: string, href?: string }>
}
```

#### 14. **FormFooter.jsx**
- Footer fijo en bottom con backdrop-blur
- Botones: Cancelar (outline) y Guardar (filled)
- Position fixed con left-offset para sidebar

**Props:**
```jsx
{
  onCancel: () => void,
  onSave: () => void,
  saveText?: string,
  cancelText?: string,
  isSaving?: boolean
}
```

---

### Shared Components (`src/components/shared/`)

#### 15. **SearchBar.jsx**
- Input con icono de búsqueda
- Placeholder: "Buscar productos..."
- Debounce de 300ms
- Background gris claro/oscuro
- Focus ring negro/blanco

**Props:**
```jsx
{
  onSearch: (query) => void,
  placeholder?: string
}
```

#### 16. **FilterButton.jsx**
- Botón con icono "filter_list"
- Border gris, hover bg-gray-50
- Texto "Filtrar"

**Props:**
```jsx
{
  onClick: () => void
}
```

#### 17. **Pagination.jsx**
- Footer de tabla con info de resultados
- Botones: anterior, números de página, siguiente
- Página actual resaltada
- Disabled en primera/última página
- Texto: "Mostrando X a Y de Z resultados"

**Props:**
```jsx
{
  currentPage: number,
  totalPages: number,
  totalItems: number,
  itemsPerPage: number,
  onPageChange: (page) => void
}
```

#### 18. **Modal.jsx**
- Modal genérico para confirmaciones
- Backdrop oscuro
- Botones: Confirmar, Cancelar
- Título y mensaje personalizables

**Props:**
```jsx
{
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  title: string,
  message: string,
  confirmText?: string,
  cancelText?: string
}
```

#### 19. **ErrorMessage.jsx**
- Mensaje de error amigable
- Tipos: error, warning, info
- Con icono y cierre
- Auto-dismiss opcional

**Props:**
```jsx
{
  message: string,
  type: 'error' | 'warning' | 'info',
  onClose?: () => void,
  autoDismiss?: number
}
```

---

## Páginas (`src/pages/`)

### 1. **Dashboard.jsx**
- Página principal (placeholder por ahora)
- Usa MainLayout

### 2. **ProductsPage.jsx**
- Página principal de gestión de productos
- Usa MainLayout, ProductTable, SearchBar, FilterButton, Pagination
- Header con botón "Añadir Producto"
- Botones de Filtrar y Exportar

### 3. **CreateProductPage.jsx**
- Formulario de creación en modo 'create'
- Usa MainLayout, ProductForm

### 4. **EditProductPage.jsx**
- Formulario de edición en modo 'edit'
- Carga datos del producto por ID
- Usa MainLayout, ProductForm

---

## Tema Tailwind Personalizado

```javascript
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#333333",
        "background-light": "#FFFFFF",
        "background-dark": "#121212",
        "surface-light": "#F9F9F9",
        "surface-dark": "#1E1E1E",
        "border-light": "#E5E5E5",
        "border-dark": "#333333",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0px",
        "sm": "2px",
        "md": "4px",
      },
    },
  },
};
```

## Fuentes Requeridas

- **Playfair Display**: Para títulos y nombres de productos (font-display)
- **Inter**: Para texto general (font-sans)
- **Material Symbols Outlined**: Para todos los iconos

## Scrollbar Personalizado

```css
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;
}
```

## Interacciones Clave

1. **Hover en filas de tabla**: bg-gray-50 dark:bg-[#262626]
2. **Acciones en hover**: opacity de 60% a 100%
3. **Botones con transiciones**: opacity, colors, scale
4. **Dark mode toggle**: global con `document.documentElement.classList.toggle('dark')`

---

## Diseño del Formulario (Create/Edit Product)

El formulario tiene un diseño **minimalista** diferente al de la tabla:

### Estilo Minimalista
- **Inputs con border-bottom only** (clase `.minimal-input`)
- Focus effect: solo border-bottom se vuelve negro
- Background transparente en todos los inputs
- Sin border-radius (0px)

### Layout de 2 Columnas
- **Columna izquierda (sticky)**: Galería de imágenes
- **Columna derecha**: Formulario con secciones (Info General, Precios, Inventario)

### Secciones del Formulario
1. **Galería**: Imagen principal 3:4 + 3 miniaturas 1:1
2. **Información General**: Nombre, Categoría, SKU auto-generado, Descripción
3. **Precios**: Efectivo y Lista con símbolo $ a la izquierda
4. **Inventario**: Checkboxes de tallas con input de stock

### Footer Fijo
- Position fixed con backdrop-blur
- Offset left para el sidebar
- Botones: Cancelar (outline) y Guardar (filled negro)

### Fuentes del Formulario
- Solo **Inter** (sin Playfair Display)
- Títulos en uppercase, tracking-wider, font-semibold

### Breadcrumb
- Navegación jerárquica arriba del título
- Separador "/" entre items
- Último item en negro (no link)
