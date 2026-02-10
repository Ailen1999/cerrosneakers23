package database

import (
	"database/sql"
	"fmt"
	"log"
)

// RunMigrations ejecuta las migraciones de la base de datos
func RunMigrations() error {
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS products (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		nombre TEXT NOT NULL,
		descripcion TEXT,
		categoria TEXT NOT NULL,
		precio REAL NOT NULL CHECK(precio > 0),
		precio_lista REAL DEFAULT 0,
		genero TEXT DEFAULT 'unisex',
		temporada TEXT DEFAULT '',
		stock INTEGER NOT NULL DEFAULT 0,
		stock_by_size TEXT,
		tallas TEXT,
		colores TEXT,
		imagenes TEXT,
		activo BOOLEAN NOT NULL DEFAULT 1,
		destacado BOOLEAN NOT NULL DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`

	_, err := DB.Exec(createTableSQL)
	if err != nil {
		return err
	}

	log.Println("Tabla products creada o ya existe")

	// Crear índices para optimizar búsquedas
	indexCategorySQL := `CREATE INDEX IF NOT EXISTS idx_products_categoria ON products(categoria);`
	_, err = DB.Exec(indexCategorySQL)
	if err != nil {
		return err
	}

	indexPriceSQL := `CREATE INDEX IF NOT EXISTS idx_products_precio ON products(precio);`
	_, err = DB.Exec(indexPriceSQL)
	if err != nil {
		return err
	}

	indexActivoSQL := `CREATE INDEX IF NOT EXISTS idx_products_activo ON products(activo);`
	_, err = DB.Exec(indexActivoSQL)
	if err != nil {
		return err
	}

	// Índices adicionales para filtros
	DB.Exec(`CREATE INDEX IF NOT EXISTS idx_products_genero ON products(genero)`)
	DB.Exec(`CREATE INDEX IF NOT EXISTS idx_products_temporada ON products(temporada)`)
	DB.Exec(`CREATE INDEX IF NOT EXISTS idx_products_destacado ON products(destacado)`)

	log.Println("Índices de products creados correctamente")

	// Ensure precio_lista column exists
	// Note: SQLite doesn't support IF NOT EXISTS for ADD COLUMN in older versions,
	// but we can check if it exists or just try and ignore error.
	// For simplicity in this dev environment, we'll try to add it.
	// In a robust migration system, we would check pragma table_info.
	// Ensure precio_lista column exists
	if err := AddColumnIfNotExists("products", "precio_lista", "REAL DEFAULT 0"); err != nil {
		log.Printf("Nota: Columna precio_lista probablemente ya existe o error: %v", err)
	}

	if err := AddColumnIfNotExists("products", "genero", "TEXT DEFAULT 'unisex'"); err != nil {
		log.Printf("Nota: Columna genero probablemente ya existe o error: %v", err)
	}

	if err := AddColumnIfNotExists("products", "stock_by_size", "TEXT"); err != nil {
		log.Printf("Nota: Columna stock_by_size probablemente ya existe o error: %v", err)
	}

	if err := AddColumnIfNotExists("products", "temporada", "TEXT DEFAULT ''"); err != nil {
		log.Printf("Nota: Columna temporada probablemente ya existe o error: %v", err)
	}

	// Actualizar precios de lista solo para productos que no tienen uno configurado
	updatePricesSQL := `UPDATE products SET precio_lista = precio * 1.2 WHERE precio_lista IS NULL;`
	_, err = DB.Exec(updatePricesSQL)
	if err != nil {
		log.Println("Error actualizando precios de lista: ", err)
	}

	// Crear tabla carousel_slides
	createCarouselTableSQL := `
	CREATE TABLE IF NOT EXISTS carousel_slides (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		titulo TEXT NOT NULL,
		subtitulo TEXT,
		imagen_url TEXT NOT NULL,
		link_cta TEXT,
		producto_id INTEGER,
		orden INTEGER NOT NULL DEFAULT 0,
		activo BOOLEAN NOT NULL DEFAULT 1,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (producto_id) REFERENCES products(id) ON DELETE SET NULL
	);
	`

	_, err = DB.Exec(createCarouselTableSQL)
	if err != nil {
		return err
	}

	log.Println("Tabla carousel_slides creada o ya existe")

	if err := AddColumnIfNotExists("carousel_slides", "position_y", "INTEGER DEFAULT 50"); err != nil {
		log.Printf("Nota: Columna position_y probablemente ya existe o error: %v", err)
	}

	// Crear índices para carousel_slides
	indexCarouselActivoSQL := `CREATE INDEX IF NOT EXISTS idx_carousel_activo ON carousel_slides(activo);`
	_, err = DB.Exec(indexCarouselActivoSQL)
	if err != nil {
		return err
	}

	indexCarouselOrdenSQL := `CREATE INDEX IF NOT EXISTS idx_carousel_orden ON carousel_slides(orden);`
	_, err = DB.Exec(indexCarouselOrdenSQL)
	if err != nil {
		return err
	}

	log.Println("Índices de carousel_slides creados correctamente")

	// Crear tabla users para autenticación
	createUsersTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		deleted_at DATETIME
	);
	`

	_, err = DB.Exec(createUsersTableSQL)
	if err != nil {
		return err
	}

	log.Println("Tabla users creada o ya existe")

	// Crear índice único en username
	indexUsernameSQL := `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);`
	_, err = DB.Exec(indexUsernameSQL)
	if err != nil {
		return err
	}

	log.Println("Índice de users creado correctamente")

	// Índice para búsqueda por email
	DB.Exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`)

	// Agregar columna email a users si no existe
	if err := AddColumnIfNotExists("users", "email", "TEXT"); err != nil {
		log.Printf("Nota: Columna email probablemente ya existe o error: %v", err)
	}

	// Crear usuario admin por defecto si no existe
	// Nota: La contraseña por defecto es "admin123" (debe cambiarse en producción)
	// Hash bcrypt de "admin123" con cost 10 (Generado verificado: 2026-01-27)
	defaultAdminPasswordHash := "$2a$10$q1Kk2UkXVQG8shc2oc8hD.2zvy.LIP9/33o9KkSnmsG3RngmHr9fS"

	checkAdminSQL := `SELECT COUNT(*) FROM users WHERE username = 'admin'`
	var count int
	err = DB.QueryRow(checkAdminSQL).Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		insertAdminSQL := `INSERT INTO users (username, password_hash) VALUES (?, ?)`
		_, err = DB.Exec(insertAdminSQL, "admin", defaultAdminPasswordHash)
		if err != nil {
			return err
		}
		log.Println("Usuario admin por defecto creado (username: admin, password: admin123)")
	} else {
		// Actualizar la contraseña por si acaso está rota/vieja
		updateAdminSQL := `UPDATE users SET password_hash = ? WHERE username = 'admin'`
		_, err = DB.Exec(updateAdminSQL, defaultAdminPasswordHash)
		if err != nil {
			return err
		}
		log.Println("Usuario admin ya existe. Contraseña reseteada a: admin123")
	}

	// Crear tabla orders
	createOrdersTableSQL := `
	CREATE TABLE IF NOT EXISTS orders (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		customer_name TEXT NOT NULL,
		customer_email TEXT,
		customer_phone TEXT,
		customer_address TEXT,
		total_amount REAL NOT NULL DEFAULT 0,
		status TEXT NOT NULL DEFAULT 'Pendiente',
		notes TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err = DB.Exec(createOrdersTableSQL)
	if err != nil {
		return err
	}
	log.Println("Tabla orders creada o ya existe")

	// Crear tabla order_items
	createOrderItemsTableSQL := `
	CREATE TABLE IF NOT EXISTS order_items (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		order_id INTEGER NOT NULL,
		product_id INTEGER,
		product_name TEXT NOT NULL,
		quantity INTEGER NOT NULL,
		unit_price REAL NOT NULL,
		subtotal REAL NOT NULL,
		FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
		FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
	);
	`
	_, err = DB.Exec(createOrderItemsTableSQL)
	if err != nil {
		return err
	}
	log.Println("Tabla order_items creada o ya existe")

	// Índices para orders
	indexOrderStatusSQL := `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`
	_, err = DB.Exec(indexOrderStatusSQL)
	if err != nil {
		return err
	}
	indexOrderCreatedSQL := `CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);`
	_, err = DB.Exec(indexOrderCreatedSQL)
	if err != nil {
		return err
	}
	log.Println("Índices de orders creados correctamente")

	// Índices para order_items (FK sin índice)
	DB.Exec(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`)
	DB.Exec(`CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id)`)
	log.Println("Índices de order_items creados correctamente")

	// Crear tabla site_configs
	createSiteConfigsTableSQL := `
	CREATE TABLE IF NOT EXISTS site_configs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		store_name TEXT NOT NULL DEFAULT 'Cerro Sneakers',
		description TEXT,
		logo_url TEXT,
		whatsapp_number TEXT NOT NULL DEFAULT '5491134567890',
		whatsapp_message TEXT NOT NULL DEFAULT 'Hola! Me interesa este producto...',
		credit_card_surcharge REAL NOT NULL DEFAULT 15.0,
		low_stock_threshold INTEGER NOT NULL DEFAULT 5,
		enable_stock_alerts BOOLEAN NOT NULL DEFAULT 1,
		enable_order_alerts BOOLEAN NOT NULL DEFAULT 1,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err = DB.Exec(createSiteConfigsTableSQL)
	if err != nil {
		return err
	}
	log.Println("Tabla site_configs creada o ya existe")

	return nil
}

// AddColumnIfNotExists agrega una columna a una tabla si no existe
func AddColumnIfNotExists(tableName, columnName, columnDef string) error {
	// Verificar si la columna existe (SQLite-specific)
	query := fmt.Sprintf("PRAGMA table_info(%s)", tableName)
	rows, err := DB.Query(query)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var cid int
		var name, ctype string
		var notnull, pk int
		var dfltValue sql.NullString
		if err := rows.Scan(&cid, &name, &ctype, &notnull, &dfltValue, &pk); err != nil {
			return err
		}
		if name == columnName {
			return nil // Columna ya existe
		}
	}

	// Si llegamos aquí, la columna no existe
	alterSQL := fmt.Sprintf("ALTER TABLE %s ADD COLUMN %s %s", tableName, columnName, columnDef)
	_, err = DB.Exec(alterSQL)
	if err != nil {
		return fmt.Errorf("error adding column %s to %s: %v", columnName, tableName, err)
	}

	log.Printf("Columna %s agregada a tabla %s", columnName, tableName)
	return nil
}
