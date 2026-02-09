package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

// UploadHandler maneja la carga de archivos
type UploadHandler struct{}

// NewUploadHandler crea una nueva instancia del handler
func NewUploadHandler() *UploadHandler {
	return &UploadHandler{}
}

// UploadFile maneja POST /api/upload
func (h *UploadHandler) UploadFile(c *gin.Context) {
	// Obtener el archivo del form-data
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No se ha enviado ningún archivo",
		})
		return
	}

	// Validar extensión (opcional, por seguridad básica)
	ext := filepath.Ext(file.Filename)
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Tipo de archivo no permitido. Use JPG, PNG o WEBP",
		})
		return
	}

	// Generar nombre único
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	dst := filepath.Join("uploads", filename)

	// Guardar el archivo
	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error al guardar el archivo",
		})
		return
	}

	// Construir URL completa
	// En producción, esto debería usar una variable de entorno para el host
	protocol := "http"
	if c.Request.TLS != nil {
		protocol = "https"
	}
	host := c.Request.Host
	url := fmt.Sprintf("%s://%s/uploads/%s", protocol, host, filename)

	c.JSON(http.StatusOK, gin.H{
		"url": url,
	})
}
