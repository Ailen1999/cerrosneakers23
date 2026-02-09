# Plan de Implementación: Autenticación y Autorización

*Fecha*: 2026-01-27  
*Especificación*: [spec.md](./spec.md)

## Resumen

Implementar autenticación y autorización basada en JWT para asegurar el panel de administración y las APIs del backend. El sistema proporcionará una página de login para administradores, validará credenciales, emitirá tokens JWT y protegerá todas las rutas administrativas y endpoints de la API, mientras mantiene la tienda pública accesible.

## Contexto Técnico

**Lenguaje/Versión**: Go 1.21+ (backend), JavaScript ES6+ con React 18 (frontend)  
**Dependencias Principales**: 
- Backend: Gin framework, golang-jwt/jwt, golang.org/x/crypto/bcrypt, GORM
- Frontend: React Router DOM, axios

**Almacenamiento**: Base de datos PostgreSQL existente con nueva tabla `users`  
**Testing**: Pruebas manuales vía navegador y cliente API (Postman/curl)  
**Plataforma Objetivo**: Servidor Linux (backend), Navegadores modernos (frontend)  
**Tipo de Proyecto**: Aplicación web full-stack  
**Objetivos de Rendimiento**: Respuesta de login < 500ms, validación JWT < 50ms  
**Restricciones**: 
- No debe romper la funcionalidad existente de la tienda pública
- Debe funcionar con las APIs existentes de productos y carousel
- Los tokens de sesión deben ser seguros y expirar apropiadamente

**Escala/Alcance**: Inicialmente un solo usuario admin, ~10 endpoints protegidos, ~5 rutas admin

## Estructura del Proyecto

### Documentación (esta funcionalidad)

```
specs/auth-system/
├── plan.md              # Este archivo
└── spec.md              # Especificación de la funcionalidad
```

### Código Fuente (raíz del repositorio)

```
backend/
├── models/
│   └── user.go          # Modelo User con hashing de contraseñas
├── handlers/
│   └── auth_handler.go  # Handler del endpoint de login
├── middleware/
│   └── auth.go          # Middleware de validación JWT
├── repositories/
│   └── user_repository.go  # Operaciones de base de datos para usuarios
├── routes/
│   └── routes.go        # Actualizado para incluir rutas auth y middleware
└── database/
    └── migrations.go    # Actualizado con migración de tabla users

frontend/
├── src/
│   ├── pages/
│   │   └── LoginPage.jsx        # Componente de página de login
│   ├── components/
│   │   └── auth/
│   │       └── PrivateRoute.jsx # Componente guard de rutas
│   ├── services/
│   │   └── authService.js       # Llamadas API de autenticación
│   ├── contexts/
│   │   └── AuthContext.jsx      # Manejo de estado de autenticación
│   ├── utils/
│   │   └── axiosConfig.js       # Interceptores de axios para auth
│   └── App.jsx                  # Actualizado con ruta de login y rutas privadas
```

**Decisión de Estructura**: Se utiliza la estructura de backend existente con nuevos archivos específicos de auth en handlers, middleware y models. El frontend agrega componentes específicos de auth en una nueva carpeta `contexts/` y actualiza el enrutamiento existente. Esto mantiene la separación de responsabilidades mientras se integra con la arquitectura existente.

---

## Fase 1: Fundamentos del Backend (Base de Datos y Modelos)

**Propósito**: Configurar el esquema de base de datos y el modelo de usuario requerido para la autenticación

- [x] T001 Crear modelo User en `backend/models/user.go`
  - Campos: ID, Username, PasswordHash, CreatedAt, UpdatedAt
  - Métodos: HashPassword(), CheckPassword()
  - Usar bcrypt con factor de costo 10

- [x] T002 Crear migración de tabla users en `backend/database/migrations.go`
  - Agregar migración CreateUsersTable
  - Incluir creación de usuario admin por defecto con contraseña hasheada
  - Username: "admin", Password: "admin123" (para cambiar en primer login)

- [x] T003 Crear UserRepository en `backend/repositories/user_repository.go`
  - Método FindByUsername(username)
  - Método Create(user) para configuración inicial

**Checkpoint**: Esquema de base de datos listo, se pueden crear y consultar usuarios

---

## Fase 2: Autenticación del Backend (Generación de JWT)

**Propósito**: Implementar endpoint de login que valide credenciales y emita tokens JWT

- [x] T004 Crear funciones utilitarias JWT en `backend/utils/jwt.go`
  - Función GenerateToken(userID, username)
  - Función ValidateToken(tokenString)
  - Usar expiración de 8 horas
  - Firmar con secreto de variable de entorno

