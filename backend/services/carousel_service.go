package services

import (
	"tiendaedgar/backend/models"
	"tiendaedgar/backend/repositories"
)

// CarouselService maneja la lógica de negocio de carousel slides
type CarouselService struct {
	repo *repositories.CarouselRepository
}

// NewCarouselService crea una nueva instancia del servicio
func NewCarouselService() *CarouselService {
	return &CarouselService{
		repo: repositories.NewCarouselRepository(),
	}
}

// GetActiveSlides obtiene todos los slides activos ordenados por orden
func (s *CarouselService) GetActiveSlides() ([]models.CarouselSlide, error) {
	return s.repo.GetActiveSlides()
}

// CreateSlide crea un nuevo carousel slide
func (s *CarouselService) CreateSlide(slide *models.CarouselSlide) error {
	// Validar antes de crear
	if err := slide.ValidateCreate(); err != nil {
		return err
	}

	return s.repo.Create(slide)
}

// GetSlideByID obtiene un slide por ID
func (s *CarouselService) GetSlideByID(id uint) (*models.CarouselSlide, error) {
	return s.repo.GetByID(id)
}

// UpdateSlide actualiza un carousel slide
func (s *CarouselService) UpdateSlide(slide *models.CarouselSlide) error {
	// Validar antes de actualizar
	if err := slide.ValidateUpdate(); err != nil {
		return err
	}

	return s.repo.Update(slide)
}

// DeleteSlide elimina un carousel slide
func (s *CarouselService) DeleteSlide(id uint) error {
	return s.repo.Delete(id)
}
