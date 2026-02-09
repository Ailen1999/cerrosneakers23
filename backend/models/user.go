package models

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// User representa un usuario administrador del sistema
type User struct {
	ID           uint      `json:"id"`
	Username     string    `json:"username"`
	Email        *string   `json:"email"` // Nullable para usuarios existentes
	PasswordHash string    `json:"-"`     // "-" excluye el campo del JSON
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// HashPassword hashea la contraseña proporcionada usando bcrypt
func (u *User) HashPassword(password string) error {
	if password == "" {
		return errors.New("la contraseña no puede estar vacía")
	}

	// Generar hash con cost factor 10
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return err
	}

	u.PasswordHash = string(hashedPassword)
	return nil
}

// CheckPassword verifica si la contraseña proporcionada coincide con el hash almacenado
func (u *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
}

// Validate valida los datos del usuario antes de crear/actualizar
func (u *User) Validate() error {
	if u.Username == "" {
		return errors.New("el username es requerido")
	}

	if len(u.Username) < 3 {
		return errors.New("el username debe tener al menos 3 caracteres")
	}

	if u.PasswordHash == "" {
		return errors.New("la contraseña es requerida")
	}

	return nil
}

// UpdatePassword actualiza la contraseña del usuario
func (u *User) UpdatePassword(newPassword string) error {
	return u.HashPassword(newPassword)
}
