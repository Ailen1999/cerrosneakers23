# Backend API - Catálogo de Productos

API REST desarrollada en Go para el catálogo de productos de TiendaEdgar. Implementa operaciones CRUD completas con SQLite como base de datos.

## 🚀 Características

- ✅ Crear, listar, obtener, actualizar y eliminar productos
- ✅ Paginación de resultados
- ✅ Filtrado por categoría
- ✅ Búsqueda por texto en nombre y descripción
- ✅ Validaciones de datos
- ✅ CORS configurado para frontend
- ✅ Logging de todas las peticiones
- ✅ Tests unitarios y de integración

## 📋 Prerrequisitos

- **Go 1.21 o superior** - [Descargar Go](https://go.dev/dl/)
- **Git** (opcional, para clonar el repositorio)

## 🔧 Instalación

### 1. Instalar Go

**Windows:**
1. Descarga el instalador desde https://go.dev/dl/
2. Ejecuta el instalador y sigue las instrucciones
3. Verifica la instalación abriendo PowerShell y ejecutando:
   ```powershell
   go version
   ```

**Linux/Mac:**
```bash
# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install golang-go

# Mac (con Homebrew)
brew install go

# Verificar instalación
go version
```

### 2. Instalar las dependencias

Una vez instalado Go, en el directorio `backend` ejecuta:

```bash
go mod download
```

Esto instalará automáticamente todas las dependencias especificadas en `go.mod`:
- `github.com/gin-gonic/gin` - Framework web
- `github.com/mattn/go-sqlite3` - Driver SQLite

## ▶️ Ejecutar el servidor

```bash
# Desde el directorio backend
go run main.go
```

El servidor iniciará en `http://localhost:8080`

Verás un mensaje similar a:
```
Conexión a base de datos SQLite establecida
Tabla products creada o ya existe
Índices creados correctamente
Servidor iniciando en el puerto :8080
```

## 📡 Endpoints de la API

### Health Check
```bash
GET /health
```
Retorna el estado del servidor.

### Productos

#### Crear producto
```bash
POST /api/products
Content-Type: application/json

{
  "nombre": "Remera Básica",
  "descripcion": "Remera 100% algodón",
  "categoria": "remeras",
  "precio": 2500.00,
  "stock": 10,
  "tallas": ["S", "M", "L"],
  "colores": ["blanco", "negro"],
  "imagenes": ["/images/remera1.jpg"],
  "activo": true,
  "destacado": false
}
```
**Respuesta:** `201 Created` con el producto creado (incluye ID asignado)

#### Listar productos
```bash
GET /api/products
GET /api/products?limit=10&offset=0
GET /api/products?category=remeras
GET /api/products?search=jean
GET /api/products?category=pantalones&search=azul
```
**Parámetros opcionales:**
- `limit` - Número de productos por página (default: 10, máx: 100)
- `offset` - Número de productos a saltar (default: 0)
- `category` - Filtrar por categoría
- `search` - Buscar en nombre y descripción

**Respuesta:** `200 OK`
```json
{
  "products": [...],
  "total": 25
}
```

#### Obtener producto por ID
```bash
GET /api/products/{id}
```
**Respuesta:** `200 OK` con el producto o `404 Not Found`

#### Actualizar producto (completo)
```bash
PUT /api/products/{id}
Content-Type: application/json

{
  "nombre": "Remera Premium",
  "descripcion": "Remera premium 100% algodón",
  "categoria": "remeras",
  "precio": 3500.00,
  "stock": 15,
  "tallas": ["S", "M", "L", "XL"],
  "colores": ["blanco", "negro", "gris"],
  "imagenes": ["/images/remera1.jpg"],
  "activo": true,
  "destacado": true
}
```
**Respuesta:** `200 OK` con el producto actualizado o `404 Not Found`

#### Actualizar producto (parcial)
```bash
PATCH /api/products/{id}
Content-Type: application/json

{
  "stock": 20,
  "precio": 2800.00
}
```
**Respuesta:** `200 OK` con el producto actualizado o `404 Not Found`

#### Eliminar producto
```bash
DELETE /api/products/{id}
```
**Respuesta:** `204 No Content` o `404 Not Found`

## 🧪 Ejecutar Tests

### Todos los tests
```bash
go test ./tests/... -v
```

### Solo tests unitarios
```bash
go test ./tests/unit/... -v
```

### Solo tests de integración
```bash
go test ./tests/integration/... -v
```

### Ver cobertura de código
```bash
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out
```

## 📁 Estructura del Proyecto

```
backend/
├── main.go                      # Punto de entrada
├── go.mod                       # Dependencias
├── config/
│   └── config.go               # Configuración
├── models/
│   └── product.go              # Modelo de producto con validaciones
├── database/
│   ├── db.go                   # Conexión a SQLite
│   └── migrations.go           # Schema y migraciones
├── repositories/
│   └── product_repository.go  # Acceso a datos
├── services/
│   └── product_service.go     # Lógica de negocio
├── handlers/
│   └── product_handler.go     # Controladores HTTP
├── middleware/
│   ├── logger.go              # Logging de requests
│   ├── error_handler.go       # Manejo de errores
│   └── cors.go                # Configuración CORS
├── routes/
│   └── routes.go              # Definición de rutas
└── tests/
    ├── unit/
    │   └── product_model_test.go
    └── integration/
        └── product_api_test.go
```

## 🔒 Validaciones

El sistema valida:
- **Nombre**: obligatorio, no puede estar vacío
- **Categoría**: obligatoria, no puede estar vacía
- **Precio**: obligatorio, debe ser mayor a 0
- **Imágenes**: máximo 4 imágenes por producto

## 📝 Ejemplos con curl

### Crear un producto
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Jean Azul",
    "descripcion": "Jean clásico de mezclilla",
    "categoria": "pantalones",
    "precio": 4500.00,
    "stock": 15,
    "tallas": ["28", "30", "32", "34"],
    "colores": ["azul"],
    "imagenes": ["/images/jean1.jpg", "/images/jean2.jpg"],
    "activo": true
  }'
```

### Listar todos los productos
```bash
curl http://localhost:8080/api/products
```

### Buscar productos
```bash
curl "http://localhost:8080/api/products?search=jean"
```

### Filtrar por categoría
```bash
curl "http://localhost:8080/api/products?category=remeras"
```

### Obtener un producto específico
```bash
curl http://localhost:8080/api/products/1
```

### Actualizar stock
```bash
curl -X PATCH http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"stock": 25}'
```

### Eliminar un producto
```bash
curl -X DELETE http://localhost:8080/api/products/1
```

## ⚙️ Configuración

La configuración se encuentra en `config/config.go`:

- **ServerPort**: Puerto del servidor (default: `:8080`)
- **DBPath**: Ruta del archivo SQLite (default: `./catalog.db`)
- **DebugMode**: Modo debug (default: `true`)

## 🐛 Troubleshooting

### Error: "go: command not found"
- Instala Go siguiendo las instrucciones en la sección de instalación
- Verifica que Go esté en el PATH del sistema

### Error: "database is locked"
- Cierra cualquier otra conexión a la base de datos
- Si persiste, elimina el archivo `catalog.db` y reinicia el servidor

### Los tests fallan
- Asegúrate de que no haya una instancia del servidor corriendo
- Verifica que el archivo `test_catalog.db` no esté bloqueado

## 📄 Licencia

Este proyecto es parte de TiendaEdgar.

## 🤝 Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📧 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo de TiendaEdgar.
