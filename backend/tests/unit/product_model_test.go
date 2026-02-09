package unit

import (
	"testing"
	"tiendaedgar/backend/models"
)

// TestValidatePrice verifica la validación de precios
func TestValidatePrice(t *testing.T) {
	tests := []struct {
		name    string
		precio  float64
		wantErr bool
	}{
		{"precio positivo válido", 1000.00, false},
		{"precio cero inválido", 0, true},
		{"precio negativo inválido", -100, true},
		{"precio pequeño válido", 0.01, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &models.Product{Precio: tt.precio}
			err := p.ValidatePrice()
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidatePrice() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

// TestValidateImages verifica la validación de imágenes
func TestValidateImages(t *testing.T) {
	tests := []struct {
		name     string
		imagenes []string
		wantErr  bool
	}{
		{"sin imágenes", []string{}, false},
		{"una imagen", []string{"/img1.jpg"}, false},
		{"cuatro imágenes", []string{"/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg"}, false},
		{"cinco imágenes (máximo excedido)", []string{"/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg", "/img5.jpg"}, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := &models.Product{Imagenes: tt.imagenes}
			err := p.ValidateImages()
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateImages() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

// TestValidateCreate verifica la validación completa de creación
func TestValidateCreate(t *testing.T) {
	tests := []struct {
		name    string
		product models.Product
		wantErr bool
	}{
		{
			"producto válido completo",
			models.Product{
				Nombre:    "Remera Básica",
				Categoria: "remeras",
				Precio:    2500.00,
				Imagenes:  []string{"/img1.jpg"},
			},
			false,
		},
		{
			"sin nombre",
			models.Product{
				Categoria: "remeras",
				Precio:    2500.00,
			},
			true,
		},
		{
			"sin categoría",
			models.Product{
				Nombre: "Remera Básica",
				Precio: 2500.00,
			},
			true,
		},
		{
			"precio inválido",
			models.Product{
				Nombre:    "Remera Básica",
				Categoria: "remeras",
				Precio:    -100,
			},
			true,
		},
		{
			"demasiadas imágenes",
			models.Product{
				Nombre:    "Remera Básica",
				Categoria: "remeras",
				Precio:    2500.00,
				Imagenes:  []string{"/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg", "/5.jpg"},
			},
			true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.product.ValidateCreate()
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateCreate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
