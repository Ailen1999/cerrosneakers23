package repositories

import (
	"database/sql"
	"fmt"
	"tiendaedgar/backend/models"
	"time"
)

// OrderRepository maneja las operaciones de base de datos para pedidos
type OrderRepository struct {
	db *sql.DB
}

// NewOrderRepository crea una nueva instancia del repositorio
func NewOrderRepository(db *sql.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

// Create inserta un nuevo pedido y sus items en la base de datos dentro de una transacción
func (r *OrderRepository) Create(order *models.Order) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}

	// 1. Insertar orden
	query := `
		INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total_amount, status, notes, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	res, err := tx.Exec(query,
		order.CustomerName, order.CustomerEmail, order.CustomerPhone, order.CustomerAddress,
		order.TotalAmount, order.Status, order.Notes, time.Now(), time.Now(),
	)
	if err != nil {
		tx.Rollback()
		return fmt.Errorf("error al insertar orden: %w", err)
	}

	orderID, err := res.LastInsertId()
	if err != nil {
		tx.Rollback()
		return err
	}
	order.ID = uint(orderID)

	// 2. Insertar items
	itemQuery := `
		INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
		VALUES (?, ?, ?, ?, ?, ?)
	`
	stmt, err := tx.Prepare(itemQuery)
	if err != nil {
		tx.Rollback()
		return err
	}
	defer stmt.Close()

	for _, item := range order.Items {
		_, err := stmt.Exec(orderID, item.ProductID, item.ProductName, item.Quantity, item.UnitPrice, item.Subtotal)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("error al insertar item del pedido: %w", err)
		}
	}

	// Commit transacción
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

// GetAll obtiene todos los pedidos con filtros y paginación
func (r *OrderRepository) GetAll(limit, offset int, status string, search string) ([]models.Order, int, error) {
	// Construir query base
	baseQuery := "FROM orders WHERE 1=1"
	args := []interface{}{}

	if status != "" {
		baseQuery += " AND status = ?"
		args = append(args, status)
	}

	if search != "" {
		baseQuery += " AND (customer_name LIKE ? OR customer_email LIKE ? OR id LIKE ?)"
		likeSearch := "%" + search + "%"
		args = append(args, likeSearch, likeSearch, likeSearch)
	}

	// Contar total
	var total int
	countQuery := "SELECT COUNT(*) " + baseQuery
	err := r.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Obtener resultados paginados
	query := "SELECT id, customer_name, customer_email, customer_phone, total_amount, status, created_at " + baseQuery + " ORDER BY created_at DESC LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var orders []models.Order
	for rows.Next() {
		var o models.Order
		// Nota: Escaneamos solo los campos necesarios para la lista
		if err := rows.Scan(&o.ID, &o.CustomerName, &o.CustomerEmail, &o.CustomerPhone, &o.TotalAmount, &o.Status, &o.CreatedAt); err != nil {
			return nil, 0, err
		}
		orders = append(orders, o)
	}

	return orders, total, nil
}

// GetByID obtiene un pedido por su ID incluyendo sus items
func (r *OrderRepository) GetByID(id uint) (*models.Order, error) {
	var o models.Order
	query := `
		SELECT id, customer_name, customer_email, customer_phone, customer_address, total_amount, status, notes, created_at, updated_at
		FROM orders WHERE id = ?
	`
	err := r.db.QueryRow(query, id).Scan(
		&o.ID, &o.CustomerName, &o.CustomerEmail, &o.CustomerPhone, &o.CustomerAddress,
		&o.TotalAmount, &o.Status, &o.Notes, &o.CreatedAt, &o.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	// Obtener items
	itemsQuery := `
		SELECT id, order_id, product_id, product_name, quantity, unit_price, subtotal
		FROM order_items WHERE order_id = ?
	`
	rows, err := r.db.Query(itemsQuery, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var item models.OrderItem
		if err := rows.Scan(&item.ID, &item.OrderID, &item.ProductID, &item.ProductName, &item.Quantity, &item.UnitPrice, &item.Subtotal); err != nil {
			return nil, err
		}
		o.Items = append(o.Items, item)
	}

	return &o, nil
}

// UpdateStatus actualiza el estado de un pedido
func (r *OrderRepository) UpdateStatus(id uint, status models.OrderStatus) error {
	query := "UPDATE orders SET status = ?, updated_at = ? WHERE id = ?"
	_, err := r.db.Exec(query, status, time.Now(), id)
	return err
}

// Update actualiza los datos del pedido (no status, no items)
func (r *OrderRepository) Update(order *models.Order) error {
	query := `
		UPDATE orders 
		SET customer_name = ?, customer_email = ?, customer_phone = ?, customer_address = ?, notes = ?, updated_at = ?
		WHERE id = ?
	`
	_, err := r.db.Exec(query,
		order.CustomerName, order.CustomerEmail, order.CustomerPhone, order.CustomerAddress, order.Notes, time.Now(), order.ID,
	)
	return err
}

// Delete elimina un pedido y sus items (cascade automático con foreign_keys=ON)
func (r *OrderRepository) Delete(id uint) error {
	result, err := r.db.Exec("DELETE FROM orders WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("error al eliminar orden: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("orden no encontrada")
	}

	return nil
}
