package models

import (
	"errors"
	"strings"
	"time"
)

// CarouselSlide representa un slide del carousel de la home page
type CarouselSlide struct {
	ID         uint      `json:"id"`
	Titulo     string    `json:"titulo"`
	Subtitulo  string    `json:"subtitulo"`
	ImagenURL  string    `json:"imagen_url"`
	LinkCTA    string    `json:"link_cta"`    // Puede ser un link custom o producto
	ProductoID *uint     `json:"producto_id"` // FK nullable a products
	Orden      int       `json:"orden"`
	Activo     bool      `json:"activo"`
	PositionY  int       `json:"position_y"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// ValidateCreate valida los campos requeridos para crear un slide
func (c *CarouselSlide) ValidateCreate() error {
	if strings.TrimSpace(c.ImagenURL) == "" {
		return errors.New("la imagen es requerida")
	}

	return nil
}

// ValidateUpdate valida los campos para actualizar un slide
func (c *CarouselSlide) ValidateUpdate() error {
	if c.ImagenURL != "" && strings.TrimSpace(c.ImagenURL) == "" {
		return errors.New("la imagen no puede estar vacía")
	}

	return nil
}
