package handlers

import (
	"log"
	"net/http"
	"strconv"

	"tiendaedgar/backend/models"
	"tiendaedgar/backend/services"

	"github.com/gin-gonic/gin"
)

// CarouselHandler maneja las peticiones HTTP para carousel slides
type CarouselHandler struct {
	service *services.CarouselService
}

// NewCarouselHandler crea una nueva instancia del handler
func NewCarouselHandler() *CarouselHandler {
	return &CarouselHandler{
		service: services.NewCarouselService(),
	}
}

// GetActiveSlides maneja GET /api/carousel-slides - obtiene slides activos
func (h *CarouselHandler) GetActiveSlides(c *gin.Context) {
	slides, err := h.service.GetActiveSlides()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error al obtener slides",
			"message": err.Error(),
		})
		return
	}

	// Si no hay slides, devolver array vacío en lugar de null
	if slides == nil {
		slides = []models.CarouselSlide{}
	}

	c.JSON(http.StatusOK, gin.H{
		"slides": slides,
		"total":  len(slides),
	})
}

// GetSlideByID maneja GET /api/carousel-slides/:id
func (h *CarouselHandler) GetSlideByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "ID inválido",
			"message": "El ID debe ser un número válido",
		})
		return
	}

	slide, err := h.service.GetSlideByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error al obtener slide",
			"message": err.Error(),
		})
		return
	}

	if slide == nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "Slide no encontrado",
			"message": "El slide solicitado no existe",
		})
		return
	}

	c.JSON(http.StatusOK, slide)
}

// CreateSlide maneja POST /api/carousel-slides
func (h *CarouselHandler) CreateSlide(c *gin.Context) {
	var slide models.CarouselSlide

	if err := c.ShouldBindJSON(&slide); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"message": err.Error(),
		})
		return
	}

	if err := h.service.CreateSlide(&slide); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Error al crear slide",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, slide)
}

// UpdateSlide maneja PUT /api/carousel-slides/:id
func (h *CarouselHandler) UpdateSlide(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "ID inválido",
			"message": "El ID debe ser un número válido",
		})
		return
	}

	var slide models.CarouselSlide
	if err := c.ShouldBindJSON(&slide); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"message": err.Error(),
		})
		return
	}

	log.Printf("DEBUG: Updating slide %d. PositionY: %d", id, slide.PositionY)

	slide.ID = uint(id)

	if err := h.service.UpdateSlide(&slide); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Error al actualizar slide",
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, slide)
}

// DeleteSlide maneja DELETE /api/carousel-slides/:id
func (h *CarouselHandler) DeleteSlide(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "ID inválido",
			"message": "El ID debe ser un número válido",
		})
		return
	}

	if err := h.service.DeleteSlide(uint(id)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Error al eliminar slide",
			"message": err.Error(),
		})
		return
	}

	c.Status(http.StatusNoContent)
}
