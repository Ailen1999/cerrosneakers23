# Feature Specification: Backend API - Catálogo de Productos

*Created*: 2026-01-23  

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

### User Story 1 - Crear Nuevo Producto (Priority: P1)

El administrador necesita poder agregar nuevos productos al catálogo de la tienda de indumentaria a través del API.

*Why this priority*: Sin la capacidad de crear productos, el catálogo estaría vacío. Esta es la funcionalidad más básica y crítica para comenzar a poblar el sistema.

*Independent Test*: Se puede probar completamente mediante una llamada POST al endpoint `/api/products` con datos válidos de un producto, verificando que retorne un código 201 y el producto creado con su ID asignado.

*Acceptance Scenarios*:

1. *Given* el API está corriendo y la base de datos está vacía, *When* envío una solicitud POST a `/api/products` con datos válidos de producto (nombre, descripción, precio, stock, categoría, tallas, colores), *Then* recibo un código 201, el producto se guarda en la base de datos con un ID único, y la respuesta contiene todos los datos del producto creado.

2. *Given* el API está corriendo, *When* envío una solicitud POST a `/api/products` con datos inválidos (precio negativo, campos requeridos faltantes), *Then* recibo un código 400 con mensajes de error descriptivos indicando qué campos son inválidos.

3. *Given* el API está corriendo, *When* envío una solicitud POST a `/api/products` con un SKU que ya existe en la base de datos, *Then* recibo un código 409 (Conflict) indicando que el producto ya existe.

---

### User Story 2 - Listar Todos los Productos (Priority: P1)

Los usuarios del sistema (frontend, apps móviles) necesitan obtener una lista de todos los productos disponibles en el catálogo.

*Why this priority*: Esta es la funcionalidad core que permite visualizar el catálogo. Sin esta capacidad, no se puede mostrar productos a los clientes finales.

*Independent Test*: Se puede probar completamente mediante una llamada GET a `/api/products` después de haber creado algunos productos de prueba, verificando que retorne un código 200 y un array con todos los productos.

*Acceptance Scenarios*:

1. *Given* existen múltiples productos en la base de datos, *When* envío una solicitud GET a `/api/products`, *Then* recibo un código 200 y un array JSON con todos los productos, cada uno conteniendo todos sus atributos (id, nombre, descripción, precio, stock, categoría, etc.).

2. *Given* la base de datos está vacía, *When* envío una solicitud GET a `/api/products`, *Then* recibo un código 200 y un array vacío.

3. *Given* existen productos en la base de datos, *When* envío una solicitud GET a `/api/products?limit=10&offset=0`, *Then* recibo un código 200 con los primeros 10 productos (soporte de paginación).

---

### User Story 3 - Buscar Productos por Filtros (Priority: P2)

Los usuarios necesitan poder filtrar productos por diferentes criterios (categoría, rango de precio, disponibilidad de tallas, colores) para encontrar rápidamente lo que buscan.

*Why this priority*: Mejora significativamente la experiencia de usuario al permitir búsquedas específicas. Es importante pero no crítico para un MVP inicial.

*Independent Test*: Se puede probar creando productos con diferentes atributos y luego realizando llamadas GET a `/api/products?category=remeras` o `/api/products?min_price=1000&max_price=5000`, verificando que solo retorne productos que cumplan los criterios.

*Acceptance Scenarios*:

1. *Given* existen productos de diferentes categorías, *When* envío GET a `/api/products?category=remeras`, *Then* recibo solo productos de la categoría "remeras".

2. *Given* existen productos con diferentes precios, *When* envío GET a `/api/products?min_price=1000&max_price=5000`, *Then* recibo solo productos cuyo precio esté entre 1000 y 5000.

3. *Given* existen productos con diferentes tallas, *When* envío GET a `/api/products?size=M`, *Then* recibo solo productos que tengan talla M disponible.

4. *Given* existen productos con diferentes colores, *When* envío GET a `/api/products?color=rojo`, *Then* recibo solo productos disponibles en color rojo.

5. *Given* existen productos, *When* envío GET a `/api/products?search=jean`, *Then* recibo productos cuyo nombre o descripción contenga la palabra "jean".

---

### User Story 4 - Obtener Producto por ID (Priority: P2)

Los usuarios necesitan obtener los detalles completos de un producto específico usando su identificador único.

*Why this priority*: Necesario para mostrar páginas de detalle de producto. Importante para la navegación pero no crítico para listar el catálogo inicial.

*Independent Test*: Crear un producto, obtener su ID, y luego realizar GET a `/api/products/{id}` verificando que retorne el producto completo.

*Acceptance Scenarios*:

1. *Given* existe un producto con ID "123", *When* envío GET a `/api/products/123`, *Then* recibo código 200 con todos los detalles del producto.

2. *Given* no existe un producto con ID "999", *When* envío GET a `/api/products/999`, *Then* recibo código 404 con mensaje "Product not found".

