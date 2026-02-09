package models

import (
	"errors"
	"strings"
	"time"
)

// Product representa un producto del catálogo
type Product struct {
	ID          uint      `json:"id"`
	Nombre      string    `json:"nombre"`
	Descripcion string    `json:"descripcion"`
	Categoria   string    `json:"categoria"`
	Genero      string    `json:"genero"`
	Temporada   string    `json:"temporada"`
	Precio      float64   `json:"precio"`
	PrecioLista float64   `json:"precio_lista"`
	Stock       int            `json:"stock"`
	StockBySize map[string]int `json:"stock_by_size"` // Se guardará como JSON string en SQLite
	Tallas      []string       `json:"tallas"`        // Se guardará como JSON string en SQLite
	Colores     []string       `json:"colores"`       // Se guardará como JSON string en SQLite
	Imagenes    []string       `json:"imagenes"`      // Se guardará como JSON string en SQLite
	Activo      bool           `json:"activo"`
	Destacado   bool           `json:"destacado"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
}

// ValidateCreate valida los campos requeridos para crear un producto
func (p *Product) ValidateCreate() error {
	if strings.TrimSpace(p.Nombre) == "" {
		return errors.New("el nombre es requerido")
	}
	
	if strings.TrimSpace(p.Categoria) == "" {
		return errors.New("la categoría es requerida")
	}
	
	if err := p.ValidatePrice(); err != nil {
		return err
	}
	
	if err := p.ValidateImages(); err != nil {
		return err
	}
	
	return nil
}

// ValidateUpdate valida los campos para actualizar un producto
func (p *Product) ValidateUpdate() error {
	if p.Nombre != "" && strings.TrimSpace(p.Nombre) == "" {
		return errors.New("el nombre no puede estar vacío")
	}
	
	if p.Categoria != "" && strings.TrimSpace(p.Categoria) == "" {
		return errors.New("la categoría no puede estar vacía")
	}
	
	// Always validate price if it's being set
	if err := p.ValidatePrice(); err != nil {
		return err
	}
	
	if len(p.Imagenes) > 0 {
		if err := p.ValidateImages(); err != nil {
			return err
		}
	}
	
	return nil
}

// ValidatePrice valida que el precio sea mayor a 0
func (p *Product) ValidatePrice() error {
	if p.Precio <= 0 {
		return errors.New("el precio debe ser mayor a 0")
	}
	return nil
}

// ValidateImages valida que no haya más de 4 imágenes
func (p *Product) ValidateImages() error {
	if len(p.Imagenes) > 4 {
		return errors.New("no se permiten más de 4 imágenes por producto")
	}
	return nil
}
