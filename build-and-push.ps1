# Script para construir y publicar imágenes Docker a Docker Hub
# Uso: .\build-and-push.ps1 <tu-usuario-dockerhub> [-apiUrl <url>]

param(
    [Parameter(Mandatory=$true)]
    [string]$dockerUser,
    
    [Parameter(Mandatory=$false)]
    [string]$apiUrl = "https://cerrosneakers23.com.ar"
)

Write-Host "🚀 Iniciando build y push de imágenes para cerrosneakers23" -ForegroundColor Cyan
Write-Host "Usuario de Docker Hub: $dockerUser" -ForegroundColor Yellow
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path ".\backend\Dockerfile") -or -not (Test-Path ".\frontend\Dockerfile")) {
    Write-Host "❌ Error: No se encontraron los Dockerfiles. Asegúrate de ejecutar este script desde el directorio raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Preguntar confirmación
Write-Host "Este script hará lo siguiente:" -ForegroundColor Yellow
Write-Host "  1. Construir imagen del backend" -ForegroundColor White
Write-Host "  2. Construir imagen del frontend con API_URL: $apiUrl" -ForegroundColor White
Write-Host "  3. Publicar ambas imágenes en Docker Hub como:" -ForegroundColor White
Write-Host "     - $dockerUser/cerrosneakers23-backend:latest" -ForegroundColor Cyan
Write-Host "     - $dockerUser/cerrosneakers23-frontend:latest" -ForegroundColor Cyan
Write-Host ""
$confirm = Read-Host "¿Continuar? (s/n)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Operación cancelada" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "📦 Paso 1: Construyendo imagen del backend..." -ForegroundColor Cyan
docker build -t "$dockerUser/cerrosneakers23-backend:latest" ./backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir la imagen del backend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend construido exitosamente" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Paso 2: Construyendo imagen del frontend..." -ForegroundColor Cyan
Write-Host "   API URL: $apiUrl" -ForegroundColor Yellow
docker build --build-arg VITE_API_URL="$apiUrl" -t "$dockerUser/cerrosneakers23-frontend:latest" ./frontend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir la imagen del frontend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend construido exitosamente" -ForegroundColor Green

Write-Host ""
Write-Host "🔐 Verificando login en Docker Hub..." -ForegroundColor Cyan
$loginCheck = docker info 2>&1 | Select-String "Username"
if (-not $loginCheck) {
    Write-Host "⚠️  No estás logueado en Docker Hub" -ForegroundColor Yellow
    Write-Host "Ejecutando 'docker login'..." -ForegroundColor Yellow
    docker login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al iniciar sesión en Docker Hub" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "⬆️  Paso 3: Publicando imagen del backend..." -ForegroundColor Cyan
docker push "$dockerUser/cerrosneakers23-backend:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al publicar la imagen del backend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend publicado exitosamente" -ForegroundColor Green

Write-Host ""
Write-Host "⬆️  Paso 4: Publicando imagen del frontend..." -ForegroundColor Cyan
docker push "$dockerUser/cerrosneakers23-frontend:latest"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al publicar la imagen del frontend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend publicado exitosamente" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "✅ ¡Proceso completado exitosamente!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Las imágenes están disponibles en:" -ForegroundColor Yellow
Write-Host "  - https://hub.docker.com/r/$dockerUser/cerrosneakers23-backend" -ForegroundColor Cyan
Write-Host "  - https://hub.docker.com/r/$dockerUser/cerrosneakers23-frontend" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Actualiza docker-compose.prod.yml con tu usuario: $dockerUser" -ForegroundColor White
Write-Host "  2. Copia docker-compose.prod.yml al servidor" -ForegroundColor White
Write-Host "  3. En el servidor ejecuta:" -ForegroundColor White
Write-Host "     docker-compose -f docker-compose.prod.yml pull" -ForegroundColor Cyan
Write-Host "     docker-compose -f docker-compose.prod.yml up -d" -ForegroundColor Cyan
Write-Host ""
