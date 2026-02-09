package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "tiendaedgar.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	newLogoURL := "http://localhost:8080/uploads/cerro_logo_high_res.png"
	
	result, err := db.Exec("UPDATE site_configs SET logo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1", newLogoURL)
	if err != nil {
		log.Fatal(err)
	}

	rows, _ := result.RowsAffected()
	fmt.Printf("Filas actualizadas: %d\n", rows)
	
	if rows == 0 {
		// Probablemente no hay fila con id=1, intentar insertar si la tabla existe pero está vacía
		_, err = db.Exec("INSERT INTO site_configs (id, logo_url) VALUES (1, ?)", newLogoURL)
		if err != nil {
			fmt.Println("Error al insertar config inicial:", err)
		} else {
			fmt.Println("Configuración inicial creada con el nuevo logo.")
		}
	} else {
		fmt.Println("URL del logo actualizada correctamente en la base de datos.")
	}
}
