package services

import (
	"tiendaedgar/backend/database"
	"tiendaedgar/backend/models"
	"tiendaedgar/backend/repositories"
)

type ConfigService struct {
	repo *repositories.ConfigRepository
}

func NewConfigService() *ConfigService {
	return &ConfigService{
		repo: repositories.NewConfigRepository(database.DB),
	}
}

func (s *ConfigService) GetConfig() (*models.SiteConfig, error) {
	return s.repo.GetConfig()
}

func (s *ConfigService) UpdateConfig(config *models.SiteConfig) error {
	// Add potential validation logic here (e.g. valid phone number format)
	return s.repo.UpdateConfig(config)
}
