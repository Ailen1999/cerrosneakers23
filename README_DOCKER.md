# Desplegar Tienda Edgar con Docker y Traefik

Esta guía explica cómo construir y ejecutar la aplicación Tienda Edgar utilizando Docker, Docker Compose y Traefik como Proxy Reverso.

## Requisitos Previos

-   [Docker](https://docs.docker.com/get-docker/) instalado en tu máquina.
-   [Docker Compose](https://docs.docker.com/compose/install/) (generalmente incluido con Docker Desktop).

## Estructura de Servicios

1.  **Traefik**: Proxy inverso (Puerto 80). Enruta tráfico al frontend y backend.
2.  **Backend**: API en Go (No expuesto directamente).
3.  **Frontend**: React + Nginx (No expuesto directamente).

## Cómo Ejecutar (Entorno Local)

1.  Construye e inicia los servicios:

    ```bash
    docker-compose up --build -d
    ```

2.  Accede a la aplicación:
    -   **Tienda**: [http://localhost](http://localhost)
    -   **Panel Traefik**: [http://localhost:8080](http://localhost:8080)

## Consideraciones para Producción

La configuración actual es funcional pero requiere ajustes para un entorno productivo real:

1.  **Dominio Real**:
    -   Edita `docker-compose.yml` y cambia `Host('localhost')` por tu dominio real, ej: `Host('mi-tienda.com')`.

2.  **Seguridad (HTTPS)**:
    -   Habilita los "Resolvers" de certificados (Let's Encrypt) en Traefik para tener HTTPS automático.
    -   Redirige el tráfico HTTP a HTTPS.

3.  **Traefik Dashboard**:
    -   En producción, no debes exponer el dashboard en el puerto 8080 inseguro (`api.insecure=true`). Configúralo detrás de una ruta protegida con contraseña.

4.  **Configuración HTTPS (Let's Encrypt)**:
    -   El archivo `docker-compose.yml` ya está preconfigurado para solicitar certificados SSL automáticos.
    -   **IMPORTANTE**:
        1.  Cambia `tu-email@ejemplo.com` en la sección `command` del servicio `traefik` por tu email real.
        2.  Reemplaza `Host('localhost')` en las secciones `labels` de `frontend` y `backend` por tu dominio real (ej: `Host('tienda.com')`).
        3.  Asegúrate de que tu dominio apunte a la IP de tu servidor (Registro A DNS).
    -   Se ha habilitado el desafío HTTP (`httpChallenge`), por lo que el puerto 80 debe estar accesible desde internet.
    -   Los certificados se guardarán en la carpeta `./letsencrypt` del host.

## Comandos Útiles

-   **Ver logs**: `docker-compose logs -f`
-   **Detener**: `docker-compose down`
-   **Reconstruir**: `docker-compose up --build -d`
