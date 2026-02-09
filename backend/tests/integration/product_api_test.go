package integration

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"tiendaedgar/backend/database"
	"tiendaedgar/backend/models"
	"tiendaedgar/backend/repositories"
	"tiendaedgar/backend/routes"

	"github.com/gin-gonic/gin"
)

var router *gin.Engine

// setupTestDB configura una base de datos en memoria para tests
func setupTestDB() {
	os.Remove("test_catalog.db")
	database.InitDB("test_catalog.db")
}

// teardownTestDB limpia la base de datos de test
func teardownTestDB() {
	database.CloseDB()
	os.Remove("test_catalog.db")
}

// TestMain configura el entorno de pruebas
func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	code := m.Run()
	os.Exit(code)
}

// setupRouter crea un router de prueba
func setupRouter() *gin.Engine {
	r := gin.Default()
	routes.SetupRoutes(r)
	return r
}

// TestCreateProduct_Valid verifica la creación de un producto válido
func TestCreateProduct_Valid(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	product := models.Product{
		Nombre:      "Remera Básica",
		Descripcion: "Remera 100% algodón",
		Categoria:   "remeras",
		Precio:      2500.00,
		Stock:       10,
		Tallas:      []string{"S", "M", "L"},
		Colores:     []string{"blanco", "negro"},
		Imagenes:    []string{"/images/remera1.jpg"},
		Activo:      true,
	}

	body, _ := json.Marshal(product)
	req, _ := http.NewRequest("POST", "/api/products", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("Expected status 201, got %d. Body: %s", w.Code, w.Body.String())
	}

	var response models.Product
	json.Unmarshal(w.Body.Bytes(), &response)

	if response.ID == 0 {
		t.Error("Expected product to have an ID assigned")
	}

	if response.Nombre != product.Nombre {
		t.Errorf("Expected nombre %s, got %s", product.Nombre, response.Nombre)
	}
}

