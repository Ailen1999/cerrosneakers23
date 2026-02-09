package routes

import (
	"tiendaedgar/backend/database"
	"tiendaedgar/backend/handlers"
	"tiendaedgar/backend/middleware"
	"tiendaedgar/backend/repositories"
	"tiendaedgar/backend/services"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configura todas las rutas de la API
func SetupRoutes(router *gin.Engine) {
	// Aplicar middlewares globales
	router.Use(middleware.CORS())
	router.Use(middleware.Logger())
	router.Use(middleware.ErrorHandler())

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})


	// Crear repositorio, servicio y handler de autenticación
	authHandler := handlers.NewAuthHandler()
	
	// Crear repositorio, servicio y handler de productos
	productRepo := repositories.NewProductRepository(database.DB)
	productService := services.NewProductService(productRepo)
	productHandler := handlers.NewProductHandler(productService)

	// Crear handler de carousel slides
	carouselHandler := handlers.NewCarouselHandler()


	// Crear repositorio, servicio y handler de pedidos
	orderRepo := repositories.NewOrderRepository(database.DB)
	orderService := services.NewOrderService(orderRepo, productRepo)
	orderHandler := handlers.NewOrderHandler(orderService)

	// Crear handler de configuración
	configHandler := handlers.NewConfigHandler()
	
	// Crear handler de upload
	uploadHandler := handlers.NewUploadHandler()

	// Crear handler de usuario (perfil)
	userHandler := handlers.NewUserHandler()

	// Grupo de rutas API
	api := router.Group("/api")
	{
		// Rutas de autenticación (no requieren auth)
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)                // Login de admin
		}

		// Rutas de perfil de usuario (requieren auth)
		user := api.Group("/user")
		user.Use(middleware.AuthRequired())
		{
			user.GET("/profile", userHandler.GetProfile)          // Obtener perfil
			user.PUT("/email", userHandler.UpdateEmail)           // Actualizar email
			user.PUT("/password", userHandler.ChangePassword)     // Cambiar contraseña
		}

		// Rutas de productos
		products := api.Group("/products")
		{
			// Endpoints públicos (no requieren autenticación)
			products.GET("", productHandler.GetAllProducts)       // Listar productos (con paginación y filtros)
			products.GET("/:id", productHandler.GetProductByID)   // Obtener producto por ID
			
			// Endpoints protegidos (requieren autenticación)
			products.POST("", middleware.AuthRequired(), productHandler.CreateProduct)                // Crear producto
			products.PUT("/:id", middleware.AuthRequired(), productHandler.UpdateProduct)             // Actualizar producto completo
			products.PATCH("/:id", middleware.AuthRequired(), productHandler.PartialUpdateProduct)    // Actualizar producto parcial
			products.DELETE("/:id", middleware.AuthRequired(), productHandler.DeleteProduct)          // Eliminar producto
			products.POST("/bulk-delete", middleware.AuthRequired(), productHandler.BulkDeleteProducts) // Eliminar productos en masa
		}

		// Rutas de carousel slides
		carouselSlides := api.Group("/carousel-slides")
		{
			// Endpoints públicos (no requieren autenticación)
			carouselSlides.GET("", carouselHandler.GetActiveSlides)      // Obtener slides activos (customer-facing)
			carouselSlides.GET("/:id", carouselHandler.GetSlideByID)     // Obtener slide por ID
			
			// Endpoints protegidos (requieren autenticación)
			carouselSlides.POST("", middleware.AuthRequired(), carouselHandler.CreateSlide)        // Crear slide (admin)
			carouselSlides.PUT("/:id", middleware.AuthRequired(), carouselHandler.UpdateSlide)     // Actualizar slide (admin)
			carouselSlides.DELETE("/:id", middleware.AuthRequired(), carouselHandler.DeleteSlide)  // Eliminar slide (admin)
		}
		// Rutas de Orders
		orders := api.Group("/orders")
		{
			orders.POST("", middleware.AuthRequired(), orderHandler.CreateOrder)
			orders.GET("", middleware.AuthRequired(), orderHandler.GetOrders)
			orders.GET("/:id", middleware.AuthRequired(), orderHandler.GetOrder)
			orders.PUT("/:id", middleware.AuthRequired(), orderHandler.UpdateOrder)
			orders.PATCH("/:id/status", middleware.AuthRequired(), orderHandler.UpdateStatus)
			orders.DELETE("/:id", middleware.AuthRequired(), orderHandler.DeleteOrder)
		}

		// Rutas de configuración
		config := api.Group("/config")
		{
			// GET es público (para mostrar datos en el frontend público como WhatsApp, nombre, etc)
			// OJO: Si hay datos sensibles, separar. En este caso son datos de sitio públicos.
			config.GET("", configHandler.GetConfig)
			
			// PUT requiere auth (solo admin edita)
			config.PUT("", middleware.AuthRequired(), configHandler.UpdateConfig)
		}
		
		// Ruta de upload
		api.POST("/upload", middleware.AuthRequired(), uploadHandler.UploadFile)
	}
}
