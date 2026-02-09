# Implementation Plan: Gestión de Pedidos (Admin Panel)

*Date*: 2026-01-29
*Spec*: [specs/admin-panel/orders.md](file:///c:/Users/USER/Desktop/TiendaEdgar/specs/admin-panel/orders.md)

## Summary

Implementar un sistema de gestión de pedidos manuales para permitir al administrador registrar ventas concretadas por WhatsApp, calcular totales y descontar stock automáticamente. Esto funcionará como un libro de ventas digital y CRM básico.

## Technical Context

*Language/Version*: Go 1.23+ (Backend), React (Frontend)
*Primary Dependencies*: Gin (Go framework), GORM/Standard SQL (Database), React Router, Axios
*Storage*: SQLite (local database)
*Testing*: Manual testing via Postman/Curl & Frontend UI
*Target Platform*: Windows (Local Desktop/Server)
*Project Type*: Web Application (Admin Panel)

## Project Structure

### Documentation (this feature)

specs/admin-panel/
├── orders-plan.md      # This file
└── orders.md           # Feature Specification

### Source Code

backend/
├── models/
│   ├── order.go        # Order and OrderItem structs
│   └── product.go      # Existing product model (updates for stock)
├── repositories/
│   ├── order_repository.go
│   └── product_repository.go
├── services/
│   └── order_service.go
├── handlers/
│   └── order_handler.go
└── database/
    └── migrations.go   # Schema updates

frontend/
├── src/
│   ├── models/         # Types/Interfaces
│   ├── services/
│   │   └── orderService.js
│   ├── hooks/
│   │   └── useOrders.js
│   ├── pages/
│   │   ├── OrdersPage.jsx
│   │   └── CreateOrderPage.jsx
│   └── components/
│       └── orders/
│           ├── OrderTable.jsx
│           ├── OrderForm.jsx
│           └── OrderStatusBadge.jsx

## Phase 1: Setup & Foundation (Backend)

*Purpose*: Create database schema and basic backend infrastructure for orders.

- [ ] T001 Define `Order` and `OrderItem` structs in `backend/models/order.go`
- [ ] T002 Update `RunMigrations` in `backend/database/migrations.go` to create `orders` and `order_items` tables
- [ ] T003 Implement `OrderRepository` with Create, GetAll, GetByID, UpdateStatus methods

## Phase 2: User Story 1 - Registrar Venta Manual (Priority: P1)

*Goal*: Permitir crear un pedido, calcular totales y descontar stock.

### Backend Implementation
- [ ] T004 Implement `OrderService.CreateOrder` with transaction support for stock deduction
- [ ] T005 Implement `OrderHandler.CreateOrder` endpoint (`POST /api/orders`)
- [ ] T006 Add validation: Check stock availability before creating order

### Frontend Implementation
- [ ] T007 Create `orderService.js` with `createOrder` method
- [ ] T008 Implement `CreateOrderPage.jsx` with customer form
- [ ] T009 Create `ProductSelector` component to add items to order
- [ ] T010 Integrate form submission with backend API

## Phase 3: User Story 2 - Listar y Filtrar Pedidos (Priority: P1)

*Goal*: Visualizar el historial de ventas.

### Backend Implementation
- [ ] T011 Implement `OrderHandler.GetOrders` with pagination and status filtering
- [ ] T012 Implement `OrderRepository.GetAll` with dynamic query building

### Frontend Implementation
- [ ] T013 Create `OrdersPage.jsx` with `OrderTable` component
- [ ] T014 Implement `OrderStatusBadge` for visual status indication
- [ ] T015 Add mock/real data connection to list orders

## Phase 4: User Story 3 - Gestionar Estados (Priority: P2)

*Goal*: Cambiar estados y manejar cancelaciones (restock).

### Backend Implementation
- [ ] T016 Implement `OrderService.UpdateStatus` logic (handle 'Cancelled' stock restoration)
- [ ] T017 Implement `OrderHandler.UpdateStatus` endpoint (`PATCH /api/orders/:id/status`)

### Frontend Implementation
- [ ] T018 Add status change dropdown/modal in `OrderTable` actions
- [ ] T019 Update UI to reflect status changes immediately

## Phase 5: Polish & Refinement

- [ ] T020 Add "Order Details" modal or view in frontend
- [ ] T021 Improve specific error messages (e.g., "Insufficient stock for product X")
- [ ] T022 Verify mobile responsiveness of the order table