- [x] T005 Crear AuthHandler en `backend/handlers/auth_handler.go`
  - Método Login(c *gin.Context)
  - Acepta username y password en el body de la petición
  - Valida credenciales usando UserRepository y bcrypt
  - Retorna token JWT en caso exitoso, 401 en caso de fallo

- [x] T006 Agregar rutas auth en `backend/routes/routes.go`
  - Ruta POST /api/auth/login apuntando a AuthHandler.Login

- [x] T007 Actualizar `.env` con variable de entorno JWT_SECRET

**Checkpoint**: Se puede hacer POST a /api/auth/login con credenciales válidas y recibir token JWT

---

## Fase 3: Autorización del Backend (Middleware)

**Propósito**: Proteger endpoints de admin con middleware de validación JWT

- [x] T008 Crear middleware auth en `backend/middleware/auth.go`
  - Función AuthRequired()
  - Extrae token del header Authorization (Bearer token)
  - Valida JWT usando utilidad jwt
  - Establece info de usuario en contexto gin si es válido
  - Retorna 401 si es inválido o falta

- [x] T009 Aplicar middleware a rutas de productos en `backend/routes/routes.go`
  - Proteger POST /api/products
  - Proteger PUT /api/products/:id
  - Proteger DELETE /api/products/:id
  - Mantener endpoints GET públicos

- [x] T010 Aplicar middleware a rutas de carousel en `backend/routes/routes.go`
  - Proteger POST /api/carousel-slides
  - Proteger PUT /api/carousel-slides/:id
  - Proteger DELETE /api/carousel-slides/:id
  - Mantener GET /api/carousel-slides/active público

**Checkpoint**: Todos los endpoints protegidos rechazan peticiones sin token válido (401), aceptan peticiones con token válido

---

## Fase 4: Historia de Usuario 1 - Login de Admin (Frontend)

**Objetivo**: Proporcionar página de login donde el admin pueda autenticarse y recibir sesión

**Prueba Independiente**: Navegar a /login, ingresar credenciales admin, verificar redirección a dashboard con token almacenado

### Implementación para Historia de Usuario 1

- [x] T011 [US1] Crear AuthService en `frontend/src/services/authService.js`
  - login(username, password) - POST a /api/auth/login
  - logout() - Limpiar token almacenado
  - getToken() - Recuperar token de localStorage
  - setToken(token) - Almacenar token en localStorage

- [x] T012 [US1] Crear AuthContext en `frontend/src/contexts/AuthContext.jsx`
  - Provee: isAuthenticated, user, login, logout
  - Maneja estado de token y localStorage
  - Inicializa desde localStorage al montar

- [x] T013 [US1] Crear LoginPage en `frontend/src/pages/LoginPage.jsx`
  - Campos de entrada para username y password
  - Botón de envío
  - Visualización de mensajes de error
  - En éxito: redirigir a /admin/products
  - En fallo: mostrar mensaje de error

- [x] T014 [US1] Actualizar App.jsx para incluir ruta de login
  - Agregar Route para /login apuntando a LoginPage
  - Envolver app en AuthContext.Provider

- [x] T015 [US1] Agregar botón de logout en componente Sidebar
  - Usar función logout del auth context
  - Redirigir a /login después del logout

**Checkpoint**: Se puede iniciar sesión vía página /login, el token se almacena, se puede cerrar sesión

---

## Fase 5: Historia de Usuario 2 - Rutas Admin Protegidas (Frontend)

**Objetivo**: Prevenir acceso a rutas admin sin autenticación

**Prueba Independiente**: Intentar acceder a /admin/products sin login (debería redirigir), iniciar sesión y acceder (debería funcionar)

### Implementación para Historia de Usuario 2

- [x] T016 [US2] Crear componente PrivateRoute en `frontend/src/components/auth/PrivateRoute.jsx`
  - Verifica si el usuario está autenticado vía AuthContext
  - Si sí: renderiza children
  - Si no: redirige a /login

- [x] T017 [US2] Actualizar App.jsx para envolver rutas admin con PrivateRoute
  - Envolver ruta /admin/products
  - Envolver ruta /admin/products/create
  - Envolver ruta /admin/products/edit/:id
  - Envolver ruta /admin/carousel
  - Envolver ruta /admin/carousel/create
  - Envolver ruta /admin/carousel/edit/:id

- [x] T018 [US2] Actualizar configuración de axios en `frontend/src/utils/axiosConfig.js`
  - Crear instancia de axios con URL base
  - Agregar interceptor de petición para incluir header Authorization con token
  - Agregar interceptor de respuesta para manejar 401 cerrando sesión y redirigiendo

- [x] T019 [US2] Actualizar todos los archivos de servicios para usar instancia de axios configurada
  - productService.js
  - carouselService.js

**Checkpoint**: No se puede acceder a rutas admin sin login, se puede acceder después del login, auto-logout en 401