// TestCreateProduct_InvalidPrice verifica validación de precio
func TestCreateProduct_InvalidPrice(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	product := models.Product{
		Nombre:    "Remera Básica",
		Categoria: "remeras",
		Precio:    -100,
	}

	body, _ := json.Marshal(product)
	req, _ := http.NewRequest("POST", "/api/products", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

// TestCreateProduct_MissingFields verifica validación de campos requeridos
func TestCreateProduct_MissingFields(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	product := models.Product{
		Precio: 2500.00,
	}

	body, _ := json.Marshal(product)
	req, _ := http.NewRequest("POST", "/api/products", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400, got %d", w.Code)
	}
}

// TestGetAllProducts_EmptyDB verifica listado con DB vacía
func TestGetAllProducts_EmptyDB(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	req, _ := http.NewRequest("GET", "/api/products", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	if response["total"].(float64) != 0 {
		t.Errorf("Expected total 0, got %v", response["total"])
	}
}

// TestGetAllProducts_WithData verifica listado con datos
func TestGetAllProducts_WithData(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	// Crear algunos productos primero
	for i := 1; i <= 3; i++ {
		product := models.Product{
			Nombre:    "Producto Test",
			Categoria: "test",
			Precio:    1000.00,
		}
		body, _ := json.Marshal(product)
		req, _ := http.NewRequest("POST", "/api/products", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
	}

	// Listar productos
	req, _ := http.NewRequest("GET", "/api/products", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	if response["total"].(float64) != 3 {
		t.Errorf("Expected total 3, got %v", response["total"])
	}
}

// TestGetAllProducts_Pagination verifica paginación
func TestGetAllProducts_Pagination(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	repo := repositories.NewProductRepository()

	// Crear 10 productos
	for i := 1; i <= 10; i++ {
		product := models.Product{
			Nombre:    "Producto Test",
			Categoria: "test",
			Precio:    1000.00,
		}
		repo.Create(&product)
	}

	// Obtener primera página simulando la request del usuario
	req, _ := http.NewRequest("GET", "/api/products?page=1&limit=20&category=&gender=&search=", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d. Body: %s", w.Code, w.Body.String())
		return
	}

	productsRaw, ok := response["products"]
	if !ok {
		t.Fatalf("Response does not contain 'products' key. Body: %s", w.Body.String())
	}
	
	products, ok := productsRaw.([]interface{})
	if !ok {
		t.Fatalf("products is not []interface{}, got %T", productsRaw)
	}

	if len(products) != 5 {
		t.Errorf("Expected 5 products, got %d", len(products))
	}

	if response["total"].(float64) != 10 {
		t.Errorf("Expected total 10, got %v", response["total"])
	}
}

// TestFilterByCategory verifica filtrado por categoría
func TestFilterByCategory(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	// Crear productos de diferentes categorías
	categories := []string{"remeras", "pantalones", "remeras"}
	for _, cat := range categories {
		product := models.Product{
			Nombre:    "Producto " + cat,
			Categoria: cat,
			Precio:    1000.00,
		}
		body, _ := json.Marshal(product)
		req, _ := http.NewRequest("POST", "/api/products", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
	}

	// Filtrar por categoría "remeras"
	req, _ := http.NewRequest("GET", "/api/products?category=remeras", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	if response["total"].(float64) != 2 {
		t.Errorf("Expected total 2, got %v", response["total"])
	}
}

// TestSearchProducts verifica búsqueda de texto
func TestSearchProducts(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	// Crear productos con diferentes nombres
	products := []models.Product{
		{Nombre: "Jean Azul", Categoria: "pantalones", Precio: 3000.00},
		{Nombre: "Remera Básica", Categoria: "remeras", Precio: 2000.00},
		{Nombre: "Jean Negro", Categoria: "pantalones", Precio: 3500.00},
	}

	for _, p := range products {
		body, _ := json.Marshal(p)
		req, _ := http.NewRequest("POST", "/api/products", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
	}

	// Buscar "jean"
	req, _ := http.NewRequest("GET", "/api/products?search=jean", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	var response map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &response)

	if response["total"].(float64) != 2 {
		t.Errorf("Expected total 2, got %v", response["total"])
	}
}

// TestGetProductByID_Valid verifica obtener producto por ID
func TestGetProductByID_Valid(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	// Crear un producto
	product := models.Product{
		Nombre:    "Remera Test",
		Categoria: "remeras",
		Precio:    2500.00,
	}
	body, _ := json.Marshal(product)
	req, _ := http.NewRequest("POST", "/api/products", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	var created models.Product
	json.Unmarshal(w.Body.Bytes(), &created)

	// Obtener por ID
	req, _ = http.NewRequest("GET", "/api/products/"+string(rune(created.ID+48)), nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", w.Code)
	}
}

// TestGetProductByID_NotFound verifica 404 para ID inexistente
func TestGetProductByID_NotFound(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	req, _ := http.NewRequest("GET", "/api/products/9999", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", w.Code)
	}
}

// TestUpdateProduct verifica actualización completa
func TestUpdateProduct(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	// Crear un producto
	product := models.Product{
		Nombre:    "Remera Original",
		Categoria: "remeras",
		Precio:    2500.00,
	}
	body, _ := json.Marshal(product)
	req, _ := http.NewRequest("POST", "/api/products", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	var created models.Product
	json.Unmarshal(w.Body.Bytes(), &created)

	// Actualizar
	updated := models.Product{
		Nombre:    "Remera Actualizada",
		Categoria: "remeras",
		Precio:    3000.00,
	}
	body, _ = json.Marshal(updated)
	req, _ = http.NewRequest("PUT", "/api/products/1", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d. Body: %s", w.Code, w.Body.String())
	}
}

// TestPartialUpdateProduct verifica actualización parcial
func TestPartialUpdateProduct(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	// Crear un producto
	product := models.Product{
		Nombre:    "Remera Original",
		Categoria: "remeras",
		Precio:    2500.00,
		Stock:     10,
	}
	body, _ := json.Marshal(product)
	req, _ := http.NewRequest("POST", "/api/products", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Actualizar solo el stock
	updates := map[string]interface{}{
		"stock": 20,
	}
	body, _ = json.Marshal(updates)
	req, _ = http.NewRequest("PATCH", "/api/products/1", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d. Body: %s", w.Code, w.Body.String())
	}
}

// TestDeleteProduct verifica eliminación
func TestDeleteProduct(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	// Crear un producto
	product := models.Product{
		Nombre:    "Remera Test",
		Categoria: "remeras",
		Precio:    2500.00,
	}
	body, _ := json.Marshal(product)
	req, _ := http.NewRequest("POST", "/api/products", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Eliminar
	req, _ = http.NewRequest("DELETE", "/api/products/1", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Errorf("Expected status 204, got %d", w.Code)
	}

	// Verificar que no existe
	req, _ = http.NewRequest("GET", "/api/products/1", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404 after deletion, got %d", w.Code)
	}
}

// TestDeleteProduct_NotFound verifica 404 al eliminar producto inexistente
func TestDeleteProduct_NotFound(t *testing.T) {
	setupTestDB()
	defer teardownTestDB()

	router := setupRouter()

	req, _ := http.NewRequest("DELETE", "/api/products/9999", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("Expected status 404, got %d", w.Code)
	}
}
