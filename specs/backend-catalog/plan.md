# Implementation Plan: Backend API - Catálogo de Productos

*Date*: 2026-01-24  
*Spec*: [backend-api-spec.md](file:///c:/Users/USER/Desktop/TiendaEdgar/specs/backend-catalog/backend-api-spec.md)

## Summary

Implementar un backend API REST en Golang con SQLite para el catálogo de productos de una tienda de indumentaria. El sistema proveerá operaciones CRUD completas (Crear, Listar, Obtener por ID, Actualizar, Eliminar) con filtrado básico por categoría y búsqueda de texto. El objetivo es crear un MVP funcional y eficiente con bajo consumo de recursos.

## Technical Context

*Language/Version*: Go 1.21+  
*Primary Dependencies*: 
- `github.com/gin-gonic/gin` - Framework web HTTP
- `github.com/mattn/go-sqlite3` - Driver SQLite para database/sql
- `database/sql` - Paquete estándar de Go para manejo de SQL

*Storage*: SQLite (archivo local `catalog.db`)  
*Testing*: Go testing framework (`go test`), tests de integración con SQLite en memoria (`:memory:`)  
*Target Platform*: Linux/Windows servidor, compatible cross-platform  
*Project Type*: Backend API REST (single service)  
*Performance Goals*: 
- < 500ms para consultas de 1000+ productos
- Soportar creación de 100+ productos sin errores
- Inicio del servidor en < 2 segundos

*Constraints*: 
- Binario compilado < 20MB
- Base de datos < 50MB para 1000 productos
- Sin autenticación en MVP (iteración futura)

*Scale/Scope*: MVP para ~1000 productos, paginación soportada

## Project Structure

### Documentation (this feature)

```
specs/backend-catalog/
├── backend-api-spec.md    # Especificación funcional
└── plan.md                # Este archivo
```

### Source Code (repository root)

```
TiendaEdgar/
├── backend/
│   ├── main.go                    # Entry point de la aplicación
│   ├── go.mod                     # Dependencias Go
│   ├── go.sum                     # Checksums de dependencias
│   ├── config/
│   │   └── config.go              # Configuración (puerto, DB path, CORS)
│   ├── models/
│   │   └── product.go             # Modelo Product con validaciones
│   ├── database/
│   │   ├── db.go                  # Inicialización de SQLite/GORM
│   │   └── migrations.go          # AutoMigrate para schema
│   ├── repositories/
│   │   └── product_repository.go # Capa de acceso a datos
│   ├── services/
│   │   └── product_service.go     # Lógica de negocio y validaciones
│   ├── handlers/
│   │   └── product_handler.go     # HTTP handlers (controllers)
│   ├── middleware/
│   │   ├── cors.go                # Middleware CORS
│   │   ├── logger.go              # Logging de requests
│   │   └── error_handler.go       # Manejo global de errores
│   ├── routes/
│   │   └── routes.go              # Definición de rutas API
│   └── catalog.db                 # SQLite database (gitignored)
├── backend/tests/
│   ├── unit/
│   │   ├── product_service_test.go
│   │   └── product_model_test.go
│   └── integration/
│       └── product_api_test.go    # Tests end-to-end de API
└── .gitignore
```

*Structure Decision*: 
- Arquitectura en capas: Handlers → Services → Repositories → Database
- Separación de responsabilidades: modelos, lógica de negocio, acceso a datos
- Tests separados en unit/integration para facilitar ejecución selectiva
- SQL directo con database/sql para mayor control y menor overhead
- Prepared statements para seguridad y performance

---

## Phase 1: Setup (Shared Infrastructure)

*Purpose*: Inicialización del proyecto y configuración básica de Golang

- [x] **T001** Crear estructura de directorios del proyecto backend según plan
- [x] **T002** Inicializar módulo Go (`go mod init tiendaedgar/backend`) y agregar dependencias (gin, go-sqlite3)
- [x] **T003** Crear `.gitignore` para excluir `catalog.db`, binarios compilados, y archivos temporales
- [x] **T004** Crear `config/config.go` con configuración básica (puerto servidor, path DB, modo debug)

---

## Phase 2: Foundational (Blocking Prerequisites)

*Purpose*: Infraestructura core que DEBE estar completa antes de implementar user stories

*⚠️ CRITICAL*: No se puede comenzar trabajo de user stories hasta completar esta fase

- [x] **T005** Implementar `models/product.go` con struct Product completo (12 atributos) y tags JSON para serialización
- [x] **T006** Implementar `database/db.go` para inicializar conexión SQLite con database/sql
- [x] **T007** Implementar `database/migrations.go` con SQL raw para crear tabla products con índices y constraints
- [x] **T008** Crear `middleware/logger.go` para logging de todas las requests (método, path, status, duración)
- [x] **T009** Crear `middleware/error_handler.go` para manejo centralizado de errores con formato JSON consistente
- [x] **T010** Crear `middleware/cors.go` para configurar CORS apropiadamente (permitir desde frontend)
- [x] **T011** Implementar `routes/routes.go` con estructura básica de router Gin y middleware aplicados
- [x] **T012** Crear `main.go` con inicialización de DB, router, y servidor HTTP

*Checkpoint*: Servidor puede iniciar correctamente, conectar a SQLite, crear schema, y responder 404 a rutas no definidas

---

## Phase 3: User Story 1 - Crear Nuevo Producto (Priority: P1)

*Goal*: Permitir al administrador agregar nuevos productos al catálogo vía POST `/api/products`

*Independent Test*: Enviar POST con producto válido → recibir 201 + producto con ID asignado

### Tests for User Story 1

- [ ] **T013** [P] [US1] Test unitario para validación de producto en `tests/unit/product_model_test.go`
  - Validar precio > 0
  - Validar campos requeridos (nombre, precio, categoría)
  - Validar max 4 imágenes
  
- [ ] **T014** [P] [US1] Test de integración para creación en `tests/integration/product_api_test.go`
  - POST con datos válidos → 201 + producto creado
  - POST con precio negativo → 400 con error descriptivo
  - POST con campos faltantes → 400 con errores de validación

### Implementation for User Story 1

- [x] **T015** [P] [US1] Agregar métodos de validación en `models/product.go` (ValidateCreate, ValidatePrice, ValidateImages)
- [x] **T016** [US1] Implementar `repositories/product_repository.go` con método `Create(product *Product) error`
- [x] **T017** [US1] Implementar `services/product_service.go` con método `CreateProduct(product *Product) error` incluyendo validaciones
- [x] **T018** [US1] Implementar handler `CreateProduct` en `handlers/product_handler.go` 
- [x] **T019** [US1] Registrar ruta `POST /api/products` en `routes/routes.go` apuntando al handler

*Checkpoint*: Crear productos vía POST funciona correctamente con validaciones, retorna 201 y persiste en DB

---

## Phase 4: User Story 2 - Listar Todos los Productos (Priority: P1)

*Goal*: Obtener lista completa de productos con soporte de paginación vía GET `/api/products`

*Independent Test*: GET `/api/products` → 200 + array de productos + total count

### Tests for User Story 2

- [ ] **T020** [P] [US2] Test de integración para listado en `tests/integration/product_api_test.go`
  - GET con productos en DB → 200 + array con todos los productos + total count
  - GET con DB vacía → 200 + array vacío + total count = 0
  - GET con paginación `?limit=5&offset=0` → 200 + 5 productos + total count correcto
  - GET con offset mayor al total → 200 + array vacío + total count

### Implementation for User Story 2

- [x] **T021** [US2] Implementar `repositories/product_repository.go` con método `GetAll(limit, offset int) ([]Product, int, error)` usando SQL queries con LIMIT/OFFSET y COUNT
- [x] **T022** [US2] Implementar `services/product_service.go` con método `GetAllProducts(limit, offset int)` con valores default de paginación
- [x] **T023** [US2] Implementar handler `GetAllProducts` en `handlers/product_handler.go` con parseo de query params y respuesta con formato `{products: [...], total: N}`
- [x] **T024** [US2] Registrar ruta `GET /api/products` en `routes/routes.go`

*Checkpoint*: Listar productos funciona con y sin paginación, incluye total count en respuesta

---

## Phase 5: User Story 3 - Buscar Productos por Filtros (Priority: P2)

*Goal*: Filtrar productos por categoría y búsqueda de texto vía query params

*Independent Test*: GET `/api/products?category=remeras` → solo productos de esa categoría

### Tests for User Story 3

- [ ] **T025** [P] [US3] Test de integración para filtros en `tests/integration/product_api_test.go`
  - GET `?category=remeras` → solo productos de categoría remeras
  - GET `?search=jean` → productos con "jean" en nombre o descripción
  - GET `?category=pantalones&search=azul` → combinación de filtros

### Implementation for User Story 3

- [x] **T026** [US3] Extender `repositories/product_repository.go` método GetAll para aceptar filtros (category, search string)
- [x] **T027** [US3] Implementar queries SQL con WHERE para filtrado por categoría y LIKE para búsqueda de texto
- [x] **T028** [US3] Actualizar `services/product_service.go` para pasar filtros al repository
- [x] **T029** [US3] Actualizar handler `GetAllProducts` en `handlers/product_handler.go` para parsear query params de filtros

*Checkpoint*: Filtrado básico por categoría y búsqueda funciona correctamente

---

## Phase 6: User Story 4 - Obtener Producto por ID (Priority: P2)

*Goal*: Obtener detalles completos de un producto específico vía GET `/api/products/{id}`

*Independent Test*: GET `/api/products/123` → 200 + producto completo o 404 si no existe

### Tests for User Story 4

- [ ] **T030** [P] [US4] Test de integración en `tests/integration/product_api_test.go`
  - GET con ID existente → 200 + producto completo
  - GET con ID inexistente → 404 con mensaje "Product not found"
  - GET con ID inválido (no numérico) → 400

### Implementation for User Story 4

- [x] **T031** [US4] Implementar `repositories/product_repository.go` con método `GetByID(id uint) (*Product, error)`
- [x] **T032** [US4] Implementar `services/product_service.go` con método `GetProductByID(id uint)`
- [x] **T033** [US4] Implementar handler `GetProductByID` en `handlers/product_handler.go` con manejo de errores 404
- [x] **T034** [US4] Registrar ruta `GET /api/products/:id` en `routes/routes.go`

*Checkpoint*: Obtener producto por ID funciona correctamente, retorna 404 para IDs inexistentes

---

## Phase 7: User Story 5 - Actualizar Producto Existente (Priority: P2)

*Goal*: Actualizar productos existentes vía PUT (completo) y PATCH (parcial) `/api/products/{id}`

*Independent Test*: PUT con datos válidos → 200 + producto actualizado

### Tests for User Story 5

- [ ] **T035** [P] [US5] Test de integración en `tests/integration/product_api_test.go`
  - PUT con datos válidos → 200 + producto actualizado
  - PUT con ID inexistente → 404
  - PUT con precio inválido → 400
  - PATCH actualizando solo stock → 200 + solo stock cambiado

### Implementation for User Story 5

- [x] **T036** [US5] Implementar `repositories/product_repository.go` con métodos `Update(product *Product) error` y `PartialUpdate(id uint, updates map[string]interface{}) error`
- [x] **T037** [US5] Implementar `services/product_service.go` con métodos `UpdateProduct` (validación completa) y `PartialUpdateProduct`
- [x] **T038** [US5] Implementar handlers `UpdateProduct` y `PartialUpdateProduct` en `handlers/product_handler.go`
- [x] **T039** [US5] Registrar rutas `PUT /api/products/:id` y `PATCH /api/products/:id` en `routes/routes.go`

*Checkpoint*: Actualización completa (PUT) y parcial (PATCH) funcionan correctamente con validaciones

---

## Phase 8: User Story 6 - Eliminar Producto (Priority: P3)

*Goal*: Eliminar productos del catálogo vía DELETE `/api/products/{id}`

*Independent Test*: DELETE con ID existente → 204, producto eliminado de DB

### Tests for User Story 6

- [x] **T040** [P] [US6] Test de integración en `tests/integration/product_api_test.go`
  - DELETE con ID existente → 204, producto no existe después
  - DELETE con ID inexistente → 404
  - DELETE dos veces el mismo producto → primera 204, segunda 404

### Implementation for User Story 6

- [x] **T041** [US6] Implementar `repositories/product_repository.go` con método `Delete(id uint) error`
- [x] **T042** [US6] Implementar `services/product_service.go` con método `DeleteProduct(id uint) error`
- [x] **T043** [US6] Implementar handler `DeleteProduct` en `handlers/product_handler.go` retornando 204
- [x] **T044** [US6] Registrar ruta `DELETE /api/products/:id` en `routes/routes.go`

*Checkpoint*: Eliminación de productos funciona correctamente, retorna 404 para IDs inexistentes

---

## Phase 9: Polish & Cross-Cutting Concerns

*Purpose*: Mejoras que afectan múltiples user stories y finalización del MVP

- [ ] **T045** Agregar retry logic (3 intentos) para operaciones de escritura en caso de DB bloqueada
- [ ] **T046** Implementar rate limiting middleware básico (opcional para MVP)
- [ ] **T047** Agregar validación y sanitización de inputs para prevenir SQL injection (verificar GORM lo hace automáticamente)
- [x] **T048** Crear archivo README.md con instrucciones de instalación, configuración y ejecución
- [x] **T049** Documentar endpoints en README o crear archivo API.md con ejemplos curl
- [ ] **T050** Optimización: verificar índices en SQLite están correctamente aplicados (category, price)
- [x] **T051** Agregar health check endpoint `GET /health` para monitoreo
- [ ] **T052** Code cleanup y formateo con `gofmt` y `go vet`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias - puede comenzar inmediatamente
- **Foundational (Phase 2)**: Depende de Setup (Phase 1) - **BLOQUEA** todas las user stories
- **User Stories (Phases 3-8)**: Todas dependen de Foundational (Phase 2) completada
  - User stories pueden proceder secuencialmente en orden de prioridad (P1 → P2 → P3)
  - US1 y US2 son P1 (críticas para MVP)
  - US3, US4, US5 son P2 (importantes pero no bloqueantes)
  - US6 es P3 (útil pero puede posponerse)
- **Polish (Phase 9)**: Depende de todas las user stories deseadas completadas

### User Story Dependencies

- **User Story 1 (P1)**: Puede comenzar después de Foundational - Sin dependencias de otras stories
- **User Story 2 (P1)**: Puede comenzar después de Foundational - Sin dependencias de otras stories
- **User Story 3 (P2)**: Puede comenzar después de Foundational - Extiende US2 pero es independiente
- **User Story 4 (P2)**: Puede comenzar después de Foundational - Sin dependencias de otras stories
- **User Story 5 (P2)**: Puede comenzar después de Foundational - Requiere US4 conceptualmente
- **User Story 6 (P3)**: Puede comenzar después de Foundational - Sin dependencias de otras stories

### Within Each User Story

- Tests primero (TDD approach) o en paralelo con implementación
- Models/Repository → Services → Handlers → Routes (orden de dependencias)
- Core implementation antes de edge cases
- Story completa antes de moverse a siguiente prioridad
- Verificar tests pasen antes de considerar story completa

---

## Verification Plan

### Automated Tests

**Comando para ejecutar todos los tests:**
```bash
cd backend
go test ./tests/... -v
```

**Tests unitarios solamente:**
```bash
go test ./tests/unit/... -v
```

**Tests de integración solamente:**
```bash
go test ./tests/integration/... -v
```

**Cobertura de código:**
```bash
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out
```

### Manual Verification

**1. Iniciar el servidor:**
```bash
cd backend
go run main.go
# Debería mostrar: "Server running on :8080" o similar
```

**2. Verificar health check (si implementado):**
```bash
curl http://localhost:8080/health
# Esperado: {"status": "ok"}
```

**3. Crear un producto (US1):**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Remera Básica",
    "descripcion": "Remera 100% algodón",
    "categoria": "remeras",
    "precio": 2500.00,
    "stock": 10,
    "tallas": ["S", "M", "L"],
    "colores": ["blanco", "negro"],
    "imagenes": ["/images/remera1.jpg"],
    "activo": true
  }'
