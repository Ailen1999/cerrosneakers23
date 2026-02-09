# Especificación de Funcionalidad: Panel de Administración de Productos

*Creado*: 2026-01-25

## Escenarios de Usuario y Pruebas (obligatorio)

<!--
  IMPORTANTE: Las historias de usuario deben estar PRIORIZADAS como recorridos de usuario ordenados por importancia.
  Cada historia/recorrido de usuario debe ser TESTEABLE INDEPENDIENTEMENTE - es decir, si implementas solo UNA de ellas,
  aún deberías tener un MVP (Producto Mínimo Viable) que entregue valor.
-->

### Historia de Usuario 1 - Gestión de Productos (CRUD) (Prioridad: P1)

Como administrador, quiero poder crear, actualizar y eliminar productos para poder gestionar el inventario de la tienda.

*Por qué esta prioridad*: Esta es la funcionalidad central de un panel de administración. Sin esto, el admin no puede gestionar productos.

*Prueba Independiente*: Puede probarse completamente creando un producto, verificando que aparece, editándolo, verificando el cambio, y luego eliminándolo.

*Escenarios de Aceptación*:

1. *Dado* la lista de productos, *Cuando* hago clic en "Crear Producto", *Entonces* veo un formulario para ingresar los detalles del producto.
2. *Dado* un formulario de producto completo, *Cuando* lo envío, *Entonces* el producto se guarda y soy redirigido a la lista.
3. *Dado* un producto en la lista, *Cuando* hago clic en "Editar", *Entonces* veo un formulario pre-llenado con los datos existentes.
4. *Dado* un producto en la lista, *Cuando* hago clic en "Eliminar", *Entonces* el producto se elimina de la lista.

---

### Historia de Usuario 2 - Listado y Búsqueda de Productos (Prioridad: P1)

Como administrador, quiero ver una lista de todos los productos y buscarlos por nombre para poder encontrar fácilmente artículos específicos a gestionar.

*Por qué esta prioridad*: Con un inventario creciente, encontrar un producto manualmente se vuelve difícil.

*Prueba Independiente*: Puede probarse teniendo múltiples productos y escribiendo un nombre en la barra de búsqueda.

*Escenarios de Aceptación*:

1. *Dado* que el panel de admin carga, *Cuando* veo el dashboard, *Entonces* veo una lista de todos los productos.
2. *Dado* la lista de productos, *Cuando* escribo un nombre en la barra de búsqueda, *Entonces* la lista se filtra para mostrar solo productos coincidentes.

---

### Casos Límite

- El sistema debe validar los campos del formulario. Si el precio es negativo u otros campos son inválidos, no debe permitir crear el producto y debe mostrar un mensaje de error específico.
- Cuando la búsqueda no encuentra productos, el sistema debe mostrar un mensaje claro "No se encontraron productos" en lugar de una lista vacía sin contexto.
- Si el backend está caído o no responde, el sistema debe mostrar al usuario un mensaje amigable indicando que hay un problema de conexión e invitarlo a intentar más tarde.

## Requerimientos (obligatorio)

### Requerimientos Funcionales

- *FR-001*: El sistema DEBE permitir crear un producto con detalles (Nombre, Precio, Categoría, etc.).
- *FR-002*: El sistema DEBE permitir editar un producto existente.
- *FR-003*: El sistema DEBE permitir eliminar un producto (soft delete o hard delete según el backend, actualmente hard delete).
- *FR-004*: El sistema DEBE listar todos los productos con paginación (opcional, pero buena práctica) o scroll infinito.
- *FR-005*: El sistema DEBE permitir filtrar/buscar productos por nombre.
- *FR-006*: El frontend DEBE estar construido con React.
- *FR-007*: El frontend DEBE usar la API del backend existente en `/api/products`.

### Entidades Clave

- *Producto*: Representa un artículo en la tienda. Tiene ID, Nombre, Precio, Categoría, etc.

## Estrategia de Estructura del Frontend

Inicializaremos una nueva aplicación React en el directorio `frontend/`.

- **Stack Tecnológico**: React (Vite), CSS Vanilla.
- **Estructura del Proyecto**:
    - `src/components`: Componentes UI reutilizables (ProductCard, Modal, FormInput).
    - `src/pages`:
        - `AdminDashboard`: Lista de productos + Barra de búsqueda.
        - `ProductForm`: Usado para Crear y Editar.
    - `src/services`: Llamadas a la API (axios o wrapper de fetch para `/api/products`).

## Criterios de Éxito (obligatorio)

### Resultados Medibles

- *SC-001*: El admin puede crear un producto y verlo en la lista inmediatamente.
- *SC-002*: Los resultados de búsqueda se actualizan en un tiempo razonable (<1s) después de escribir (o presionar enter).
- *SC-003*: Los usuarios/Admin pueden eliminar un producto erróneo.
