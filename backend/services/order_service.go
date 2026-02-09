package services

import (
	"fmt"
	"tiendaedgar/backend/models"
	"tiendaedgar/backend/repositories"
)

type OrderService struct {
	repo        *repositories.OrderRepository
	productRepo *repositories.ProductRepository
}

func NewOrderService(repo *repositories.OrderRepository, productRepo *repositories.ProductRepository) *OrderService {
	return &OrderService{
		repo:        repo,
		productRepo: productRepo,
	}
}

// CreateOrder crea un nuevo pedido y actualiza el stock
func (s *OrderService) CreateOrder(order *models.Order) error {
	// 1. Validar stock primero
	for _, item := range order.Items {
		product, err := s.productRepo.GetByID(item.ProductID)
		if err != nil {
			return fmt.Errorf("error al verificar producto %d: %w", item.ProductID, err)
		}
		if product == nil {
			return fmt.Errorf("producto %d no encontrado", item.ProductID)
		}
		if product.Stock < item.Quantity {
			return fmt.Errorf("stock insuficiente para producto %s (Stock: %d, Solicitado: %d)", product.Nombre, product.Stock, item.Quantity)
		}
	}

	// 2. Crear la orden
	// Nota: Idealmente esto debería ser una transacción única, pero GORM/Sqlite básico
	// requiere pasar la Tx entre repositorios. Por simplicidad en este MVP, lo hacemos en pasos.
	// Riesgo: Si falla la creación de orden después de descontar stock (o viceversa).
	if err := s.repo.Create(order); err != nil {
		return fmt.Errorf("error al crear orden: %w", err)
	}

	// 3. Descontar stock (si la orden no es Cancelada)
	// Asumimos que una nueva orden manual ya descuenta stock inmediatamente.
	if order.Status != models.OrderStatusCancelled {
		for _, item := range order.Items {
			// Ignoramos error de "insuficiente" aquí porque ya validamos arriba, 
			// aunque podría haber condición de carrera en alta concurrencia.
			if err := s.productRepo.ReduceStock(item.ProductID, item.Quantity); err != nil {
				// LOG: Error crítico, inconsistencia de stock
				fmt.Printf("ERROR CRÍTICO: Falló descuento de stock para producto %d en orden %d: %v\n", item.ProductID, order.ID, err)
			}
		}
	}

	return nil
}

// GetAllOrders obtiene pedidos con paginación y filtros
func (s *OrderService) GetAllOrders(page, limit int, status string, search string) ([]models.Order, int, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit
	return s.repo.GetAll(limit, offset, status, search)
}

// GetOrderByID obtiene un pedido por ID
func (s *OrderService) GetOrderByID(id uint) (*models.Order, error) {
	return s.repo.GetByID(id)
}

// UpdateOrderStatus actualiza el estado de un pedido
// UpdateOrderStatus actualiza el estado de un pedido y maneja el stock si es necesario
func (s *OrderService) UpdateOrderStatus(id uint, status models.OrderStatus) error {
	// 1. Obtener orden actual para ver estado previo
	order, err := s.repo.GetByID(id)
	if err != nil {
		return fmt.Errorf("error al obtener orden: %w", err)
	}
	if order == nil {
		return fmt.Errorf("orden no encontrada")
	}

	// 2. Si el estado nuevo es CANCELADO y el anterior NO lo era, devolvemos stock
	if status == models.OrderStatusCancelled && order.Status != models.OrderStatusCancelled {
		for _, item := range order.Items {
			if err := s.productRepo.IncreaseStock(item.ProductID, item.Quantity); err != nil {
				// Log error pero continuamos (o podríamos retornar error parcial)
				fmt.Printf("ERROR: Falló restitución de stock para producto %d: %v\n", item.ProductID, err)
			}
		}
	}

	// 3. (Opcional) Si reactivamos una orden cancelada, deberíamos descontar stock de nuevo
	// Por ahora lo dejamos simple: No se permite reactivar stock automáticamente o se asume manual.
	
	// 4. Actualizar estado
	return s.repo.UpdateStatus(id, status)
}

// UpdateOrder actualiza los datos generales de un pedido
func (s *OrderService) UpdateOrder(id uint, updates models.Order) error {
	order, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	if order == nil {
		return fmt.Errorf("orden no encontrada")
	}

	// Update allowed fields
	order.CustomerName = updates.CustomerName
	order.CustomerEmail = updates.CustomerEmail
	order.CustomerPhone = updates.CustomerPhone
	order.CustomerAddress = updates.CustomerAddress
	order.Notes = updates.Notes

	return s.repo.Update(order)
}

// DeleteOrder elimina un pedido y devuelve el stock
func (s *OrderService) DeleteOrder(id uint) error {
	// 1. Obtener orden para devolver el stock
	order, err := s.repo.GetByID(id)
	if err != nil {
		return fmt.Errorf("error al obtener orden: %w", err)
	}
	if order == nil {
		return fmt.Errorf("orden no encontrada")
	}

	// 2. Devolver stock si la orden no estaba cancelada
	if order.Status != models.OrderStatusCancelled {
		for _, item := range order.Items {
			if err := s.productRepo.IncreaseStock(item.ProductID, item.Quantity); err != nil {
				fmt.Printf("ERROR: Falló restitución de stock para producto %d: %v\n", item.ProductID, err)
			}
		}
	}

	// 3. Eliminar la orden
	return s.repo.Delete(id)
}
