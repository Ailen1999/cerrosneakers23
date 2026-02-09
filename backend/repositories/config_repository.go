package repositories

import (
	"database/sql"
	"fmt"
	"tiendaedgar/backend/models"
)

type ConfigRepository struct {
	db *sql.DB
}

func NewConfigRepository(db *sql.DB) *ConfigRepository {
	return &ConfigRepository{
		db: db,
	}
}

// GetConfig returns the singleton configuration, creating it if it doesn't exist
func (r *ConfigRepository) GetConfig() (*models.SiteConfig, error) {
	query := `
		SELECT id, store_name, description, logo_url, whatsapp_number, whatsapp_message, 
		       credit_card_surcharge, low_stock_threshold, enable_stock_alerts, enable_order_alerts, 
		       created_at, updated_at
		FROM site_configs
		LIMIT 1
	`
	
	var config models.SiteConfig
	err := r.db.QueryRow(query).Scan(
		&config.ID, &config.StoreName, &config.Description, &config.LogoURL, 
		&config.WhatsAppNumber, &config.WhatsAppMessage, &config.CreditCardSurcharge, 
		&config.LowStockThreshold, &config.EnableStockAlerts, &config.EnableOrderAlerts,
		&config.CreatedAt, &config.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		// Create default config
		return r.createDefaultConfig()
	} else if err != nil {
		return nil, fmt.Errorf("error al obtener configuración: %w", err)
	}

	return &config, nil
}

func (r *ConfigRepository) createDefaultConfig() (*models.SiteConfig, error) {
	query := `
		INSERT INTO site_configs (store_name, description, logo_url, whatsapp_number, whatsapp_message, 
			credit_card_surcharge, low_stock_threshold, enable_stock_alerts, enable_order_alerts)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		RETURNING id, created_at, updated_at
	`
	
	defaultConfig := models.SiteConfig{
		StoreName:           "Cerro Sneakers",
		Description:         "Especialistas en sneakers de edición limitada y calzado premium.",
		LogoURL:             "",
		WhatsAppNumber:      "5491134567890",
		WhatsAppMessage:     "Hola! Me interesa este producto...",
		CreditCardSurcharge: 15.0,
		LowStockThreshold:   5,
		EnableStockAlerts:   true,
		EnableOrderAlerts:   true,
	}

	err := r.db.QueryRow(query, 
		defaultConfig.StoreName, defaultConfig.Description, defaultConfig.LogoURL,
		defaultConfig.WhatsAppNumber, defaultConfig.WhatsAppMessage, defaultConfig.CreditCardSurcharge,
		defaultConfig.LowStockThreshold, defaultConfig.EnableStockAlerts, defaultConfig.EnableOrderAlerts,
	).Scan(&defaultConfig.ID, &defaultConfig.CreatedAt, &defaultConfig.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("error al crear configuración por defecto: %w", err)
	}

	return &defaultConfig, nil
}

func (r *ConfigRepository) UpdateConfig(config *models.SiteConfig) error {
	query := `
		UPDATE site_configs 
		SET store_name = ?, description = ?, logo_url = ?, whatsapp_number = ?, whatsapp_message = ?, 
			credit_card_surcharge = ?, low_stock_threshold = ?, enable_stock_alerts = ?, enable_order_alerts = ?,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`
	
	_, err := r.db.Exec(query, 
		config.StoreName, config.Description, config.LogoURL, config.WhatsAppNumber, config.WhatsAppMessage,
		config.CreditCardSurcharge, config.LowStockThreshold, config.EnableStockAlerts, config.EnableOrderAlerts,
		config.ID,
	)
	
	if err != nil {
		return fmt.Errorf("error al actualizar configuración: %w", err)
	}
	
	return nil
}
