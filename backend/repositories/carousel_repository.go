package repositories

import (
	"database/sql"
	"fmt"
	"time"

	"tiendaedgar/backend/database"
	"tiendaedgar/backend/models"
)

// CarouselRepository maneja el acceso a datos de carousel slides
type CarouselRepository struct {
	db *sql.DB
}

// NewCarouselRepository crea una nueva instancia del repositorio
func NewCarouselRepository() *CarouselRepository {
	return &CarouselRepository{
		db: database.DB,
	}
}

// GetActiveSlides obtiene todos los slides activos ordenados por 'orden'
func (r *CarouselRepository) GetActiveSlides() ([]models.CarouselSlide, error) {
	query := `
		SELECT id, titulo, subtitulo, imagen_url, link_cta, producto_id, orden, activo, position_y, created_at, updated_at
		FROM carousel_slides
		WHERE activo = 1
		ORDER BY orden ASC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error al obtener slides: %w", err)
	}
	defer rows.Close()

	var slides []models.CarouselSlide

	for rows.Next() {
		var slide models.CarouselSlide
		var productoID sql.NullInt64
		var linkCTA sql.NullString
		var subtitulo sql.NullString

		err := rows.Scan(
			&slide.ID,
			&slide.Titulo,
			&subtitulo,
			&slide.ImagenURL,
			&linkCTA,
			&productoID,
			&slide.Orden,
			&slide.Activo,
			&slide.PositionY,
			&slide.CreatedAt,
			&slide.UpdatedAt,
		)

		if err != nil {
			return nil, fmt.Errorf("error al escanear slide: %w", err)
		}

		// Manejar campos nullable
		if subtitulo.Valid {
			slide.Subtitulo = subtitulo.String
		}
		if linkCTA.Valid {
			slide.LinkCTA = linkCTA.String
		}
		if productoID.Valid {
			id := uint(productoID.Int64)
			slide.ProductoID = &id
		}

		slides = append(slides, slide)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error al iterar slides: %w", err)
	}

	return slides, nil
}

// Create inserta un nuevo carousel slide en la base de datos
func (r *CarouselRepository) Create(slide *models.CarouselSlide) error {
	query := `
		INSERT INTO carousel_slides (titulo, subtitulo, imagen_url, link_cta, producto_id, orden, activo, position_y, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	now := time.Now()
	
	var productoID interface{}
	if slide.ProductoID != nil {
		productoID = *slide.ProductoID
	}

	result, err := r.db.Exec(
		query,
		slide.Titulo,
		slide.Subtitulo,
		slide.ImagenURL,
		slide.LinkCTA,
		productoID,
		slide.Orden,
		slide.Activo,
		slide.PositionY,
		now,
		now,
	)

	if err != nil {
		return fmt.Errorf("error al crear slide: %w", err)
	}

	// Obtener el ID generado
	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error al obtener ID: %w", err)
	}

	slide.ID = uint(id)
	slide.CreatedAt = now
	slide.UpdatedAt = now

	return nil
}

// GetByID obtiene un slide por su ID
func (r *CarouselRepository) GetByID(id uint) (*models.CarouselSlide, error) {
	query := `
		SELECT id, titulo, subtitulo, imagen_url, link_cta, producto_id, orden, activo, position_y, created_at, updated_at
		FROM carousel_slides
		WHERE id = ?
	`

	var slide models.CarouselSlide
	var productoID sql.NullInt64
	var linkCTA sql.NullString
	var subtitulo sql.NullString

	err := r.db.QueryRow(query, id).Scan(
		&slide.ID,
		&slide.Titulo,
		&subtitulo,
		&slide.ImagenURL,
		&linkCTA,
		&productoID,
		&slide.Orden,
		&slide.Activo,
		&slide.PositionY,
		&slide.CreatedAt,
		&slide.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil // Slide no encontrado
	}

	if err != nil {
		return nil, fmt.Errorf("error al obtener slide: %w", err)
	}

	// Manejar campos nullable
	if subtitulo.Valid {
		slide.Subtitulo = subtitulo.String
	}
	if linkCTA.Valid {
		slide.LinkCTA = linkCTA.String
	}
	if productoID.Valid {
		id := uint(productoID.Int64)
		slide.ProductoID = &id
	}

	return &slide, nil
}

// Update actualiza un slide completo
func (r *CarouselRepository) Update(slide *models.CarouselSlide) error {
	query := `
		UPDATE carousel_slides
		SET titulo = ?, subtitulo = ?, imagen_url = ?, link_cta = ?, producto_id = ?, orden = ?, activo = ?, position_y = ?, updated_at = ?
		WHERE id = ?
	`

	var productoID interface{}
	if slide.ProductoID != nil {
		productoID = *slide.ProductoID
	}

	result, err := r.db.Exec(
		query,
		slide.Titulo,
		slide.Subtitulo,
		slide.ImagenURL,
		slide.LinkCTA,
		productoID,
		slide.Orden,
		slide.Activo,
		slide.PositionY,
		time.Now(),
		slide.ID,
	)

	if err != nil {
		return fmt.Errorf("error al actualizar slide: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error al verificar actualización: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("slide no encontrado")
	}

	return nil
}

// Delete elimina un slide por su ID
func (r *CarouselRepository) Delete(id uint) error {
	query := "DELETE FROM carousel_slides WHERE id = ?"

	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("error al eliminar slide: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error al verificar eliminación: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("slide no encontrado")
	}

	return nil
}
