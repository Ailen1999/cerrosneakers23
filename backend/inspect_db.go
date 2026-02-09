package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "./catalog.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	fmt.Println("--- UNIQUE CATEGORIES ---")
	rows, err := db.Query("SELECT DISTINCT categoria FROM products")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var cat string
		rows.Scan(&cat)
		fmt.Printf("'%s'\n", cat)
	}

	fmt.Println("\n--- UNIQUE GENDERS ---")
	rows, err = db.Query("SELECT DISTINCT genero FROM products")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var gen string
		rows.Scan(&gen)
		fmt.Printf("'%s'\n", gen)
	}
	fmt.Println("\n--- PRODUCT COUNTS ---")
	// Count for Calzado + Mujer
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM products WHERE LOWER(categoria) = 'calzado' AND LOWER(genero) = 'mujer'").Scan(&count)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Calzado + Mujer: %d\n", count)

	// Count for Indumentaria + Hombre
	err = db.QueryRow("SELECT COUNT(*) FROM products WHERE LOWER(categoria) = 'indumentaria' AND LOWER(genero) = 'hombre'").Scan(&count)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Indumentaria + Hombre: %d\n", count)
}
