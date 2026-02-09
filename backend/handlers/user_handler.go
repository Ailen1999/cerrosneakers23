package handlers

import (
	"net/http"
	"regexp"

	"tiendaedgar/backend/database"
	"tiendaedgar/backend/repositories"

	"github.com/gin-gonic/gin"
)

// UserHandler maneja las peticiones relacionadas al perfil de usuario
type UserHandler struct {
	userRepo *repositories.UserRepository
}

// NewUserHandler crea una nueva instancia de UserHandler
func NewUserHandler() *UserHandler {
	return &UserHandler{
		userRepo: repositories.NewUserRepository(database.DB),
	}
}

// GetProfile obtiene el perfil del usuario autenticado
func (h *UserHandler) GetProfile(c *gin.Context) {
	// Obtener user_id del contexto (seteado por el middleware de auth)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Usuario no autenticado",
		})
		return
	}

	// Buscar usuario
	user, err := h.userRepo.FindByID(userID.(uint))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Usuario no encontrado",
		})
		return
	}

	// Retornar perfil (sin password hash)
	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// UpdateEmailRequest define la estructura para actualizar email
type UpdateEmailRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// UpdateEmail actualiza el email del usuario
func (h *UserHandler) UpdateEmail(c *gin.Context) {
	var req UpdateEmailRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email inválido",
		})
		return
	}

	// Validar formato de email
	if !isValidEmail(req.Email) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Formato de email inválido",
		})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Usuario no autenticado",
		})
		return
	}

	// Actualizar email
	if err := h.userRepo.UpdateEmail(userID.(uint), req.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al actualizar email",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Email actualizado exitosamente",
		"email":   req.Email,
	})
}

// ChangePasswordRequest define la estructura para cambiar contraseña
type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required"`
}

// ChangePassword cambia la contraseña del usuario
func (h *UserHandler) ChangePassword(c *gin.Context) {
	var req ChangePasswordRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Datos inválidos",
		})
		return
	}

	// Validar longitud de nueva contraseña
	if len(req.NewPassword) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "La nueva contraseña debe tener al menos 6 caracteres",
		})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Usuario no autenticado",
		})
		return
	}

	// Buscar usuario
	user, err := h.userRepo.FindByID(userID.(uint))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Usuario no encontrado",
		})
		return
	}

	// Verificar contraseña actual
	if err := user.CheckPassword(req.CurrentPassword); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "La contraseña actual es incorrecta",
		})
		return
	}

	// Actualizar contraseña
	if err := user.UpdatePassword(req.NewPassword); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al procesar la nueva contraseña",
		})
		return
	}

	// Guardar en la base de datos
	if err := h.userRepo.UpdatePassword(user.ID, user.PasswordHash); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al actualizar la contraseña",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Contraseña actualizada exitosamente",
	})
}

// isValidEmail valida el formato de un email
func isValidEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}
