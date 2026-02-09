# Especificación de Funcionalidad: Autenticación y Autorización

*Creado*: 2026-01-27

## Escenarios de Usuario y Testing (obligatorio)

### Historia de Usuario 1 - Login de Admin (Prioridad: P1)

Como administrador, necesito iniciar sesión en el panel de administración para poder gestionar de forma segura productos, slides del carousel y otro contenido de la tienda.

*Por qué esta prioridad*: Esta es la base del sistema de seguridad. Sin autenticación, no podemos proteger las operaciones administrativas. Este es un requisito de seguridad crítico.

*Prueba Independiente*: Se puede probar completamente creando una página de login, implementando autenticación JWT en el backend, y verificando que un usuario admin válido pueda iniciar sesión y recibir un token. Entrega valor inmediato al proteger el panel de administración.

*Escenarios de Aceptación*:

1. *Dado* que estoy en la página de login, *Cuando* ingreso credenciales válidas de admin (usuario y contraseña), *Entonces* debería iniciar sesión y ser redirigido al dashboard de admin con un token de sesión válido
2. *Dado* que estoy en la página de login, *Cuando* ingreso credenciales inválidas, *Entonces* debería ver un mensaje de error y permanecer en la página de login
3. *Dado* que he iniciado sesión, *Cuando* recargo la página, *Entonces* debería permanecer con sesión iniciada (token persistido en localStorage/sessionStorage)
4. *Dado* que he iniciado sesión, *Cuando* hago click en logout, *Entonces* mi sesión debería ser limpiada y debería ser redirigido a la página de login

---

### Historia de Usuario 2 - Rutas Admin Protegidas (Prioridad: P1)

Como sistema, necesito proteger todas las rutas administrativas para que solo administradores autenticados puedan acceder a ellas.

*Por qué esta prioridad*: Esto es igualmente crítico a P1 ya que hace cumplir la autenticación implementada en la Historia 1. Sin esto, la autenticación no tendría sentido.

*Prueba Independiente*: Se puede probar intentando acceder a rutas admin sin un token válido (debería redirigir al login) y con un token válido (debería permitir acceso). Entrega valor de seguridad directo.

*Escenarios de Aceptación*:

1. *Dado* que no he iniciado sesión, *Cuando* intento acceder a cualquier ruta admin (ej., `/admin/products`), *Entonces* debería ser redirigido a la página de login
2. *Dado* que he iniciado sesión con un token válido, *Cuando* accedo a rutas admin, *Entonces* debería ver la página solicitada
3. *Dado* que he iniciado sesión, *Cuando* mi token expira, *Entonces* debería ser automáticamente deslogueado y redirigido al login
4. *Dado* que estoy en una página admin, *Cuando* elimino manualmente mi token de auth del almacenamiento, *Entonces* la próxima llamada API debería fallar y redirigirme al login

---

### Historia de Usuario 3 - Autorización de API Backend (Prioridad: P1)

Como sistema backend, necesito validar tokens JWT en todos los endpoints protegidos para que solo administradores autenticados puedan modificar datos de la tienda.

*Por qué esta prioridad*: La protección solo en frontend es insuficiente - el backend debe validar independientemente todas las peticiones. Esta es una capa de seguridad crítica.

*Prueba Independiente*: Se puede probar haciendo llamadas API a endpoints protegidos con y sin tokens válidos. Con token válido = éxito, sin token o token inválido = 401 No Autorizado. Entrega seguridad completa del backend.

*Escenarios de Aceptación*:

1. *Dado* una petición para crear/actualizar/eliminar un producto, *Cuando* la petición incluye un token JWT válido en el header Authorization, *Entonces* la operación debería tener éxito
2. *Dado* una petición para crear/actualizar/eliminar un producto, *Cuando* la petición no tiene token o tiene un token inválido, *Entonces* el servidor debería retornar 401 No Autorizado
3. *Dado* una petición para crear/actualizar/eliminar un slide del carousel, *Cuando* la petición no tiene token o tiene un token inválido, *Entonces* el servidor debería retornar 401 No Autorizado
4. *Dado* una petición para ver productos (endpoint público), *Cuando* la petición no tiene token, *Entonces* la operación debería tener éxito de todas formas (operaciones de lectura son públicas)

---

### Historia de Usuario 4 - Manejo de Sesión (Prioridad: P2)

Como administrador, necesito que mi sesión sea manejada de forma segura para no tener que iniciar sesión con demasiada frecuencia pero que mi sesión expire apropiadamente por seguridad.

*Por qué esta prioridad*: Mejora la UX mientras mantiene la seguridad. No es tan crítico como la auth básica pero importante para el uso diario práctico.

*Prueba Independiente*: Se puede probar iniciando sesión y verificando el comportamiento de expiración del token. Entrega experiencia de usuario mejorada.

*Escenarios de Aceptación*:

