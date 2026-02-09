package handlers

import (
	"net/http"
	"tiendaedgar/backend/models"
	"tiendaedgar/backend/services"

	"github.com/gin-gonic/gin"
)

type ConfigHandler struct {
	service *services.ConfigService
}

func NewConfigHandler() *ConfigHandler {
	return &ConfigHandler{
		service: services.NewConfigService(),
	}
}

func (h *ConfigHandler) GetConfig(c *gin.Context) {
	config, err := h.service.GetConfig()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener la configuración"})
		return
	}
	c.JSON(http.StatusOK, config)
}

func (h *ConfigHandler) UpdateConfig(c *gin.Context) {
	var configInput models.SiteConfig
	if err := c.ShouldBindJSON(&configInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateConfig(&configInput); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar la configuración"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Configuración actualizada correctamente"})
}
