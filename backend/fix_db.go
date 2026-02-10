//go:build ignore

package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "./tienda.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Update all orders to have a valid timestamp (Time.Now formatted by Go driver)
	// This overwrites the "bad" timestamps that crash the Scan
	// Also ensuring updated_at is set.
	now := time.Now()
	_, err = db.Exec("UPDATE orders SET created_at = ?, updated_at = ?", now, now)
	if err != nil {
		log.Fatal("Error updating orders:", err)
	}
	fmt.Println("Successfully fixed timestamps for all orders")
}
