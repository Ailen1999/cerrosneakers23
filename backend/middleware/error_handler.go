package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ErrorResponse estructura para respuestas de error
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
}

// ErrorHandler middleware para manejo centralizado de errores
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Si hubo errores durante el procesamiento
		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			
			// Formato JSON consistente para errores
			c.JSON(http.StatusInternalServerError, ErrorResponse{
				Error:   "Error interno del servidor",
				Message: err.Error(),
			})
		}
	}
}