1. *Dado* que inicio sesión exitosamente, *Cuando* uso el panel de admin normalmente, *Entonces* mi sesión debería permanecer activa por al menos 8 horas
2. *Dado* que mi sesión ha expirado, *Cuando* intento realizar una acción admin, *Entonces* debería ver un mensaje de sesión expirada y ser redirigido al login
3. *Dado* que he iniciado sesión en un dispositivo, *Cuando* inicio sesión en otro dispositivo, *Entonces* ambas sesiones deberían ser válidas (permitir múltiples sesiones concurrentes)

---

### Historia de Usuario 5 - Creación de Usuario Admin Inicial (Prioridad: P2)

Como administrador del sistema, necesito una forma de crear el usuario admin inicial para poder configurar el sistema por primera vez.

*Por qué esta prioridad*: Necesario para despliegue y configuración inicial, pero inicialmente puede hacerse vía inserción directa en base de datos o script de setup.

*Prueba Independiente*: Se puede probar ejecutando un script de migración/seed que cree el usuario admin con una contraseña hasheada. Entrega capacidad de despliegue.

*Escenarios de Aceptación*:

1. *Dado* que la base de datos está vacía, *Cuando* ejecuto la configuración/migración inicial, *Entonces* debería crearse un usuario admin con username "admin" y una contraseña por defecto segura
2. *Dado* que ya existe un usuario admin, *Cuando* ejecuto el setup nuevamente, *Entonces* no debería crear un usuario duplicado
3. *Dado* que se creó el usuario admin, *Cuando* intento iniciar sesión con las credenciales por defecto, *Entonces* debería poder acceder al panel de admin

---

### Casos Edge

- ¿Qué sucede cuando el token de un usuario expira mientras están editando un producto?
  - La próxima llamada API fallará con 401, disparando logout automático y redirección a página de login
  
- ¿Cómo maneja el sistema sesiones concurrentes?
  - Se permiten múltiples sesiones - cada dispositivo/navegador obtiene su propio token
  
- ¿Qué pasa si alguien intenta fuerza bruta en el login?
  - Debería implementarse rate limiting (puede ser P3 - mejora futura)
  
- ¿Cómo se almacenan las contraseñas?
  - Deben ser hasheadas usando bcrypt con factor de costo apropiado
  
- ¿Qué pasa si un admin olvida su contraseña?
  - Versión inicial: admin debe resetear manualmente vía base de datos (futuro: flujo de reseteo de contraseña)

## Requisitos (obligatorio)

### Requisitos Funcionales

- **FR-001**: El sistema DEBE proporcionar un endpoint `/api/auth/login` que acepte username y password y retorne un token JWT
- **FR-002**: El sistema DEBE hashear todas las contraseñas usando bcrypt con un factor de costo mínimo de 10
- **FR-003**: El sistema DEBE validar tokens JWT en todos los endpoints protegidos (operaciones create/update/delete para productos, slides del carousel)
- **FR-004**: El sistema DEBE retornar 401 No Autorizado para peticiones a endpoints protegidos sin tokens válidos
- **FR-005**: El frontend DEBE proporcionar una página de login con campos de username y password
- **FR-006**: El frontend DEBE almacenar el token JWT de forma segura (localStorage o sessionStorage)
- **FR-007**: El frontend DEBE incluir el token JWT en el header Authorization para todas las peticiones API de admin
- **FR-008**: El frontend DEBE redirigir usuarios no autenticados a la página de login al acceder rutas admin
- **FR-009**: El frontend DEBE manejar respuestas 401 limpiando el token y redirigiendo al login
- **FR-010**: El sistema DEBE crear un usuario admin inicial durante la configuración/migración de base de datos
- **FR-011**: Los tokens JWT DEBEN expirar después de 8 horas (configurable)
- **FR-012**: Los endpoints públicos (GET products, GET carousel slides) DEBEN permanecer accesibles sin autenticación

### Entidades Clave

- **User**: Representa una cuenta de administrador
  - Atributos: id, username, password_hash, created_at, updated_at
  - Relaciones: N/A (inicialmente un solo usuario admin)
  
- **JWT Token**: Token de autenticación temporal
  - Claims: user_id, username, issued_at, expires_at
  - Firmado con clave secreta del servidor

## Criterios de Éxito (obligatorio)

### Resultados Medibles

- **SC-001**: Las rutas del panel admin son completamente inaccesibles sin autenticación (100% de rutas admin protegidas)
- **SC-002**: Todos los endpoints API protegidos rechazan peticiones sin tokens JWT válidos (100% de tasa de rechazo)
- **SC-003**: Los usuarios admin pueden iniciar sesión exitosamente y mantener sesión por al menos 8 horas sin re-autenticación
- **SC-004**: La tienda pública de cara al cliente permanece completamente accesible sin ningún requisito de autenticación
- **SC-005**: Cero contraseñas en texto plano almacenadas en la base de datos (100% hasheadas con bcrypt)
- **SC-006**: El admin puede realizar todas las operaciones CRUD en productos y slides del carousel después de la autenticación
