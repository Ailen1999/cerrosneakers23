# Guía de Despliegue en AWS - cerrosneakers23.com.ar

Esta guía te ayudará a desplegar tu aplicación en Amazon Web Services (AWS) con HTTPS automático usando Let's Encrypt.

## Requisitos Previos

1. Cuenta de AWS activa
2. Dominio cerrosneakers23.com.ar registrado
3. Acceso a la configuración DNS de tu dominio

## Paso 1: Configurar EC2

### 1.1 Crear una instancia EC2

1. Inicia sesión en la [Consola AWS](https://console.aws.amazon.com)
2. Ve a **EC2** → **Launch Instance**
3. Configuración recomendada:
   - **Nombre**: `cerrosneakers23-production`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier elegible)
   - **Tipo de instancia**: 
     - Mínimo: `t2.small` (2 GB RAM)
     - Recomendado: `t2.medium` (4 GB RAM) o superior
   - **Par de claves**: Crea o selecciona una clave SSH (guárdala en lugar seguro)
   - **Almacenamiento**: 20-30 GB gp3

### 1.2 Configurar Security Group

Crea un Security Group con las siguientes reglas de entrada:

| Tipo | Protocolo | Puerto | Origen | Descripción |
|------|-----------|--------|--------|-------------|
| SSH | TCP | 22 | Tu IP | Acceso SSH |
| HTTP | TCP | 80 | 0.0.0.0/0 | Tráfico web |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Tráfico web seguro |

**IMPORTANTE**: Para producción, restringe SSH solo a tu IP.

## Paso 2: Configurar DNS

### 2.1 Obtener IP elástica (recomendado)

1. En EC2 → **Elastic IPs** → **Allocate Elastic IP address**
2. Asocia la IP elástica a tu instancia EC2

### 2.2 Configurar registros DNS

En el panel de administración de tu dominio, crea los siguientes registros:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | [IP de tu EC2] | 300 |
| A | www | [IP de tu EC2] | 300 |

**Nota**: Espera 5-30 minutos para que los cambios DNS se propaguen.

## Paso 3: Preparar el Servidor

### 3.1 Conectar por SSH

```bash
ssh -i tu-clave.pem ubuntu@[IP-DE-TU-EC2]
```

### 3.2 Instalar Docker y Docker Compose

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Agregar repositorio de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión para aplicar cambios
exit
```

Vuelve a conectarte por SSH para aplicar los cambios de grupo.

### 3.3 Instalar Git

```bash
sudo apt install -y git
```

## Paso 4: Preparar y Publicar las Imágenes Docker

### 4.1 Crear cuenta en Docker Hub (si no tienes)

1. Ve a [Docker Hub](https://hub.docker.com/) y crea una cuenta gratuita
2. Verifica tu email

### 4.2 Iniciar sesión en Docker Hub desde tu máquina local

```bash
docker login
# Ingresa tu usuario y password de Docker Hub
```

### 4.3 Construir las imágenes localmente

```bash
# Navega al directorio del proyecto
cd c:\Users\tomas\OneDrive\Documentos\cerrosneakers23

# Construir imagen del backend
docker build -t tuusuario/cerrosneakers23-backend:latest ./backend

# Construir imagen del frontend
docker build -t tuusuario/cerrosneakers23-frontend:latest ./frontend
```

**⚠️ IMPORTANTE**: Reemplaza `tuusuario` con tu nombre de usuario real de Docker Hub.

### 4.4 Publicar las imágenes a Docker Hub

```bash
# Push del backend
docker push tuusuario/cerrosneakers23-backend:latest

# Push del frontend
docker push tuusuario/cerrosneakers23-frontend:latest
```

**Nota**: El primer push puede tardar varios minutos dependiendo de tu conexión.

### 4.5 Actualizar docker-compose.prod.yml

Edita el archivo `docker-compose.prod.yml` y reemplaza `tuusuario` con tu usuario real de Docker Hub:

```yaml
backend:
  image: tuusuario/cerrosneakers23-backend:latest
  # ...

frontend:
  image: tuusuario/cerrosneakers23-frontend:latest
  # ...
```

## Paso 5: Desplegar en el Servidor AWS

### 5.1 Copiar archivos de configuración al servidor

Desde tu máquina local, envía solo los archivos necesarios:

```bash
# Crear carpeta temporal con archivos necesarios
mkdir deploy-temp
copy docker-compose.prod.yml deploy-temp\

# Copiar al servidor (desde PowerShell o CMD)
scp -i tu-clave.pem deploy-temp\docker-compose.prod.yml ubuntu@[IP-DE-TU-EC2]:~/

