package handlers

import (
	"net/http"

	"tiendaedgar/backend/database"
	"tiendaedgar/backend/models"
	"tiendaedgar/backend/repositories"
	"tiendaedgar/backend/utils"

	"github.com/gin-gonic/gin"
)

// AuthHandler maneja las peticiones de autenticación
type AuthHandler struct {
	userRepo *repositories.UserRepository
}

// NewAuthHandler crea una nueva instancia de AuthHandler
func NewAuthHandler() *AuthHandler {
	return &AuthHandler{
		userRepo: repositories.NewUserRepository(database.DB),
	}
}

// LoginRequest define la estructura de la petición de login
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse define la estructura de la respuesta de login
type LoginResponse struct {
	Token    string       `json:"token"`
	User     *models.User `json:"user"`
	Message  string       `json:"message"`
}

// Login maneja la autenticación de usuarios
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest

	// Validar el body de la petición
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Username y password son requeridos",
		})
		return
	}

	// Buscar el usuario por username
	user, err := h.userRepo.FindByUsername(req.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Credenciales inválidas",
		})
		return
	}

	// Verificar la contraseña
	if err := user.CheckPassword(req.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Credenciales inválidas",
		})
		return
	}

	// Generar token JWT
	token, err := utils.GenerateToken(user.ID, user.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al generar token de autenticación",
		})
		return
	}

	// Retornar respuesta exitosa
	c.JSON(http.StatusOK, LoginResponse{
		Token:   token,
		User:    user,
		Message: "Login exitoso",
	})
}
