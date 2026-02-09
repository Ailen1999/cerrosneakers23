# Script para insertar productos de temporada con autenticacion

Write-Host "=== Insertando Productos de Temporada ===" -ForegroundColor Cyan
Write-Host ""

# 1. Login para obtener token
Write-Host "1. Autenticando..." -ForegroundColor Yellow
$loginBody = '{"username":"admin","password":"admin123"}'

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "   OK - Login exitoso" -ForegroundColor Green
}
catch {
    Write-Host "   ERROR - Fallo en login" -ForegroundColor Red
    exit 1
}

# 2. Preparar headers con token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Productos a insertar
$products = @(
    '{"nombre":"Campera Inflable Negra","descripcion":"Campera inflable de alta calidad, perfecta para el frio invernal. Material resistente al agua.","categoria":"indumentaria","genero":"unisex","temporada":"invierno","precio":45990,"precio_lista":55188,"stock":15,"tallas":["S","M","L","XL"],"colores":["Negro"],"imagenes":["/uploads/campera_invierno_negra_1770388716408.png"],"activo":true,"destacado":true}',
    '{"nombre":"Buzo con Capucha Gris","descripcion":"Buzo con capucha de algodon premium, ideal para los dias frios. Bolsillo canguro frontal.","categoria":"indumentaria","genero":"unisex","temporada":"invierno","precio":24990,"precio_lista":29988,"stock":25,"tallas":["XS","S","M","L","XL"],"colores":["Gris"],"imagenes":["/uploads/buzo_invierno_gris_1770388730169.png"],"activo":true,"destacado":false}',
    '{"nombre":"Jean Azul Oscuro","descripcion":"Jean de mezclilla de alta calidad con corte clasico. Perfecto para cualquier ocasion.","categoria":"indumentaria","genero":"unisex","temporada":"invierno","precio":32990,"precio_lista":39588,"stock":20,"tallas":["28","30","32","34","36"],"colores":["Azul Oscuro"],"imagenes":["/uploads/pantalon_invierno_jean_1770388745916.png"],"activo":true,"destacado":false}',
    '{"nombre":"Botas de Cuero Invierno","descripcion":"Botas de cuero con interior afelpado. Suela antideslizante, perfectas para el invierno.","categoria":"calzado","genero":"unisex","temporada":"invierno","precio":54990,"precio_lista":65988,"stock":12,"tallas":["38","39","40","41","42","43"],"colores":["Marron"],"imagenes":["/uploads/zapatillas_invierno_borcego_1770388759728.png"],"activo":true,"destacado":true}',
    '{"nombre":"Sweater de Lana Beige","descripcion":"Sweater tejido de lana natural con diseno de trenzas. Calido y elegante.","categoria":"indumentaria","genero":"unisex","temporada":"invierno","precio":38990,"precio_lista":46788,"stock":18,"tallas":["S","M","L","XL"],"colores":["Beige"],"imagenes":["/uploads/sweater_invierno_lana_1770388774185.png"],"activo":true,"destacado":false}',
    '{"nombre":"Gorro de Lana Negro","descripcion":"Gorro tejido de lana con diseno clasico. Mantiene el calor de manera efectiva.","categoria":"indumentaria","genero":"unisex","temporada":"invierno","precio":8990,"precio_lista":10788,"stock":30,"tallas":["Unico"],"colores":["Negro"],"imagenes":["/uploads/gorro_invierno_negro_1770388788210.png"],"activo":true,"destacado":false}',
    '{"nombre":"Remera Basica Blanca","descripcion":"Remera de algodon 100%, corte clasico. Perfecta para el verano.","categoria":"indumentaria","genero":"unisex","temporada":"verano","precio":12990,"precio_lista":15588,"stock":40,"tallas":["XS","S","M","L","XL","XXL"],"colores":["Blanco"],"imagenes":["/uploads/remera_verano_blanca_1770388818851.png"],"activo":true,"destacado":true}',
    '{"nombre":"Short de Jean Azul","descripcion":"Short de jean con corte moderno, ideal para dias calurosos. Multiples bolsillos.","categoria":"indumentaria","genero":"unisex","temporada":"verano","precio":22990,"precio_lista":27588,"stock":22,"tallas":["28","30","32","34","36"],"colores":["Azul"],"imagenes":["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500"],"activo":true,"destacado":false}',
    '{"nombre":"Zapatillas Blancas de Lona","descripcion":"Zapatillas urbanas de lona blanca, comodas y versatiles para el verano.","categoria":"calzado","genero":"unisex","temporada":"verano","precio":29990,"precio_lista":35988,"stock":18,"tallas":["37","38","39","40","41","42","43"],"colores":["Blanco"],"imagenes":["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"],"activo":true,"destacado":true}',
    '{"nombre":"Vestido Floral de Verano","descripcion":"Vestido liviano con estampado floral, perfecto para dias calurosos.","categoria":"indumentaria","genero":"mujer","temporada":"verano","precio":34990,"precio_lista":41988,"stock":15,"tallas":["XS","S","M","L"],"colores":["Multicolor"],"imagenes":["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500"],"activo":true,"destacado":false}',
    '{"nombre":"Camisa de Lino Beige","descripcion":"Camisa de lino natural, transpirable y fresca. Ideal para el calor del verano.","categoria":"indumentaria","genero":"unisex","temporada":"verano","precio":28990,"precio_lista":34788,"stock":20,"tallas":["S","M","L","XL"],"colores":["Beige"],"imagenes":["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"],"activo":true,"destacado":false}',
    '{"nombre":"Sandalias de Cuero Marron","descripcion":"Sandalias de cuero genuino con suela de goma. Comodas para todo el dia.","categoria":"calzado","genero":"unisex","temporada":"verano","precio":24990,"precio_lista":29988,"stock":14,"tallas":["37","38","39","40","41","42"],"colores":["Marron"],"imagenes":["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500"],"activo":true,"destacado":false}'
)

# 4. Insertar productos
Write-Host ""
Write-Host "2. Insertando productos..." -ForegroundColor Yellow
$count = 0

foreach ($json in $products) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method Post -Body $json -Headers $headers
        $count++
        $prod = $json | ConvertFrom-Json
        Write-Host "   OK - $($prod.nombre) [$($prod.temporada)]" -ForegroundColor Green
        Start-Sleep -Milliseconds 200
    }
    catch {
        Write-Host "   ERROR - Fallo al insertar producto" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Total insertados: $count productos" -ForegroundColor Cyan
Write-Host ""