# (OPCIONAL) Solo si tienes datos existentes que quieres migrar:
scp -i tu-clave.pem backend\catalog.db ubuntu@[IP-DE-TU-EC2]:~/ 2>nul
scp -i tu-clave.pem -r backend\uploads ubuntu@[IP-DE-TU-EC2]:~/ 2>nul
```

**Nota importante**: 
- **catalog.db**: SQLite lo creará automáticamente cuando la aplicación inicie por primera vez. Solo copia este archivo si ya tienes una base de datos con datos que quieres migrar.
- **uploads/**: Solo necesario si tienes imágenes de productos existentes.

### 5.2 Conectar al servidor y preparar directorios

```bash
# Conectar por SSH
ssh -i tu-clave.pem ubuntu@[IP-DE-TU-EC2]

# Crear estructura de directorios (opcional, pero recomendado)
# Docker Compose las crearía automáticamente, pero es mejor crearlas 
# manualmente para tener control sobre los permisos desde el inicio
mkdir -p ~/cerrosneakers23/data/uploads
mkdir -p ~/cerrosneakers23/letsencrypt

# Mover archivos a la ubicación correcta
mv ~/docker-compose.prod.yml ~/cerrosneakers23/

# Solo si copiaste estos archivos (datos existentes):
mv ~/catalog.db ~/cerrosneakers23/data/ 2>/dev/null || true
mv ~/uploads/* ~/cerrosneakers23/data/uploads/ 2>/dev/null || true

# Ir al directorio del proyecto
cd ~/cerrosneakers23

# Ajustar permisos (opcional)
chmod 600 letsencrypt 2>/dev/null || true
chmod 644 data/catalog.db 2>/dev/null || true
```

### 5.3 Descargar las imágenes Docker

```bash
# Descargar las imágenes desde Docker Hub
docker-compose -f docker-compose.prod.yml pull
```

### 5.4 Iniciar los contenedores

```bash
# Iniciar en modo detached
docker-compose -f docker-compose.prod.yml up -d

# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f
```

### 5.5 Verificar estado de los servicios

```bash
# Ver contenedores en ejecución
docker ps

# Ver logs de Traefik
docker-compose -f docker-compose.prod.yml logs traefik

# Ver logs del backend
docker-compose -f docker-compose.prod.yml logs backend

# Ver logs del frontend
docker-compose -f docker-compose.prod.yml logs frontend
```

## Paso 6: Verificar el Despliegue

### 6.1 Comprobar certificados SSL

Espera 1-2 minutos y visita:
- `http://cerrosneakers23.com.ar` → Debe redirigir a HTTPS
- `https://cerrosneakers23.com.ar` → Debe mostrar tu aplicación con candado verde

### 6.2 Verificar API

Prueba que el backend funcione:
```bash
curl https://cerrosneakers23.com.ar/api/health
```

### 6.3 Panel de Traefik

Para desarrollo, puedes acceder al dashboard de Traefik en:
- `http://[IP-DE-TU-EC2]:8080`

**⚠️ IMPORTANTE**: En producción, debes desactivar este puerto. Ver sección de Seguridad.

## Paso 7: Configuración de Producción

### 7.1 Deshabilitar dashboard de Traefik

Para producción, edita `docker-compose.prod.yml` en el servidor y comenta la línea:

```yaml
# - "--api.insecure=true"  # ← Comentar esta línea
```

Y elimina el puerto 8080:

```yaml
ports:
  - "80:80"
  - "443:443"
  # - "8080:8080"  # ← Comentar o eliminar
```

Reinicia los servicios:

```bash
cd ~/cerrosneakers23
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### 7.2 Configurar firewall adicional (UFW)

```bash
# Habilitar UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 7.3 Configurar backups automáticos

Crea un script de backup:

```bash
mkdir -p ~/backups
nano ~/backup.sh
```

Contenido del script:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=~/backups

# Backup de la base de datos
cp ~/cerrosneakers23/data/catalog.db $BACKUP_DIR/catalog_$DATE.db

# Backup de uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz ~/cerrosneakers23/data/uploads

# Limpiar backups antiguos (mantener solo los últimos 7 días)
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completado: $DATE"
```

Hazlo ejecutable y programa con cron:

```bash
chmod +x ~/backup.sh

# Editar crontab
crontab -e

# Agregar esta línea para backup diario a las 2 AM
0 2 * * * /home/ubuntu/backup.sh >> /home/ubuntu/backup.log 2>&1
```

## Paso 8: Monitoreo y Mantenimiento

### 8.1 Comandos útiles

```bash
# Ir al directorio del proyecto
cd ~/cerrosneakers23

# Ver estado de servicios
docker-compose -f docker-compose.prod.yml ps

# Ver uso de recursos
docker stats

# Ver logs de errores
docker-compose -f docker-compose.prod.yml logs --tail=100 -f

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Limpiar imágenes antiguas
docker system prune -a
```

### 8.2 Actualizar aplicación

Cuando necesites actualizar tu aplicación:

**Desde tu máquina local:**

```bash
# 1. Hacer cambios en el código
# 2. Reconstruir las imágenes
cd c:\Users\tomas\OneDrive\Documentos\cerrosneakers23
docker build -t tuusuario/cerrosneakers23-backend:latest ./backend
docker build -t tuusuario/cerrosneakers23-frontend:latest ./frontend

# 3. Publicar las nuevas versiones
docker push tuusuario/cerrosneakers23-backend:latest
docker push tuusuario/cerrosneakers23-frontend:latest
```

**En el servidor AWS:**

```bash
cd ~/cerrosneakers23

# Descargar las nuevas imágenes
docker-compose -f docker-compose.prod.yml pull

# Recrear los contenedores
docker-compose -f docker-compose.prod.yml up -d

# Verificar que todo funcione
docker-compose -f docker-compose.prod.yml logs -f
```

### 8.3 Renovación de certificados SSL

Los certificados de Let's Encrypt se renuevan automáticamente. Traefik lo maneja por ti.

Para verificar la fecha de expiración:

```bash
echo | openssl s_client -servername cerrosneakers23.com.ar -connect cerrosneakers23.com.ar:443 2>/dev/null | openssl x509 -noout -dates
```

## Solución de Problemas

### Problema: No se obtienen certificados SSL

**Síntomas**: La página muestra error de certificado o "No es segura"

**Soluciones**:
1. Verifica que el DNS apunte a la IP correcta:
   ```bash
   nslookup cerrosneakers23.com.ar
   ```

2. Verifica que el puerto 80 esté accesible desde internet:
   ```bash
   sudo netstat -tulpn | grep :80
   ```

3. Revisa los logs de Traefik:
   ```bash
   docker-compose logs traefik | grep acme
   ```

4. Si usaste el servidor de staging, descomenta la línea en `docker-compose.yml`:
   ```yaml
   #- "--certificatesresolvers.myresolver.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory"
   ```
   Y borra el archivo de certificados:
   ```bash
   rm -rf letsencrypt/acme.json
   docker-compose restart traefik
   ```

### Problema: Contenedores no inician

```bash
cd ~/cerrosneakers23

# Ver logs detallados
docker-compose -f docker-compose.prod.yml logs

# Verificar que no haya conflictos de puerto
sudo netstat -tulpn | grep -E ':(80|443|8080)'

# Reconstruir desde cero
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Problema: Base de datos se pierde al reiniciar

Verifica que los volúmenes estén correctamente montados:

```bash
cd ~/cerrosneakers23
docker-compose -f docker-compose.prod.yml down
ls -la data/catalog.db
ls -la data/uploads/
docker-compose -f docker-compose.prod.yml up -d
```

## Mejoras Adicionales

### Habilitar www (opcional)

Si quieres que `www.cerrosneakers23.com.ar` también funcione, actualiza las reglas de Traefik en `docker-compose.prod.yml`:

```yaml
# En lugar de:
- "traefik.http.routers.frontend.rule=Host(`cerrosneakers23.com.ar`)"

# Usa:
- "traefik.http.routers.frontend.rule=Host(`cerrosneakers23.com.ar`) || Host(`www.cerrosneakers23.com.ar`)"
```

Luego reinicia:
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Configurar CI/CD con GitHub Actions

Crea `.github/workflows/deploy.yml` para deployments automáticos:
- Build automático de imágenes
- Push a Docker Hub
- Webhook para actualizar el servidor

### Agregar monitoring con Prometheus y Grafana

Para métricas avanzadas, considera agregar servicios de monitoreo al `docker-compose.prod.yml`.

## Costos Estimados AWS

- **t2.small** (2 GB RAM): ~$17/mes
- **t2.medium** (4 GB RAM): ~$33/mes
- **Elastic IP**: Gratis mientras esté asociada a instancia en ejecución
- **Almacenamiento**: ~$2-3/mes por 30 GB
- **Transferencia de datos**: Los primeros 100 GB/mes son gratis

**Total estimado**: $20-40/mes dependiendo del tipo de instancia.

---

## ✅ Checklist de Despliegue

- [ ] Instancia EC2 creada y en ejecución
- [ ] Security Group configurado (puertos 22, 80, 443)
- [ ] IP elástica asignada
- [ ] DNS configurado (registro A apuntando a IP de EC2)
- [ ] Docker y Docker Compose instalados en el servidor
- [ ] Cuenta de Docker Hub creada
- [ ] Imágenes construidas localmente
- [ ] Imágenes publicadas en Docker Hub
- [ ] `docker-compose.prod.yml` actualizado con tu usuario de Docker Hub
- [ ] Archivos de configuración copiados al servidor
- [ ] Directorios creados en el servidor (`data/`, `letsencrypt/`)
- [ ] Imágenes descargadas en el servidor (`docker-compose pull`)
- [ ] Contenedores iniciados (`docker-compose up -d`)
- [ ] Certificados SSL obtenidos (candado verde en navegador)
- [ ] API funcionando (`/api/...` responde correctamente)
- [ ] Dashboard de Traefik deshabilitado en producción
- [ ] Backups automáticos configurados
- [ ] Firewall UFW habilitado

---

**¡Listo!** Tu aplicación debería estar disponible en https://cerrosneakers23.com.ar 🎉
