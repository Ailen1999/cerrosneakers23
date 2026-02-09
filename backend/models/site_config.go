package models

import "time"

// SiteConfig represents the global configuration for the store
type SiteConfig struct {
	ID                  uint      `json:"id"`
	StoreName           string    `json:"store_name"`
	Description         string    `json:"description"`
	LogoURL             string    `json:"logo_url"`
	WhatsAppNumber      string    `json:"whatsapp_number"`
	WhatsAppMessage     string    `json:"whatsapp_message"`
	CreditCardSurcharge float64   `json:"credit_card_surcharge"`
	LowStockThreshold   int       `json:"low_stock_threshold"`
	EnableStockAlerts   bool      `json:"enable_stock_alerts"`
	EnableOrderAlerts   bool      `json:"enable_order_alerts"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}
