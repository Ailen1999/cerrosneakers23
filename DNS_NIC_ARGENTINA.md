# Configurar DNS en NIC Argentina para AWS

Esta guía te ayudará a configurar los registros DNS de tu dominio `cerrosneakers23.com.ar` registrado en NIC Argentina para que apunte a tu instancia EC2 en AWS.

## Prerequisitos

1. ✅ Dominio registrado en NIC Argentina: `cerrosneakers23.com.ar`
2. ✅ Instancia EC2 creada en AWS
3. ✅ IP Elástica asignada a tu instancia EC2
4. ✅ Acceso al panel de NIC Argentina

## Paso 1: Obtener la IP Elástica de AWS

Antes de configurar el DNS, necesitas la IP pública de tu servidor:

### 1.1 En la Consola de AWS

1. Ve a **EC2** → **Elastic IPs**
2. Copia la dirección IP elástica que asignaste a tu instancia
3. Ejemplo: `18.231.194.25` (esta será TU IP)

**⚠️ IMPORTANTE**: Guarda esta IP, la necesitarás en el siguiente paso.

## Paso 2: Acceder al Panel de NIC Argentina

### 2.1 Iniciar sesión

1. Ve a [https://nic.ar/](https://nic.ar/)
2. Haz clic en **"Zona de Cliente"** (esquina superior derecha)
3. Inicia sesión con tu usuario y contraseña

### 2.2 Acceder a la gestión del dominio

1. Una vez logueado, ve a **"Mis Dominios"**
2. Busca y selecciona **cerrosneakers23.com.ar**
3. Haz clic en **"Administrar DNS"** o **"Gestionar Zona DNS"**

## Paso 3: Configurar los Registros DNS

NIC Argentina te permite configurar los registros DNS directamente. Necesitas crear registros tipo **A**.

### 3.1 Crear Registro A para el dominio principal

**Configuración:**

| Campo | Valor |
|-------|-------|
| **Tipo** | A |
| **Nombre / Host** | @ (o dejar vacío) |
| **Valor / Dirección IP** | [Tu IP Elástica de AWS] |
| **TTL** | 300 (5 minutos) o 3600 (1 hora) |

**Ejemplo:**
```
Tipo: A
Nombre: @
Valor: 18.231.194.25
TTL: 300
```

Esto hace que `cerrosneakers23.com.ar` apunte a tu servidor.

### 3.2 Crear Registro A para www (opcional pero recomendado)

**Configuración:**

| Campo | Valor |
|-------|-------|
| **Tipo** | A |
| **Nombre / Host** | www |
| **Valor / Dirección IP** | [Tu IP Elástica de AWS] |
| **TTL** | 300 (5 minutos) o 3600 (1 hora) |

**Ejemplo:**
```
Tipo: A
Nombre: www
Valor: 18.231.194.25
TTL: 300
```

Esto hace que `www.cerrosneakers23.com.ar` también apunte a tu servidor.

### 3.3 Eliminar o desactivar registros antiguos

Si ya tenías registros DNS configurados anteriormente:
- Elimina o desactiva cualquier registro A antiguo
- Asegúrate de que no haya conflictos con otros registros

## Paso 4: Guardar los Cambios

1. Haz clic en **"Guardar"** o **"Aplicar cambios"**
2. Confirma los cambios si te pide confirmación

## Paso 5: Verificar la Propagación DNS

Los cambios DNS pueden tardar de **5 minutos a 48 horas** en propagarse, aunque normalmente ocurre en **15-30 minutos**.

### 5.1 Verificar desde la línea de comandos

```bash
# En PowerShell o CMD
nslookup cerrosneakers23.com.ar

# Debería mostrar tu IP de AWS
```

**Resultado esperado:**
```
Servidor:  dns.google
Address:  8.8.8.8

Respuesta no autoritativa:
Nombre:  cerrosneakers23.com.ar
Address:  18.231.194.25
```

### 5.2 Verificar con herramientas online

Usa estas herramientas para verificar que los DNS se están propagando:

- [https://dnschecker.org/](https://dnschecker.org/)
  - Ingresa `cerrosneakers23.com.ar`
  - Verifica que apunte a tu IP de AWS en diferentes ubicaciones

- [https://www.whatsmydns.net/](https://www.whatsmydns.net/)
  - Ingresa tu dominio
  - Tipo: A
  - Verifica la propagación global

## Paso 6: Probar el Dominio

Una vez que el DNS se haya propagado:

### 6.1 Antes de desplegar la aplicación

```bash
# Debería responder (aunque con error 404 si no hay nada corriendo)
curl http://cerrosneakers23.com.ar
```

### 6.2 Después de desplegar con Docker

```bash
# Debería redirigir a HTTPS
curl -I http://cerrosneakers23.com.ar

# Debería mostrar tu aplicación
curl https://cerrosneakers23.com.ar
```

## Alternativa: Usar los Nameservers de NIC Argentina

Si NIC Argentina no te permite editar directamente los registros DNS, es posible que tengas que:

### Opción A: Usar los Nameservers de NIC Argentina

1. En el panel de NIC Argentina, configura los registros DNS como se explicó arriba
2. Asegúrate de que los nameservers estén configurados como:
   ```
   ns1.nic.ar
   ns2.nic.ar
   ```

### Opción B: Delegar a Route 53 de AWS (Avanzado)

Si prefieres usar AWS Route 53 para la gestión DNS completa:

1. **Crear una Hosted Zone en Route 53:**
   - Ve a **Route 53** en AWS
   - Crea una Hosted Zone para `cerrosneakers23.com.ar`
   - AWS te dará 4 nameservers

2. **Cambiar los Nameservers en NIC Argentina:**
   - En el panel de NIC Argentina
   - Ve a la configuración de nameservers
   - Reemplaza los nameservers por los de AWS Route 53
   ```
   ns-123.awsdns-12.com
   ns-456.awsdns-45.net
   ns-789.awsdns-78.org
   ns-012.awsdns-01.co.uk
   ```

3. **Configurar registros en Route 53:**
   - Crea registro A apuntando a tu IP Elástica

**Nota**: Esta opción tiene un costo adicional (~$0.50/mes por Hosted Zone).

## Resolución de Problemas

### Problema: DNS no se propaga después de 24 horas

```bash
# Verificar qué nameservers estás usando
nslookup -type=NS cerrosneakers23.com.ar

# Verificar qué IP devuelve el DNS
nslookup cerrosneakers23.com.ar
```

**Soluciones:**
1. Verifica que los registros fueron guardados correctamente en NIC Argentina
2. Asegúrate de no tener caché DNS local:
   ```powershell
   ipconfig /flushdns
   ```
3. Prueba desde otro dispositivo o red (datos móviles)

### Problema: "No se puede acceder al sitio"

1. **Verifica que el DNS esté resuelto:**
   ```bash
   nslookup cerrosneakers23.com.ar
   ```

2. **Verifica que la instancia EC2 esté corriendo:**
   - Comprueba en la consola AWS que tu instancia esté "Running"

3. **Verifica el Security Group:**
   - Puertos 80 y 443 deben estar abiertos (0.0.0.0/0)

4. **Verifica que Docker esté corriendo:**
   ```bash
   # SSH a tu servidor
   docker ps
   ```

### Problema: Certificado SSL no se genera

Let's Encrypt necesita que el DNS esté resuelto correctamente:

1. **Espera a que el DNS se propague completamente** (mínimo 30 minutos)
2. **Verifica que el puerto 80 esté accesible** desde internet
3. **Revisa los logs de Traefik:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs traefik | grep acme
   ```

## Resumen de Configuración

Una vez completados todos los pasos, tu configuración debería verse así:

### Registros DNS en NIC Argentina:

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | [Tu IP AWS] | 300 |
| A | www | [Tu IP AWS] | 300 |

### Nameservers:
```
ns1.nic.ar
ns2.nic.ar
```

### Verificación:
```bash
nslookup cerrosneakers23.com.ar
# Debe devolver tu IP de AWS
```

---

## ✅ Checklist de DNS

- [ ] IP Elástica obtenida de AWS
- [ ] Acceso al panel de NIC Argentina
- [ ] Registro A creado para @ (dominio principal)
- [ ] Registro A creado para www (subdominio)
- [ ] Cambios guardados en NIC Argentina
- [ ] DNS verificado con `nslookup`
- [ ] Propagación verificada con dnschecker.org
- [ ] Acceso HTTP funciona (aunque redirija)
- [ ] Certificado SSL generado (candado verde)
- [ ] Acceso HTTPS funciona completamente

---

**¡Listo!** Una vez que el DNS esté propagado, tu dominio apuntará correctamente a tu instancia EC2 y Traefik podrá solicitar automáticamente los certificados SSL. 🎉
