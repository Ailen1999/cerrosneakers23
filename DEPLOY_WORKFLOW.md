# Flujo de Despliegue - cerrosneakers23

Este documento describe el flujo de despliegue usando Docker Hub para evitar compilar en el servidor AWS.

## 🎯 Estrategia de Despliegue

**Problema**: Compilar en el servidor AWS requiere demasiados recursos (RAM/CPU).

**Solución**: Compilar localmente, publicar en Docker Hub, y descargar en el servidor.

## 📋 Requisitos Previos

1. **Docker Desktop** instalado en tu máquina local
2. **Cuenta de Docker Hub** (gratuita): https://hub.docker.com
3. **SSH configurado** con tu servidor AWS

## 🚀 Flujo Completo

### Opción A: Usando el Script Automatizado (Recomendado)

```powershell
# Ejecutar el script con tu usuario de Docker Hub
.\build-and-push.ps1 tuusuario
```

El script automáticamente:
- ✅ Construye ambas imágenes
- ✅ Verifica login en Docker Hub
- ✅ Publica las imágenes
- ✅ Muestra los próximos pasos

### Opción B: Paso a Paso Manual

#### 1️⃣ Construir las Imágenes Localmente

```powershell
# Navegar al directorio del proyecto
cd C:\Users\tomas\OneDrive\Documentos\cerrosneakers23

# Construir backend (No requiere variables de entorno en el build)
docker build -t tuusuario/cerrosneakers23-backend:latest ./backend

# Construir frontend (REQUIERE la URL de la API para compilarse)
docker build --build-arg VITE_API_URL="https://cerrosneakers23.com.ar" -t tuusuario/cerrosneakers23-frontend:latest ./frontend
```

**⚠️ Importante**: 
- Reemplaza `tuusuario` con tu usuario real de Docker Hub.
- La variable `VITE_API_URL` debe pasarse **en el build** del frontend porque es inyectada por Vite durante la compilación. No funcionará si se pasa solo en el `docker-compose.yml`.

#### 2️⃣ Login en Docker Hub

```powershell
docker login
# Ingresar usuario y contraseña
```

#### 3️⃣ Publicar las Imágenes

```powershell
# Push backend
docker push tuusuario/cerrosneakers23-backend:latest

# Push frontend
docker push tuusuario/cerrosneakers23-frontend:latest
```

#### 4️⃣ Actualizar docker-compose.prod.yml

Abre `docker-compose.prod.yml` y reemplaza `tuusuario` con tu usuario real:

```yaml
backend:
  image: tuusuario/cerrosneakers23-backend:latest
  # ...

frontend:
  image: tuusuario/cerrosneakers23-frontend:latest
  # ...
```

#### 5️⃣ Copiar Configuración al Servidor

```bash
# Crear carpeta temporal con archivos necesarios
mkdir deploy-temp
copy docker-compose.prod.yml deploy-temp\

# Copiar al servidor (desde PowerShell o CMD)
scp -i C:\Users\tomas\Downloads\cerrosneakers.pem docker-compose.prod.yml ubuntu@ec2-100-51-224-203.compute-1.amazonaws.com:

# (OPCIONAL) Solo si tienes datos existentes que quieres migrar:
scp -i tu-clave.pem backend\catalog.db ubuntu@[IP-AWS]:~/ 2>nul
scp -i tu-clave.pem -r backend\uploads ubuntu@[IP-AWS]:~/ 2>nul
```

**Nota importante**: 
- **catalog.db**: SQLite lo creará automáticamente cuando la aplicación inicie por primera vez. Solo copia este archivo si ya tienes una base de datos con datos que quieres migrar.
- **uploads/**: Solo necesario si tienes imágenes de productos existentes.

#### 6️⃣ Desplegar en el Servidor

```bash
# Conectar por SSH
ssh -i tu-clave.pem ubuntu@[IP-AWS]

# Crear estructura de directorios (opcional, pero recomendado)
mkdir -p ~/cerrosneakers23/data/uploads
mkdir -p ~/cerrosneakers23/letsencrypt

# Mover archivos a la ubicación correcta
mv ~/docker-compose.prod.yml ~/cerrosneakers23/

# Solo si copiaste estos archivos (datos existentes):
mv ~/catalog.db ~/cerrosneakers23/data/ 2>/dev/null || true
mv ~/uploads/* ~/cerrosneakers23/data/uploads/ 2>/dev/null || true

# Ir al directorio
cd ~/cerrosneakers23
```

**Nota**: Docker Compose crearía estas carpetas automáticamente, pero es mejor crearlas manualmente para tener control sobre los permisos desde el inicio.

```bash
# Descargar imágenes
docker-compose -f docker-compose.prod.yml pull

# Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔄 Actualizar la Aplicación

Cuando hagas cambios en el código:

### En Local:

```powershell
# Opción A: Script automatizado
.\build-and-push.ps1 tuusuario

# Opción B: Manual
docker build -t tuusuario/cerrosneakers23-backend:latest ./backend
docker build -t tuusuario/cerrosneakers23-frontend:latest ./frontend
docker push tuusuario/cerrosneakers23-backend:latest
docker push tuusuario/cerrosneakers23-frontend:latest
```

### En el Servidor:

```bash
cd ~/cerrosneakers23

# Descargar nuevas versiones
docker-compose -f docker-compose.prod.yml pull

# Recrear contenedores
docker-compose -f docker-compose.prod.yml up -d

# Verificar
docker-compose -f docker-compose.prod.yml logs -f
```

## 📁 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `docker-compose.yml` | Para desarrollo local (con build) |
| `docker-compose.prod.yml` | Para producción (con imágenes de Docker Hub) |
| `build-and-push.ps1` | Script automatizado de build y push |
| `DEPLOY_AWS.md` | Guía completa de despliegue en AWS |

## 🔍 Comandos Útiles

```bash
# Ver imágenes publicadas
docker search tuusuario/cerrosneakers23

# Ver estado en el servidor
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Detener todo
docker-compose -f docker-compose.prod.yml down

# Limpiar imágenes antiguas
docker system prune -a
```

## 🆘 Troubleshooting

### Problema: "Cannot connect to the Docker daemon"

```powershell
# Asegúrate de que Docker Desktop esté corriendo
# Reinicia Docker Desktop si es necesario
```

### Problema: "denied: requested access to the resource is denied"

```powershell
# Verifica que estés logueado
docker login

# Verifica el nombre de usuario
docker info | Select-String "Username"
```

### Problema: "Image not found" en el servidor

```bash
# Verifica que la imagen exista en Docker Hub
# Asegúrate de que docker-compose.prod.yml tenga el nombre correcto
# Intenta pull manual
docker pull tuusuario/cerrosneakers23-backend:latest
```

## 📚 Referencias

- [Guía completa de despliegue en AWS](./DEPLOY_AWS.md)
- [Documentación Docker](./README_DOCKER.md)
- [Docker Hub](https://hub.docker.com)

---

**¿Necesitas ayuda?** Consulta `DEPLOY_AWS.md` para instrucciones detalladas.
