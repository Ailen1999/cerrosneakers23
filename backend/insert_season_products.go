package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type ProductInsert struct {
	Nombre      string
	Descripcion string
	Categoria   string
	Genero      string
	Temporada   string
	Precio      float64
	PrecioLista float64
	Stock       int
	Tallas      []string
	Colores     []string
	Imagenes    []string
	Activo      bool
	Destacado   bool
}

func main() {
	// Conectar a la base de datos
	db, err := sql.Open("sqlite3", "./catalog.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Productos de INVIERNO
	invierno := []ProductInsert{
		{
			Nombre:      "Campera Inflable Negra",
			Descripcion: "Campera inflable de alta calidad, perfecta para el frío invernal. Material resistente al agua.",
			Categoria:   "indumentaria",
			Genero:      "unisex",
			Temporada:   "invierno",
			Precio:      45990,
			PrecioLista: 55188,
			Stock:       15,
			Tallas:      []string{"S", "M", "L", "XL"},
			Colores:     []string{"Negro"},
			Imagenes:    []string{"/uploads/campera_invierno_negra_1770388716408.png"},
			Activo:      true,
			Destacado:   true,
		},
		{
			Nombre:      "Buzo con Capucha Gris",
			Descripcion: "Buzo con capucha de algodón premium, ideal para los días fríos. Bolsillo canguro frontal.",
			Categoria:   "indumentaria",
			Genero:      "unisex",
			Temporada:   "invierno",
			Precio:      24990,
			PrecioLista: 29988,
			Stock:       25,
			Tallas:      []string{"XS", "S", "M", "L", "XL"},
			Colores:     []string{"Gris"},
			Imagenes:    []string{"/uploads/buzo_invierno_gris_1770388730169.png"},
			Activo:      true,
			Destacado:   false,
		},
		{
			Nombre:      "Jean Azul Oscuro",
			Descripcion: "Jean de mezclilla de alta calidad con corte clásico. Perfecto para cualquier ocasión.",
			Categoria:   "indumentaria",
			Genero:      "unisex",
			Temporada:   "invierno",
			Precio:      32990,
			PrecioLista: 39588,
			Stock:       20,
			Tallas:      []string{"28", "30", "32", "34", "36"},
			Colores:     []string{"Azul Oscuro"},
			Imagenes:    []string{"/uploads/pantalon_invierno_jean_1770388745916.png"},
			Activo:      true,
			Destacado:   false,
		},
		{
			Nombre:      "Botas de Cuero Invierno",
			Descripcion: "Botas de cuero con interior afelpado. Suela antideslizante, perfectas para el invierno.",
			Categoria:   "calzado",
			Genero:      "unisex",
			Temporada:   "invierno",
			Precio:      54990,
			PrecioLista: 65988,
			Stock:       12,
			Tallas:      []string{"38", "39", "40", "41", "42", "43"},
			Colores:     []string{"Marrón"},
			Imagenes:    []string{"/uploads/zapatillas_invierno_borcego_1770388759728.png"},
			Activo:      true,
			Destacado:   true,
		},
		{
			Nombre:      "Sweater de Lana Beige",
			Descripcion: "Sweater tejido de lana natural con diseño de trenzas. Cálido y elegante.",
			Categoria:   "indumentaria",
			Genero:      "unisex",
			Temporada:   "invierno",
			Precio:      38990,
			PrecioLista: 46788,
			Stock:       18,
			Tallas:      []string{"S", "M", "L", "XL"},
			Colores:     []string{"Beige"},
			Imagenes:    []string{"/uploads/sweater_invierno_lana_1770388774185.png"},
			Activo:      true,
			Destacado:   false,
		},
		{
			Nombre:      "Gorro de Lana Negro",
			Descripcion: "Gorro tejido de lana con diseño clásico. Mantiene el calor de manera efectiva.",
			Categoria:   "indumentaria",
			Genero:      "unisex",
			Temporada:   "invierno",
			Precio:      8990,
			PrecioLista: 10788,
			Stock:       30,
			Tallas:      []string{"Único"},
			Colores:     []string{"Negro"},
			Imagenes:    []string{"/uploads/gorro_invierno_negro_1770388788210.png"},
			Activo:      true,
			Destacado:   false,
		},
	}

	// Productos de VERANO
	verano := []ProductInsert{
		{
			Nombre:      "Remera Básica Blanca",
			Descripcion: "Remera de algodón 100%, corte clásico. Perfecta para el verano.",
			Categoria:   "indumentaria",
			Genero:      "unisex",
			Temporada:   "verano",
			Precio:      12990,
			PrecioLista: 15588,
			Stock:       40,
			Tallas:      []string{"XS", "S", "M", "L", "XL", "XXL"},
			Colores:     []string{"Blanco"},
			Imagenes:    []string{"/uploads/remera_verano_blanca_1770388818851.png"},
			Activo:      true,
			Destacado:   true,
		},
		{
			Nombre:      "Short de Jean Azul",
			Descripcion: "Short de jean con corte moderno, ideal para días calurosos. Múltiples bolsillos.",
			Categoria:   "indumentaria",
			Genero:      "unisex",
			Temporada:   "verano",
			Precio:      22990,
			PrecioLista: 27588,
			Stock:       22,
			Tallas:      []string{"28", "30", "32", "34", "36"},
			Colores:     []string{"Azul"},
			Imagenes:    []string{"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500"},
			Activo:      true,
			Destacado:   false,
		},
		{
			Nombre:      "Zapatillas Blancas de Lona",
			Descripcion: "Zapatillas urbanas de lona blanca, cómodas y versátiles para el verano.",
			Categoria:   "calzado",
			Genero:      "unisex",
			Temporada:   "verano",
			Precio:      29990,
			PrecioLista: 35988,
			Stock:       18,
			Tallas:      []string{"37", "38", "39", "40", "41", "42", "43"},
			Colores:     []string{"Blanco"},
			Imagenes:    []string{"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"},
			Activo:      true,
			Destacado:   true,
		},
		{
			Nombre:      "Vestido Floral de Verano",
			Descripcion: "Vestido liviano con estampado floral, perfecto para días calurosos.",
			Categoria:   "indumentaria",
			Genero:      "mujer",
			Temporada:   "verano",
			Precio:      34990,
			PrecioLista: 41988,
			Stock:       15,
			Tallas:      []string{"XS", "S", "M", "L"},
			Colores:     []string{"Multicolor"},
			Imagenes:    []string{"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500"},
			Activo:      true,
			Destacado:   false,
		},
		{
			Nombre:      "Camisa de Lino Beige",
			Descripcion: "Camisa de lino natural, transpirable y fresca. Ideal para el calor del verano.",
			Categoria:   "indumentaria",
			Genero:      "unisex",
			Temporada:   "verano",
			Precio:      28990,
			PrecioLista: 34788,
			Stock:       20,
			Tallas:      []string{"S", "M", "L", "XL"},
			Colores:     []string{"Beige"},
			Imagenes:    []string{"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"},
			Activo:      true,
			Destacado:   false,
		},
		{
			Nombre:      "Sandalias de Cuero Marrón",
			Descripcion: "Sandalias de cuero genuino con suela de goma. Cómodas para todo el día.",
			Categoria:   "calzado",
			Genero:      "unisex",
			Temporada:   "verano",
			Precio:      24990,
			PrecioLista: 29988,
			Stock:       14,
			Tallas:      []string{"37", "38", "39", "40", "41", "42"},
			Colores:     []string{"Marrón"},
			Imagenes:    []string{"https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500"},
			Activo:      true,
			Destacado:   false,
		},
	}

	// Insertar todos los productos
	allProducts := append(invierno, verano...)
	
	for _, p := range allProducts {
		// Serializar arrays a JSON
		tallasJSON, _ := json.Marshal(p.Tallas)
		coloresJSON, _ := json.Marshal(p.Colores)
		imagenesJSON, _ := json.Marshal(p.Imagenes)

		query := `
			INSERT INTO products (nombre, descripcion, categoria, genero, temporada, precio, precio_lista, stock, tallas, colores, imagenes, activo, destacado, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`

		now := time.Now()
		_, err := db.Exec(
			query,
			p.Nombre,
			p.Descripcion,
			p.Categoria,
			p.Genero,
			p.Temporada,
			p.Precio,
			p.PrecioLista,
			p.Stock,
			string(tallasJSON),
			string(coloresJSON),
			string(imagenesJSON),
			p.Activo,
			p.Destacado,
			now,
			now,
		)

		if err != nil {
			log.Printf("Error insertando producto %s: %v", p.Nombre, err)
			continue
		}

		fmt.Printf("✓ Producto creado: %s (%s)\n", p.Nombre, p.Temporada)
	}

	fmt.Println("\n¡Productos insertados exitosamente!")
}
