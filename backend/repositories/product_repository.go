package repositories

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"tiendaedgar/backend/models"
)

// ProductRepository maneja el acceso a datos de productos
type ProductRepository struct {
	db *sql.DB
}

// NewProductRepository crea una nueva instancia del repositorio
func NewProductRepository(db *sql.DB) *ProductRepository {
	return &ProductRepository{
		db: db,
	}
}

// Create inserta un nuevo producto en la base de datos
func (r *ProductRepository) Create(product *models.Product) error {
	// Convertir arrays a JSON strings para SQLite
	tallasJSON, err := json.Marshal(product.Tallas)
	if err != nil {
		return fmt.Errorf("error al serializar tallas: %w", err)
	}

	coloresJSON, err := json.Marshal(product.Colores)
	if err != nil {
		return fmt.Errorf("error al serializar colores: %w", err)
	}

	imagenesJSON, err := json.Marshal(product.Imagenes)
	if err != nil {
		return fmt.Errorf("error al serializar imagenes: %w", err)
	}

	stockBySizeJSON, err := json.Marshal(product.StockBySize)
	if err != nil {
		return fmt.Errorf("error al serializar stock_by_size: %w", err)
	}

	query := `
		INSERT INTO products (nombre, descripcion, categoria, genero, temporada, precio, precio_lista, stock, stock_by_size, tallas, colores, imagenes, activo, destacado, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	now := time.Now()
	result, err := r.db.Exec(
		query,
		product.Nombre,
		product.Descripcion,
		product.Categoria,
		product.Genero,
		product.Temporada,
		product.Precio,
		product.PrecioLista,
		product.Stock,
		string(stockBySizeJSON),
		string(tallasJSON),
		string(coloresJSON),
		string(imagenesJSON),
		product.Activo,
		product.Destacado,
		now,
		now,
	)

	if err != nil {
		return fmt.Errorf("error al crear producto: %w", err)
	}

	// Obtener el ID generado
	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error al obtener ID: %w", err)
	}

	product.ID = uint(id)
	product.CreatedAt = now
	product.UpdatedAt = now

	return nil
}

// GetAll obtiene todos los productos con paginación y filtros opcionales
func (r *ProductRepository) GetAll(limit, offset int, categories, genders, sizes, temporadas []string, search, sort string) ([]models.Product, int, error) {
	var products []models.Product
	var totalCount int

	// Construir query base
	baseQuery := "FROM products WHERE 1=1"
	args := []interface{}{}

	// Agregar filtros
	if len(categories) > 0 {
		baseQuery += " AND LOWER(categoria) IN ("
		for i, cat := range categories {
			if i > 0 {
				baseQuery += ", "
			}
			baseQuery += "?"
			args = append(args, strings.ToLower(cat))
		}
		baseQuery += ")"
	}

	if len(genders) > 0 {
		baseQuery += " AND LOWER(genero) IN ("
		for i, gen := range genders {
			if i > 0 {
				baseQuery += ", "
			}
			baseQuery += "?"
			args = append(args, strings.ToLower(gen))
		}
		baseQuery += ")"
	}

	if len(sizes) > 0 {
		baseQuery += " AND ("
		for i, size := range sizes {
			if i > 0 {
				baseQuery += " OR "
			}
			baseQuery += "tallas LIKE ?"
			args = append(args, `%"`+size+`"%`)
		}
		baseQuery += ")"
	}

	if len(temporadas) > 0 {
		baseQuery += " AND LOWER(temporada) IN ("
		for i, temp := range temporadas {
			if i > 0 {
				baseQuery += ", "
			}
			baseQuery += "?"
			args = append(args, strings.ToLower(temp))
		}
		baseQuery += ")"
	}

	if search != "" {
		baseQuery += " AND (LOWER(nombre) LIKE ? OR LOWER(descripcion) LIKE ?)"
		searchTerm := "%" + strings.ToLower(search) + "%"
		args = append(args, searchTerm, searchTerm)
	}

	// Obtener total count
	countQuery := "SELECT COUNT(*) " + baseQuery
	err := r.db.QueryRow(countQuery, args...).Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("error al contar productos: %w", err)
	}

	// Determinar ordenamiento
	orderBy := "created_at DESC" // Default: Newest
	switch sort {
	case "price_asc":
		orderBy = "precio ASC"
	case "price_desc":
		orderBy = "precio DESC"
	case "newest":
		orderBy = "created_at DESC"
	}

	// Obtener productos con paginación
	query := "SELECT id, nombre, descripcion, categoria, genero, temporada, precio, precio_lista, stock, stock_by_size, tallas, colores, imagenes, activo, destacado, created_at, updated_at " + baseQuery + " ORDER BY " + orderBy + " LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("error al obtener productos: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var product models.Product
		var descripcion, genero, temporada sql.NullString
		var tallasJSON, coloresJSON, imagenesJSON, stockBySizeJSON sql.NullString

		err := rows.Scan(
			&product.ID,
			&product.Nombre,
			&descripcion,
			&product.Categoria,
			&genero,
			&temporada,
			&product.Precio,
			&product.PrecioLista,
			&product.Stock,
			&stockBySizeJSON,
			&tallasJSON,
			&coloresJSON,
			&imagenesJSON,
			&product.Activo,
			&product.Destacado,
			&product.CreatedAt,
			&product.UpdatedAt,
		)

		if err != nil {
			return nil, 0, fmt.Errorf("error al escanear producto: %w", err)
		}

		// Handle NullString values
		if descripcion.Valid {
			product.Descripcion = descripcion.String
		}
		if genero.Valid {
			product.Genero = genero.String
		}
		if temporada.Valid {
			product.Temporada = temporada.String
		}

		// Deserializar JSON strings a arrays
		if tallasJSON.Valid && tallasJSON.String != "" {
			json.Unmarshal([]byte(tallasJSON.String), &product.Tallas)
		}
		if coloresJSON.Valid && coloresJSON.String != "" {
			json.Unmarshal([]byte(coloresJSON.String), &product.Colores)
		}
		if imagenesJSON.Valid && imagenesJSON.String != "" {
			json.Unmarshal([]byte(imagenesJSON.String), &product.Imagenes)
		}
		if stockBySizeJSON.Valid && stockBySizeJSON.String != "" {
			json.Unmarshal([]byte(stockBySizeJSON.String), &product.StockBySize)
		}

		products = append(products, product)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, fmt.Errorf("error al iterar productos: %w", err)
	}

	return products, totalCount, nil
}

// GetByID obtiene un producto por su ID
func (r *ProductRepository) GetByID(id uint) (*models.Product, error) {
	query := `
		SELECT id, nombre, descripcion, categoria, genero, temporada, precio, precio_lista, stock, stock_by_size, tallas, colores, imagenes, activo, destacado, created_at, updated_at
		FROM products
		WHERE id = ?
	`

	var product models.Product
	var descripcion, genero, temporada sql.NullString
	var tallasJSON, coloresJSON, imagenesJSON, stockBySizeJSON sql.NullString

	err := r.db.QueryRow(query, id).Scan(
		&product.ID,
		&product.Nombre,
		&descripcion,
		&product.Categoria,
		&genero,
		&temporada,
		&product.Precio,
		&product.PrecioLista,
		&product.Stock,
		&stockBySizeJSON,
		&tallasJSON,
		&coloresJSON,
		&imagenesJSON,
		&product.Activo,
		&product.Destacado,
		&product.CreatedAt,
		&product.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil // Producto no encontrado
	}

	if err != nil {
		return nil, fmt.Errorf("error al obtener producto: %w", err)
	}

	// Handle NullString values
	if descripcion.Valid {
		product.Descripcion = descripcion.String
	}
	if genero.Valid {
		product. Genero = genero.String
	}
	if temporada.Valid {
		product.Temporada = temporada.String
	}

	// Deserializar JSON strings a arrays
	if tallasJSON.Valid && tallasJSON.String != "" {
		json.Unmarshal([]byte(tallasJSON.String), &product.Tallas)
	}
	if coloresJSON.Valid && coloresJSON.String != "" {
		json.Unmarshal([]byte(coloresJSON.String), &product.Colores)
	}
	if imagenesJSON.Valid && imagenesJSON.String != "" {
		json.Unmarshal([]byte(imagenesJSON.String), &product.Imagenes)
	}
	if stockBySizeJSON.Valid && stockBySizeJSON.String != "" {
		json.Unmarshal([]byte(stockBySizeJSON.String), &product.StockBySize)
	}

	return &product, nil
}

// Update actualiza un producto completo
func (r *ProductRepository) Update(product *models.Product) error {
	// Convertir arrays a JSON strings
	tallasJSON, _ := json.Marshal(product.Tallas)
	coloresJSON, _ := json.Marshal(product.Colores)
	imagenesJSON, _ := json.Marshal(product.Imagenes)
	stockBySizeJSON, _ := json.Marshal(product.StockBySize)

	query := `
		UPDATE products
		SET nombre = ?, descripcion = ?, categoria = ?, genero = ?, temporada = ?, precio = ?, precio_lista = ?, stock = ?, stock_by_size = ?,
		    tallas = ?, colores = ?, imagenes = ?, activo = ?, destacado = ?,
		    updated_at = ?
		WHERE id = ?
	`

	result, err := r.db.Exec(
		query,
		product.Nombre,
		product.Descripcion,
		product.Categoria,
		product.Genero,
		product.Temporada,
		product.Precio,
		product.PrecioLista,
		product.Stock,
		string(stockBySizeJSON),
		string(tallasJSON),
		string(coloresJSON),
		string(imagenesJSON),
		product.Activo,
		product.Destacado,
		time.Now(),
		product.ID,
	)

	if err != nil {
		return fmt.Errorf("error al actualizar producto: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error al verificar actualización: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("producto no encontrado")
	}

	return nil
}

// PartialUpdate actualiza campos específicos de un producto
func (r *ProductRepository) PartialUpdate(id uint, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return fmt.Errorf("no hay campos para actualizar")
	}

	// Construir query dinámicamente
	query := "UPDATE products SET "
	args := []interface{}{}

	first := true
	for field, value := range updates {
		if !first {
			query += ", "
		}
		query += field + " = ?"
		args = append(args, value)
		first = false
	}

	// Siempre actualizar updated_at
	query += ", updated_at = ?"
	args = append(args, time.Now())

	query += " WHERE id = ?"
	args = append(args, id)

	result, err := r.db.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("error al actualizar producto: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error al verificar actualización: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("producto no encontrado")
	}

	return nil
}

// Delete elimina un producto por su ID
func (r *ProductRepository) Delete(id uint) error {
	query := "DELETE FROM products WHERE id = ?"

	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("error al eliminar producto: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error al verificar eliminación: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("producto no encontrado")
	}

	return nil
}

// BulkDelete elimina múltiples productos por sus IDs
func (r *ProductRepository) BulkDelete(ids []uint) error {
	if len(ids) == 0 {
		return nil
	}

	// Construir la query con placeholders (?, ?, ...)
	query := "DELETE FROM products WHERE id IN ("
	args := make([]interface{}, len(ids))
	for i, id := range ids {
		if i > 0 {
			query += ", "
		}
		query += "?"
		args[i] = id
	}
	query += ")"

	result, err := r.db.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("error al eliminar productos en masa: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error al verificar eliminación masiva: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no se encontraron productos para eliminar")
	}

	return nil
}

// UpdateStock actualiza el stock de un producto
func (r *ProductRepository) UpdateStock(id uint, newStock int) error {
	query := "UPDATE products SET stock = ?, updated_at = ? WHERE id = ?"
	_, err := r.db.Exec(query, newStock, time.Now(), id)
	return err
}

// ReduceStock reduce el stock de un producto de manera atómica
func (r *ProductRepository) ReduceStock(id uint, quantity int) error {
	query := `
		UPDATE products 
		SET stock = stock - ?, updated_at = ? 
		WHERE id = ? AND stock >= ?
	`
	result, err := r.db.Exec(query, quantity, time.Now(), id, quantity)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return fmt.Errorf("stock insuficiente o producto no encontrado para ID %d", id)
	}

	return nil
}

// IncreaseStock incrementa el stock de un producto (atomicamente)
func (r *ProductRepository) IncreaseStock(id uint, quantity int) error {
	query := `
		UPDATE products 
		SET stock = stock + ?, updated_at = ? 
		WHERE id = ?
	`
	result, err := r.db.Exec(query, quantity, time.Now(), id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return fmt.Errorf("producto no encontrado para ID %d", id)
	}

	return nil
}
