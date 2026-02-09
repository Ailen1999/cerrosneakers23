package middleware

import (
	"net/http"
	"strings"

	"tiendaedgar/backend/utils"

	"github.com/gin-gonic/gin"
)

// AuthRequired middleware verifica que la petición tenga un token JWT válido
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtener el header Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "No se proporcionó token de autenticación",
			})
			c.Abort()
			return
		}

		// El formato esperado es: "Bearer {token}"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Formato de token inválido. Use: Bearer {token}",
			})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// Validar el token
		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Token inválido o expirado",
			})
			c.Abort()
			return
		}

		// Guardar la información del usuario en el contexto
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)

		// Continuar con el siguiente handler
		c.Next()
	}
}
