package services

import (
	"fmt"

	"tiendaedgar/backend/models"
	"tiendaedgar/backend/repositories"
)

// ProductService maneja la lógica de negocio de productos
type ProductService struct {
	repo *repositories.ProductRepository
}

// NewProductService crea una nueva instancia del servicio
func NewProductService(repo *repositories.ProductRepository) *ProductService {
	return &ProductService{
		repo: repo,
	}
}

// CreateProduct crea un nuevo producto con validaciones
func (s *ProductService) CreateProduct(product *models.Product) error {
	// Validar el producto
	if err := product.ValidateCreate(); err != nil {
		return err
	}

	// Crear el producto en la base de datos
	if err := s.repo.Create(product); err != nil {
		return fmt.Errorf("error al crear producto: %w", err)
	}

	return nil
}

// GetAllProducts obtiene todos los productos con paginación y filtros
func (s *ProductService) GetAllProducts(limit, offset int, categories, genders, sizes, temporadas []string, search, sort string) ([]models.Product, int, error) {
	// Valores por defecto para paginación
	if limit <= 0 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}

	// Limitar el número máximo de resultados por página
	if limit > 100 {
		limit = 100
	}

	return s.repo.GetAll(limit, offset, categories, genders, sizes, temporadas, search, sort)
}

// GetProductByID obtiene un producto por su ID
func (s *ProductService) GetProductByID(id uint) (*models.Product, error) {
	product, err := s.repo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("error al obtener producto: %w", err)
	}

	if product == nil {
		return nil, fmt.Errorf("producto no encontrado")
	}

	return product, nil
}

// UpdateProduct actualiza un producto completo
func (s *ProductService) UpdateProduct(product *models.Product) error {
	// Validar el producto
	if err := product.ValidateUpdate(); err != nil {
		return err
	}

	// Verificar que el producto existe
	existing, err := s.repo.GetByID(product.ID)
	if err != nil {
		return fmt.Errorf("error al verificar producto: %w", err)
	}

	if existing == nil {
		return fmt.Errorf("producto no encontrado")
	}

	// Actualizar el producto
	if err := s.repo.Update(product); err != nil {
		return fmt.Errorf("error al actualizar producto: %w", err)
	}

	return nil
}

// PartialUpdateProduct actualiza campos específicos de un producto
func (s *ProductService) PartialUpdateProduct(id uint, updates map[string]interface{}) error {
	// Verificar que el producto existe
	existing, err := s.repo.GetByID(id)
	if err != nil {
		return fmt.Errorf("error al verificar producto: %w", err)
	}

	if existing == nil {
		return fmt.Errorf("producto no encontrado")
	}

	// Validar campos específicos si están presentes
	if precio, ok := updates["precio"].(float64); ok {
		if precio <= 0 {
			return fmt.Errorf("el precio debe ser mayor a 0")
		}
	}

	// Actualizar el producto
	if err := s.repo.PartialUpdate(id, updates); err != nil {
		return fmt.Errorf("error al actualizar producto: %w", err)
	}

	return nil
}

// DeleteProduct elimina un producto
func (s *ProductService) DeleteProduct(id uint) error {
	// Verificar que el producto existe
	existing, err := s.repo.GetByID(id)
	if err != nil {
		return fmt.Errorf("error al verificar producto: %w", err)
	}

	if existing == nil {
		return fmt.Errorf("producto no encontrado")
	}

	// Eliminar el producto
	if err := s.repo.Delete(id); err != nil {
		return fmt.Errorf("error al eliminar producto: %w", err)
	}

	return nil
}
// BulkDeleteProducts elimina múltiple productos
func (s *ProductService) BulkDeleteProducts(ids []uint) error {
	if len(ids) == 0 {
		return nil
	}

	// Podríamos agregar validaciones de existencia aquí si quisiéramos ser estrictos,
	// pero por eficiencia delegamos al repositorio la eliminación masiva.
	if err := s.repo.BulkDelete(ids); err != nil {
		return fmt.Errorf("error en el servicio al eliminar productos: %w", err)
	}

	return nil
}
