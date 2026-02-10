package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

// InitDB inicializa la conexión a la base de datos SQLite
func InitDB(dbPath string) error {
	var err error
	DB, err = sql.Open("sqlite", dbPath)
	if err != nil {
		return fmt.Errorf("error al abrir la base de datos: %w", err)
	}

	// Verificar la conexión
	if err = DB.Ping(); err != nil {
		return fmt.Errorf("error al conectar con la base de datos: %w", err)
	}

	log.Println("Conexión a base de datos SQLite establecida")

	// Optimizaciones para producción
	DB.Exec("PRAGMA journal_mode=WAL")
	DB.Exec("PRAGMA synchronous=NORMAL")
	DB.Exec("PRAGMA busy_timeout=5000")
	DB.Exec("PRAGMA foreign_keys=ON")

	// Connection pool para SQLite (single-writer)
	DB.SetMaxOpenConns(1)
	DB.SetMaxIdleConns(1)
	DB.SetConnMaxLifetime(0)

	log.Println("PRAGMAs de producción configurados (WAL, foreign_keys, busy_timeout)")

	// Ejecutar migraciones
	if err = RunMigrations(); err != nil {
		return fmt.Errorf("error al ejecutar migraciones: %w", err)
	}

	return nil
}

// CloseDB cierra la conexión a la base de datos
func CloseDB() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}
