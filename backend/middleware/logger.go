package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

// Logger middleware para logging de todas las requests
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Tiempo de inicio
		startTime := time.Now()

		// Procesar request
		c.Next()

		// Tiempo de finalización
		duration := time.Since(startTime)

		// Log de la request
		log.Printf(
			"[%s] %s %s - Status: %d - Duración: %v",
			c.Request.Method,
			c.Request.URL.Path,
			c.ClientIP(),
			c.Writer.Status(),
			duration,
		)
	}
}