---

### User Story 5 - Actualizar Producto Existente (Priority: P2)

El administrador necesita poder actualizar la información de productos existentes (precio, stock, descripción, etc.).

*Why this priority*: Esencial para mantener el catálogo actualizado, pero el sistema puede funcionar inicialmente sin esta capacidad si los productos son correctamente creados.

*Independent Test*: Crear un producto, luego enviar PUT a `/api/products/{id}` con datos modificados, y verificar que los cambios se persistan correctamente.

*Acceptance Scenarios*:

1. *Given* existe un producto con ID "123", *When* envío PUT a `/api/products/123` con precio actualizado, *Then* recibo código 200 y el producto con el nuevo precio.

2. *Given* existe un producto con ID "123", *When* envío PUT a `/api/products/123` con datos inválidos, *Then* recibo código 400 con mensajes de error.

3. *Given* no existe un producto con ID "999", *When* envío PUT a `/api/products/999`, *Then* recibo código 404.

4. *Given* existe un producto con ID "123", *When* envío PATCH a `/api/products/123` con solo el campo stock actualizado, *Then* recibo código 200 y solo el stock se actualiza, manteniendo los demás campos sin cambios.

---

### User Story 6 - Eliminar Producto (Priority: P3)

El administrador necesita poder eliminar productos del catálogo que ya no se venden o fueron creados por error.

*Why this priority*: Útil para mantenimiento del catálogo, pero no crítico para operación inicial. Puede posponerse si hay limitaciones de tiempo.

*Independent Test*: Crear un producto, luego enviar DELETE a `/api/products/{id}` y verificar que retorne 204 y el producto ya no exista en la base de datos.

*Acceptance Scenarios*:

1. *Given* existe un producto con ID "123", *When* envío DELETE a `/api/products/123`, *Then* recibo código 204 (No Content) y el producto se elimina de la base de datos.

2. *Given* no existe un producto con ID "999", *When* envío DELETE a `/api/products/999`, *Then* recibo código 404.

3. *Given* existe un producto con ID "123", *When* envío DELETE a `/api/products/123` dos veces, *Then* la primera llamada retorna 204 y la segunda retorna 404.

---

### Edge Cases

- **Precio 0 o negativo**: El sistema DEBE retornar error 400 indicando que el precio debe ser mayor a 0. No se permite crear o actualizar productos con precio 0 o negativo.
- **Stock 0**: Los productos con stock 0 se manejan normalmente, siguen visibles en el catálogo. No hay distinción especial entre productos con stock 0 vs productos descontinuados en esta versión.
- **Imágenes**: Cada producto puede tener un máximo de 4 URLs de imágenes. Solo se persisten las URLs (no los archivos). La validación de formato de URL es suficiente para MVP.
- **Paginación con offset mayor al total**: El sistema debe retornar un array vacío de productos, pero DEBE incluir en la respuesta el total de productos disponibles en la base de datos (para que el frontend pueda calcular páginas correctamente).
- **Filtros básicos**: Para el MVP, implementar solo filtrado básico por categoría y búsqueda por texto. Filtros avanzados (precio, talla, color) se iterarán en versiones posteriores.
- **Base de datos bloqueada**: El sistema debe reintentar la operación hasta 3 veces antes de retornar error 500.
- **Consultas concurrentes**: SQLite maneja esto con locks automáticos. El sistema debe manejar errores de database locked apropiadamente.
- **Fallo de conexión a BD**: Retornar error 500 con mensaje descriptivo "Error de conexión con la base de datos".

## Requirements (mandatory)

### Functional Requirements

#### API Endpoints

- *FR-001*: Sistema DEBE exponer endpoint POST `/api/products` para crear nuevos productos con validación completa de datos
- *FR-002*: Sistema DEBE exponer endpoint GET `/api/products` para listar todos los productos con soporte de paginación (limit, offset)
- *FR-003*: Sistema DEBE exponer endpoint GET `/api/products/{id}` para obtener un producto específico por su ID
- *FR-004*: Sistema DEBE exponer endpoint PUT `/api/products/{id}` para actualizar completamente un producto
- *FR-005*: Sistema DEBE exponer endpoint PATCH `/api/products/{id}` para actualizar parcialmente un producto
- *FR-006*: Sistema DEBE exponer endpoint DELETE `/api/products/{id}` para eliminar un producto
- *FR-007*: Sistema DEBE soportar filtros query params básicos: `category` y `search` en el endpoint GET `/api/products` (filtros avanzados se implementarán en iteraciones futuras)

#### Validaciones

- *FR-008*: Sistema DEBE validar que campos requeridos no estén vacíos (nombre, precio, categoría)
- *FR-009*: Sistema DEBE validar que el precio sea un número positivo mayor a 0
- *FR-010*: Sistema DEBE validar que el stock sea un número entero no negativo
- *FR-011*: Sistema DEBE validar formatos de URLs para imágenes y que no se excedan 4 imágenes por producto
- *FR-013*: Sistema DEBE retornar mensajes de error descriptivos en formato JSON cuando falla una validación