---

## Fase 6: Historia de Usuario 4 - Manejo de Sesión

**Objetivo**: Manejar expiración de tokens de manera elegante

**Prueba Independiente**: Iniciar sesión, esperar que el token expire (o expirarlo manualmente), intentar realizar acción, verificar auto-logout

### Implementación para Historia de Usuario 4

- [ ] T020 [US4] Agregar verificación de expiración de token en AuthContext
  - Decodificar JWT y verificar claim exp
  - Si expiró, auto-logout

- [ ] T021 [US4] Agregar useEffect en AuthContext para verificar periódicamente validez del token
  - Verificar cada 5 minutos
  - Auto-logout si expiró

- [ ] T022 [US4] Actualizar interceptor 401 de axios para mostrar mensaje "Sesión expirada"
  - Usar notificación toast antes de redirigir

**Checkpoint**: La sesión expira después de 8 horas, se notifica al usuario y se cierra sesión

---

## Fase 7: Pulido y Aspectos Transversales

**Propósito**: Mejoras finales y validación

- [ ] T023 Agregar estados de carga a LoginPage durante autenticación
- [ ] T024 Agregar checkbox "Recordarme" (extiende token a 30 días - opcional)
- [ ] T025 Agregar toggle de visibilidad de contraseña en LoginPage
- [ ] T026 Probar todos los endpoints protegidos con y sin token
- [ ] T027 Probar todas las rutas admin con y sin autenticación
- [ ] T028 Verificar que las páginas públicas de la tienda funcionen sin autenticación
- [ ] T029 Probar flujo de logout desde diferentes páginas
- [ ] T030 Agregar manejo de errores para fallos de red en login
- [ ] T031 Actualizar README con credenciales admin por defecto
- [ ] T032 Agregar comentarios inline documentando configuración JWT

**Checkpoint**: Todas las funcionalidades trabajando suavemente, casos edge manejados

---

## Dependencias y Orden de Ejecución

### Dependencias de Fases

- **Fundamentos Backend (Fase 1)**: Sin dependencias - se puede iniciar inmediatamente
- **Autenticación Backend (Fase 2)**: Depende de completar Fase 1
- **Autorización Backend (Fase 3)**: Depende de completar Fase 2
- **Login Frontend (Fase 4)**: Depende de completar Fase 2 (puede correr en paralelo con Fase 3)
- **Protección de Rutas Frontend (Fase 5)**: Depende de completar Fase 4
- **Manejo de Sesión (Fase 6)**: Depende de completar Fase 4
- **Pulido (Fase 7)**: Depende de todas las fases anteriores

### Estrategia de Ejecución

**Enfoque Secuencial** (Recomendado para un solo desarrollador):
1. Completar Fase 1 → Fase 2 → Fase 3 (backend completo)
2. Luego Fase 4 → Fase 5 → Fase 6 (frontend completo)
3. Finalmente Fase 7 (pulido)

**Enfoque Paralelo** (Si hay múltiples desarrolladores):
- Desarrollador A: Fase 1 → Fase 2 → Fase 3
- Desarrollador B: Esperar Fase 2, luego Fase 4 → Fase 5 → Fase 6
- Ambos: Fase 7

### Dentro de Cada Fase

- Completar tareas en orden (T001 → T002 → T003...)
- Probar cada checkpoint antes de pasar a la siguiente fase
- Hacer commit después de cada tarea o grupo relacionado de tareas

## Notas

- **[US1], [US2], etc.**: Mapea la tarea a una historia de usuario específica de spec.md
- **Checkpoints**: Verificar funcionalidad en cada checkpoint antes de proceder
- **Almacenamiento de Token**: Usar localStorage es aceptable para app solo-admin; considerar httpOnly cookies para producción
- **Credenciales Por Defecto**: Username: "admin", Password: "admin123" (documentar en README, recomendar cambiar en primer login)
- **Secreto JWT**: Generar secreto aleatorio fuerte para producción, documentar en configuración de entorno
- **Testing**: Enfocarse en pruebas manuales inicialmente; pruebas automatizadas pueden agregarse en iteración futura
- **Compatibilidad Hacia Atrás**: Asegurar que todos los cambios mantengan la funcionalidad existente de la tienda pública

## Consideraciones de Seguridad

- Las contraseñas NUNCA deben ser logueadas o retornadas en respuestas de API
- El secreto JWT debe almacenarse en variable de entorno, nunca commitear al repo
- Usar HTTPS en producción para proteger transmisión de tokens
- Considerar agregar rate limiting al endpoint de login en el futuro (prevenir fuerza bruta)
- El token debe ser limpiado de localStorage al hacer logout
- Validar todas las entradas tanto en frontend como en backend
