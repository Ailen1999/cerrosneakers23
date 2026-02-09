package handlers

import (
	"net/http"
	"strconv"

	"strings"
	"tiendaedgar/backend/models"
	"tiendaedgar/backend/services"

	"github.com/gin-gonic/gin"
)

// ProductHandler maneja las peticiones HTTP de productos
type ProductHandler struct {
	service *services.ProductService
}

// NewProductHandler crea una nueva instancia del handler
func NewProductHandler(service *services.ProductService) *ProductHandler {
	return &ProductHandler{
		service: service,
	}
}

// CreateProduct maneja POST /api/products
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var product models.Product

	// Parsear el JSON del body
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"message": err.Error(),
		})
		return
	}

	// Crear el producto
	if err := h.service.CreateProduct(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Error al crear producto",
			"message": err.Error(),
		})
		return
	}

	// Retornar el producto creado
	c.JSON(http.StatusCreated, product)
}

// GetAllProducts maneja GET /api/products
func (h *ProductHandler) GetAllProducts(c *gin.Context) {
	// Parsear query params para paginación
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	// Parsear filtros
	search := c.Query("search")
	sort := c.Query("sort")

	var categories []string
	if catStr := c.Query("category"); catStr != "" {
		categories = strings.Split(catStr, ",")
	}

	var genders []string
	if genStr := c.Query("gender"); genStr != "" {
		genders = strings.Split(genStr, ",")
	}

	var sizes []string
	if sizeStr := c.Query("sizes"); sizeStr != "" {
		sizes = strings.Split(sizeStr, ",")
	}

	var temporadas []string
	if tempStr := c.Query("temporada"); tempStr != "" {
		temporadas = strings.Split(tempStr, ",")
	}

	// Obtener productos
	products, total, err := h.service.GetAllProducts(limit, offset, categories, genders, sizes, temporadas, search, sort)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error al obtener productos",
			"message": err.Error(),
		})
		return
	}

	// Calcular totalPages
	totalPages := (total + limit - 1) / limit // Ceiling division
	
	// Retornar respuesta con productos y total
	c.JSON(http.StatusOK, gin.H{
		"products":   products,
		"total":      total,
		"totalPages": totalPages,
	})
}

// GetProductByID maneja GET /api/products/:id
func (h *ProductHandler) GetProductByID(c *gin.Context) {
	// Obtener ID del parámetro
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "ID inválido",
			"message": "El ID debe ser un número válido",
		})
		return
	}

	// Obtener producto
	product, err := h.service.GetProductByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "Producto no encontrado",
			"message": err.Error(),
		})
		return
	}

	// Retornar producto
	c.JSON(http.StatusOK, product)
}

// UpdateProduct maneja PUT /api/products/:id
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	// Obtener ID del parámetro
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "ID inválido",
			"message": "El ID debe ser un número válido",
		})
		return
	}

	var product models.Product

	// Parsear el JSON del body
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"message": err.Error(),
		})
		return
	}

	// Asignar el ID del parámetro URL
	product.ID = uint(id)

	// Actualizar el producto
	if err := h.service.UpdateProduct(&product); err != nil {
		if err.Error() == "producto no encontrado" {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Producto no encontrado",
				"message": err.Error(),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Error al actualizar producto",
			"message": err.Error(),
		})
		return
	}

	// Retornar el producto actualizado
	c.JSON(http.StatusOK, product)
}

// PartialUpdateProduct maneja PATCH /api/products/:id
func (h *ProductHandler) PartialUpdateProduct(c *gin.Context) {
	// Obtener ID del parámetro
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "ID inválido",
			"message": "El ID debe ser un número válido",
		})
		return
	}

	var updates map[string]interface{}

	// Parsear el JSON del body
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"message": err.Error(),
		})
		return
	}

	// Actualizar el producto
	if err := h.service.PartialUpdateProduct(uint(id), updates); err != nil {
		if err.Error() == "producto no encontrado" {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Producto no encontrado",
				"message": err.Error(),
			})
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Error al actualizar producto",
			"message": err.Error(),
		})
		return
	}

	// Obtener el producto actualizado para retornarlo
	product, _ := h.service.GetProductByID(uint(id))
	c.JSON(http.StatusOK, product)
}

// DeleteProduct maneja DELETE /api/products/:id
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	// Obtener ID del parámetro
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "ID inválido",
			"message": "El ID debe ser un número válido",
		})
		return
	}

	// Eliminar el producto
	if err := h.service.DeleteProduct(uint(id)); err != nil {
		if err.Error() == "producto no encontrado" {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Producto no encontrado",
				"message": err.Error(),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error al eliminar producto",
			"message": err.Error(),
		})
		return
	}

	// Retornar 204 No Content
	c.Status(http.StatusNoContent)
}
// BulkDeleteProducts maneja POST /api/products/bulk-delete
func (h *ProductHandler) BulkDeleteProducts(c *gin.Context) {
	var req struct {
		IDs []uint `json:"ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Datos inválidos",
			"message": "Se requiere una lista de IDs para eliminar",
		})
		return
	}

	if err := h.service.BulkDeleteProducts(req.IDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Error al eliminar productos",
			"message": err.Error(),
		})
		return
	}

	c.Status(http.StatusNoContent)
}