#### Persistencia de Datos

- *FR-014*: Sistema DEBE persistir todos los productos en una base de datos SQLite
- *FR-015*: Sistema DEBE generar IDs únicos automáticamente para cada producto nuevo
- *FR-015.1*: Sistema DEBE retornar junto con los productos listados el total count de productos en la base de datos para facilitar paginación
- *FR-016*: Sistema DEBE registrar timestamps de creación y última actualización para cada producto
- *FR-017*: Sistema DEBE usar transacciones para garantizar integridad de datos en operaciones de escritura

#### Manejo de Errores

- *FR-018*: Sistema DEBE retornar código HTTP 201 para creaciones exitosas
- *FR-019*: Sistema DEBE retornar código HTTP 200 para consultas y actualizaciones exitosas
- *FR-020*: Sistema DEBE retornar código HTTP 204 para eliminaciones exitosas
- *FR-021*: Sistema DEBE retornar código HTTP 400 para errores de validación o datos inválidos
- *FR-022*: Sistema DEBE retornar código HTTP 404 cuando no se encuentra un recurso
- *FR-023*: Sistema DEBE retornar código HTTP 500 para errores internos del servidor
- *FR-025*: Sistema DEBE incluir mensajes de error descriptivos en español en todas las respuestas de error

#### Performance y Seguridad

- *FR-024*: Sistema DEBE implementar indices en la base de datos para búsquedas eficientes (category, price)
- *FR-027*: Sistema DEBE implementar límites de rate limiting para prevenir abuso de API
- *FR-028*: Sistema DEBE validar y sanitizar todas las entradas del usuario para prevenir SQL injection
- *FR-029*: Sistema DEBE implementar CORS configurado apropiadamente para permitir acceso desde el frontend
- *FR-030*: Sistema DEBE implementar logging de todas las operaciones para auditoría y debugging

### Key Entities

#### Producto (Product)

La entidad central del sistema que representa un artículo de indumentaria en el catálogo:

**Atributos principales:**
- *ID*: Identificador único autogenerado (integer, primary key)
- *Nombre*: Nombre descriptivo del producto (string, required) - ej: "Remera Lisa Cuello Redondo"
- *Descripción*: Descripción detallada (text, optional) - ej: "Remera 100% algodón, corte clásico..."
- *Categoría*: Tipo de prenda (string, required) - ej: "remeras", "pantalones", "camperas"
- *Precio*: Precio de venta (decimal, required, > 0) - ej: 4500.00
- *Stock*: Cantidad disponible (integer, required, >= 0) - ej: 25
- *Tallas*: Tallas disponibles (array/JSON, optional) - ej: ["S", "M", "L", "XL"]
- *Colores*: Colores disponibles (array/JSON, optional) - ej: ["rojo", "azul", "negro"]
- *Imágenes*: URLs de imágenes del producto (array/JSON, optional, max 4 items) - ej: ["/images/prod1.jpg", "/images/prod1-2.jpg"]
- *Marca*: Marca del producto (string, optional) - ej: "Nike"
- *Activo*: Si el producto está activo/visible (boolean, default true)
- *CreatedAt*: Timestamp de creación (datetime, auto)
- *UpdatedAt*: Timestamp de última actualización (datetime, auto)

**Relaciones:**
- Ninguna en MVP inicial (puede expandirse a futuro con Categorías, Marcas, etc. como entidades separadas)

**Reglas de negocio:**
- Precio debe ser siempre mayor a 0
- Stock puede ser 0 pero no negativo
- Si stock es 0, el producto sigue visible pero marcado como "sin stock"
- Al eliminar un producto, se hace eliminación física (no soft delete en MVP)

## Success Criteria (mandatory)

### Measurable Outcomes

- *SC-001*: El API puede manejar la creación de al menos 100 productos sin errores
- *SC-002*: Las consultas GET a `/api/products` con 1000+ productos retornan en menos de 500ms
- *SC-003*: Todas las operaciones CRUD funcionan correctamente con un 100% de éxito en pruebas manuales
- *SC-004*: El sistema valida correctamente el 100% de los casos de datos inválidos definidos en los tests
- *SC-005*: La base de datos SQLite ocupa menos de 50MB para 1000 productos con imágenes como URLs
- *SC-006*: El binario compilado de Golang tiene un tamaño menor a 20MB
- *SC-007*: El API puede iniciarse y estar funcional en menos de 2 segundos
- *SC-008*: Búsquedas con filtros retornan resultados correctos en el 100% de los casos de prueba
- *SC-009*: El sistema maneja correctamente errores de base de datos bloqueada o inaccesible sin perder datos
- *SC-010*: El código tiene una cobertura de tests unitarios de al menos 70% en funciones críticas de negocio
