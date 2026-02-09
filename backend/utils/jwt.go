package utils

import (
	"crypto/rand"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Claims define la estructura de los claims del JWT
type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// getJWTSecret obtiene el secreto JWT de las variables de entorno
func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		// Fallback para desarrollo - NO USAR EN PRODUCCIÓN
		secret = "default-secret-key-change-in-production"
	}
	return []byte(secret)
}

// GenerateToken genera un nuevo token JWT para el usuario
func GenerateToken(userID uint, username string) (string, error) {
	// Token expira en 8 horas
	expirationTime := time.Now().Add(8 * time.Hour)

	// Crear los claims
	claims := &Claims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "tienda-edgar",
		},
	}

	// Crear el token con el algoritmo de firma HS256
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Firmar el token con el secreto
	tokenString, err := token.SignedString(getJWTSecret())
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateToken valida un token JWT y retorna los claims si es válido
func ValidateToken(tokenString string) (*Claims, error) {
	// Parsear el token
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Verificar que el método de firma sea HMAC
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("método de firma inválido")
		}
		return getJWTSecret(), nil
	})

	if err != nil {
		return nil, err
	}

	// Verificar que el token sea válido
	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("token inválido")
}

// GenerateSecureToken genera un token seguro aleatorio para password reset
func GenerateSecureToken() (string, error) {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	const tokenLength = 64
	
	token := make([]byte, tokenLength)
	for i := range token {
		randomByte := make([]byte, 1)
		if _, err := rand.Read(randomByte); err != nil {
			return "", err
		}
		token[i] = charset[int(randomByte[0])%len(charset)]
	}
	
	return string(token), nil
}
