package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

type Product struct {
	ID   int
	Name string
}

func main() {
	// Adjust path if needed. Assuming running from backend/
	db, err := sql.Open("sqlite", "./catalog.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 1. List all products
	rows, err := db.Query("SELECT id, nombre FROM products")
	if err != nil {
		log.Fatalf("Error listing products: %v", err)
	}
	defer rows.Close()

	var ids []int
	fmt.Println("--- Existing Products ---")
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("ID: %d, Name: %s\n", p.ID, p.Name)
		ids = append(ids, p.ID)
	}
	fmt.Println("-------------------------")

	// 2. Query GetByID individually
	for _, id := range ids {
		var name string
		// Emulate repository query
		query := `SELECT nombre FROM products WHERE id = ?`
		err := db.QueryRow(query, id).Scan(&name)
		if err != nil {
			fmt.Printf("[FAIL] GetByID(%d): %v\n", id, err)
		} else {
			fmt.Printf("[OK] GetByID(%d) -> %s\n", id, name)
		}
	}
}
