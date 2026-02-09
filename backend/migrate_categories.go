package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	// Open the catalog.db as identified previously
	db, err := sql.Open("sqlite", "./catalog.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Update 'ropa' to 'indumentaria'
	result, err := db.Exec("UPDATE products SET categoria = 'indumentaria' WHERE categoria = 'ropa'")
	if err != nil {
		log.Fatalf("Error updating categories: %v", err)
	}

	rowsAffected, _ := result.RowsAffected()
	fmt.Printf("Successfully migrated %d products from 'ropa' to 'indumentaria'\n", rowsAffected)
}
