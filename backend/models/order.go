package models

import (
	"time"
)

// OrderStatus define los posibles estados de un pedido
type OrderStatus string

const (
	OrderStatusPending    OrderStatus = "Pendiente"
	OrderStatusPaid       OrderStatus = "Pagado"
	OrderStatusProcessing OrderStatus = "En Preparación"
	OrderStatusShipped    OrderStatus = "Enviado"
	OrderStatusDelivered  OrderStatus = "Entregado"
	OrderStatusCancelled  OrderStatus = "Cancelado"
)

// Order representa un pedido en el sistema
type Order struct {
	ID              uint        `json:"id" db:"id"`
	CustomerName    string      `json:"customer_name" db:"customer_name"`
	CustomerEmail   string      `json:"customer_email" db:"customer_email"`
	CustomerPhone   string      `json:"customer_phone" db:"customer_phone"`
	CustomerAddress string      `json:"customer_address" db:"customer_address"`
	TotalAmount     float64     `json:"total_amount" db:"total_amount"`
	Status          OrderStatus `json:"status" db:"status"`
	Notes           string      `json:"notes" db:"notes"`
	Items           []OrderItem `json:"items" db:"-"` // Relación cargada manualmente o por GORM si se usara
	CreatedAt       time.Time   `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time   `json:"updated_at" db:"updated_at"`
}

// OrderItem representa un producto dentro de un pedido
type OrderItem struct {
	ID          uint    `json:"id" db:"id"`
	OrderID     uint    `json:"order_id" db:"order_id"`
	ProductID   uint    `json:"product_id" db:"product_id"`
	ProductName string  `json:"product_name" db:"product_name"` // Snapshot del nombre
	Quantity    int     `json:"quantity" db:"quantity"`
	UnitPrice   float64 `json:"unit_price" db:"unit_price"` // Snapshot del precio
	Subtotal    float64 `json:"subtotal" db:"subtotal"`
}
