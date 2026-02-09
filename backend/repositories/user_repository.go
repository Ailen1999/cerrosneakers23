package repositories

import (
	"database/sql"
	"errors"

	"tiendaedgar/backend/models"
)

// UserRepository maneja las operaciones de base de datos para usuarios
type UserRepository struct {
	db *sql.DB
}

// NewUserRepository crea una nueva instancia de UserRepository
func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// FindByUsername busca un usuario por su username
func (r *UserRepository) FindByUsername(username string) (*models.User, error) {
	query := `
		SELECT id, username, email, password_hash, created_at, updated_at
		FROM users
		WHERE username = ? AND deleted_at IS NULL
	`

	user := &models.User{}
	var email sql.NullString
	err := r.db.QueryRow(query, username).Scan(
		&user.ID,
		&user.Username,
		&email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("usuario no encontrado")
	}

	if err != nil {
		return nil, err
	}

	if email.Valid {
		user.Email = &email.String
	}

	return user, nil
}

// Create crea un nuevo usuario en la base de datos
func (r *UserRepository) Create(user *models.User) error {
	// Validar usuario
	if err := user.Validate(); err != nil {
		return err
	}

	query := `
		INSERT INTO users (username, password_hash, created_at, updated_at)
		VALUES (?, ?, datetime('now'), datetime('now'))
	`

	result, err := r.db.Exec(query, user.Username, user.PasswordHash)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	user.ID = uint(id)
	return nil
}

// FindByID busca un usuario por su ID
func (r *UserRepository) FindByID(id uint) (*models.User, error) {
	query := `
		SELECT id, username, email, password_hash, created_at, updated_at
		FROM users
		WHERE id = ? AND deleted_at IS NULL
	`

	user := &models.User{}
	var email sql.NullString
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Username,
		&email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("usuario no encontrado")
	}

	if err != nil {
		return nil, err
	}

	if email.Valid {
		user.Email = &email.String
	}

	return user, nil
}

// FindByEmail busca un usuario por su email
func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, username, email, password_hash, created_at, updated_at
		FROM users
		WHERE email = ? AND deleted_at IS NULL
	`

	user := &models.User{}
	var emailStr sql.NullString
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Username,
		&emailStr,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("usuario no encontrado")
	}

	if err != nil {
		return nil, err
	}

	if emailStr.Valid {
		user.Email = &emailStr.String
	}

	return user, nil
}

// UpdatePassword actualiza la contraseña de un usuario
func (r *UserRepository) UpdatePassword(userID uint, passwordHash string) error {
	query := `
		UPDATE users 
		SET password_hash = ?, updated_at = datetime('now')
		WHERE id = ? AND deleted_at IS NULL
	`

	result, err := r.db.Exec(query, passwordHash, userID)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return errors.New("usuario no encontrado")
	}

	return nil
}

// UpdateEmail actualiza el email de un usuario
func (r *UserRepository) UpdateEmail(userID uint, email string) error {
	query := `
		UPDATE users 
		SET email = ?, updated_at = datetime('now')
		WHERE id = ? AND deleted_at IS NULL
	`

	result, err := r.db.Exec(query, email, userID)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return errors.New("usuario no encontrado")
	}

	return nil
}
