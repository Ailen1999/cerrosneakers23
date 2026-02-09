package main

import (
	"log"

	"tiendaedgar/backend/config"
	"tiendaedgar/backend/database"
	"tiendaedgar/backend/models"
	"tiendaedgar/backend/repositories"
	"tiendaedgar/backend/routes"

	"github.com/gin-gonic/gin"
)

// seedCarouselSlides inserta slides de ejemplo si no existen
func seedCarouselSlides() {
	repo := repositories.NewCarouselRepository()

	// Verificar si ya hay slides
	existing, err := repo.GetActiveSlides()
	if err == nil && len(existing) > 0 {
		log.Println("Carousel slides ya existen, saltando seed...")
		return
	}

	// Slides de ejemplo
	slides := []models.CarouselSlide{
		{
			Titulo:     "Chaquetas para el Hombre Moderno",
			Subtitulo:  "Borde Urbano",
			ImagenURL:  "https://lh3.googleusercontent.com/aida-public/AB6AXuCqjwujgRwWY-YfC02W3d29d-6lyZFOBRxxaznm-aoDBEL027KreiqWHf56N5dUKBq9lYVJ9iKdfFxDVs18zalozfjEoH075GqfoxDr6YaLxshcFfD3WmfvRkUOIGy9PLzBRWjb3-K67bfukeTtgCEthBGWkqBUUa8CaeKXiQavJDsDiG14EO0swOeiwnOxcBeXTtAeuj7Gz5puR6rTR6zYxYtoFvJz8uf0pwjOZcsC5Qtr4LU_KFjwUNr0YvCj48kcWhK0Ei11CQBP",
			LinkCTA:    "/",
			ProductoID: nil,
			Orden:      1,
			Activo:     true,
		},
		{
			Titulo:     "Nueva Colección Otoño",
			Subtitulo:  "Estilo Urbano",
			ImagenURL:  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
			LinkCTA:    "/",
			ProductoID: nil,
			Orden:      2,
			Activo:     true,
		},
		{
			Titulo:     "Zapatillas Deportivas",
			Subtitulo:  "Comodidad y Estilo",
			ImagenURL:  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
			LinkCTA:    "/",
			ProductoID: nil,
			Orden:      3,
			Activo:     true,
		},
	}

	// Insertar cada slide
	for _, slide := range slides {
		if err := repo.Create(&slide); err != nil {
			log.Printf("Error al crear slide '%s': %v", slide.Titulo, err)
			continue
		}
		log.Printf("Slide creado: %s (ID: %d)", slide.Titulo, slide.ID)
	}

	log.Println("Seed de carousel slides completado")
}

func main() {
	// Cargar configuración
	cfg := config.New()

	// Inicializar base de datos
	if err := database.InitDB(cfg.DBPath); err != nil {
		log.Fatalf("Error al inicializar la base de datos: %v", err)
	}
	defer database.CloseDB()

	// Seed carousel slides (solo si no existen)
	seedCarouselSlides()

	// Configurar modo de Gin
	if !cfg.DebugMode {
		gin.SetMode(gin.ReleaseMode)
	}

	// Crear router
	router := gin.Default()

	// Configurar rutas
	router.Static("/uploads", "./uploads")
	routes.SetupRoutes(router)

	// Iniciar servidor
	log.Printf("Servidor iniciando en el puerto %s", cfg.ServerPort)
	if err := router.Run(cfg.ServerPort); err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}
