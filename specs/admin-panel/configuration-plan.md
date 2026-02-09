# Implementation Plan: Panel de Configuración del Administrador

*Date*: 2026-01-30
*Spec*: [configuration-spec.md](file:///c:/Users/USER/Desktop/TiendaEdgar/specs/admin-panel/configuration-spec.md)

## Summary

Implementación de un sistema de configuración centralizado que permita al administrador gestionar la identidad de la tienda (nombre, logo), datos de contacto (WhatsApp), reglas financieras (recargo de tarjetas) y alertas de stock sin necesidad de modificar el código.

## Project Structure

### Documentation
specs/admin-panel/
├── configuration-plan.md     # This file
└── configuration-spec.md     # Feature specification

### Source Code
backend/
├── src/
│   ├── models/config.go
│   ├── repositories/config_repository.go
│   ├── services/config_service.go
│   └── handlers/config_handler.go

frontend/
├── src/
│   ├── components/admin/config/
│   ├── pages/admin/ConfigPage.jsx
│   └── services/configService.js

## Phase 1: Setup (Shared Infrastructure)

*Purpose*: Initial structure for configuration management.

- [ ] T001 Create `SiteConfig` model in backend (`models/config.go`)
- [ ] T002 Create migration for `site_configs` table (ensure singleton constraint)
- [ ] T003 Initialize `ConfigRepository` and `ConfigService` structure in backend

---

## Phase 2: Foundational (Backend Core)

*Purpose*: Backend API to read and write configuration.

- [ ] T004 Implement `GetConfig` and `UpdateConfig` in `ConfigRepository`
- [ ] T005 Implement business logic in `ConfigService` (validation, defaults)
- [ ] T006 Create `ConfigHandler` with `GET` and `PUT` endpoints
- [ ] T007 Register routes `/api/config` in `routes.go`
- [ ] T008 [TEST] Verify API endpoints via curl/Postman
- [ ] T009 Create `configService.js` in frontend to consume the API

---

## Phase 3: User Story 1 - Editar Datos de la Página (Priority: P1)

*Goal*: Allow updating Store Name and Logo.

### Implementation
- [ ] T010 [US1] Backend: Ensure `store_name` and `logo_url` are in `SiteConfig` model
- [ ] T011 [US1] Frontend: Create `GeneralSettingsForm` component in `components/admin/config/`
- [ ] T012 [US1] Frontend: Implement file upload logic for Logo (requires `UploadHandler` or usage of existing)
- [ ] T013 [US1] Frontend: Create `ConfigPage` main layout and integrate `GeneralSettingsForm`
- [ ] T014 [US1] Integration: Update `Header.jsx` and `Sidebar.jsx` to fetch and display dynamic Store Name/Logo (using Context or hook)

---

## Phase 4: User Story 2 - Configuración de Contacto (Priority: P1)

*Goal*: Allow updating WhatsApp number and message.

### Implementation
- [ ] T015 [US2] Backend: Ensure `whatsapp_number` and `whatsapp_message` are in `SiteConfig` model
- [ ] T016 [US2] Frontend: Create `ContactSettingsForm` component
- [ ] T017 [US2] Integration: Update `WhatsAppButton` and `Footer` to use dynamic values from API
- [ ] T018 [US2] Frontend: Add `ContactSettingsForm` to `ConfigPage`

---

## Phase 5: User Story 3 & 4 - Finanzas y Stock (Priority: P2)

*Goal*: Allow updating Credit Card Surcharge and Low Stock Threshold.

### Implementation
- [ ] T019 [US3/4] Backend: Ensure `credit_card_surcharge` and `low_stock_threshold` are in `SiteConfig` model
- [ ] T020 [US3/4] Frontend: Create `FinanceSettingsForm` and `StockSettingsForm` components
- [ ] T021 [US3/4] Frontend: Add forms to `ConfigPage`
- [ ] T022 [US3/4] Integration: Update Product Details (frontend) to calculate price with dynamic surcharge
- [ ] T023 [US3/4] Integration: Update Admin Dashboard to use dynamic threshold for low stock alerts

---

## Phase 6: Polish & Verification

*Purpose*: Final cleanups and end-to-end testing.

- [ ] T024 Create UserContext/ConfigContext to avoid refetching config in every component
- [ ] T025 Verify persistence of all fields after server restart
- [ ] T026 Check edge cases (empty strings, negative numbers)
- [ ] T027 Update documentation