# Esperado: 201 Created con el producto y ID asignado
```

**4. Listar todos los productos (US2):**
```bash
curl http://localhost:8080/api/products
# Esperado: 200 OK con {"products": [...], "total": 1}
```

**5. Listar con paginación:**
```bash
curl "http://localhost:8080/api/products?limit=10&offset=0"
# Esperado: 200 OK con máximo 10 productos + total count
```

**6. Filtrar por categoría (US3):**
```bash
curl "http://localhost:8080/api/products?category=remeras"
# Esperado: 200 OK solo con productos de categoría remeras
```

**7. Buscar por texto (US3):**
```bash
curl "http://localhost:8080/api/products?search=básica"
# Esperado: 200 OK con productos que contengan "básica" en nombre o descripción
```

**8. Obtener producto por ID (US4):**
```bash
curl http://localhost:8080/api/products/1
# Esperado: 200 OK con el producto completo
```

**9. Actualizar producto (US5):**
```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Remera Premium",
    "precio": 3500.00,
    "stock": 15,
    "categoria": "remeras"
  }'
# Esperado: 200 OK con producto actualizado
```

**10. Actualización parcial (US5):**
```bash
curl -X PATCH http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock": 20}'
# Esperado: 200 OK con solo stock actualizado
```

**11. Eliminar producto (US6):**
```bash
curl -X DELETE http://localhost:8080/api/products/1
# Esperado: 204 No Content
```

**12. Verificar eliminación:**
```bash
curl http://localhost:8080/api/products/1
# Esperado: 404 Not Found con mensaje "Product not found"
```

**13. Validaciones - producto con precio negativo:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Test", "precio": -100, "categoria": "test"}'
# Esperado: 400 Bad Request con error "precio debe ser mayor a 0"
```

**14. Validaciones - más de 4 imágenes:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "precio": 100,
    "categoria": "test",
    "imagenes": ["/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg", "/5.jpg"]
  }'
# Esperado: 400 Bad Request con error sobre límite de imágenes
```

### Performance Testing (opcional pero recomendado)

**Verificar tiempo de respuesta con 100+ productos:**
```bash
# Crear 100 productos usando script
# Luego medir tiempo de respuesta
time curl http://localhost:8080/api/products
# Esperado: < 500ms
```

**Verificar tamaño del binario:**
```bash
go build -o catalog-api main.go
ls -lh catalog-api
# Esperado: < 20MB
```

---

## Notes

- **[P]** indica test prioritario que debe pasar antes de considerar la story completa
- **[USX]** mapea tareas a user stories específicas para trazabilidad
- Cada user story debe ser independientemente completable y testable
- Commit después de cada task o grupo lógico de tasks
- Parar en cada checkpoint para validar story independientemente
- Usar prepared statements para prevenir SQL injection
- SQLite es apropiado para MVP, considerar PostgreSQL para producción con más tráfico
- Logs en español para facilitar debugging
- CORS debe configurarse según frontend (permitir localhost en desarrollo)
