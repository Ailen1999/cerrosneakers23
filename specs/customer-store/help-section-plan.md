# Plan de Implementación: Centro de Ayuda

*Fecha*: 30-01-2026
*Especificación*: [help-section.md](file:///c:/Users/USER/Desktop/TiendaEdgar/specs/customer-store/help-section.md)

## Resumen

El objetivo es crear una página dedicada al "Centro de Ayuda" que sea accesible desde el footer del sitio. Esta página abrirá en una pestaña nueva y contendrá información organizada sobre Envíos, Medios de Pago y Cambios y Devoluciones. El enfoque técnico consiste en crear una nueva ruta en React Router, un componente de página estático pero estilizado con Tailwind CSS, y actualizar los enlaces del footer.

## Contexto Técnico

*Lenguaje/Versión*: Javascript / React (Vite)
*Dependencias Principales*: react-router-dom, Tailwind CSS
*Almacenamiento*: N/A (Contenido estático por ahora)
*Plataforma Objetivo*: Web (Escritorio y Mobile)
*Tipo de Proyecto*: Aplicación Web (Frontend)

## Estructura del Proyecto

### Documentación (esta funcionalidad)

specs/customer-store/
├── help-section-plan.md  # Este archivo
└── help-section.md       # Especificación de la funcionalidad

### Código Fuente

frontend/
├── src/
│   ├── components/
│   │   └── common/
│   │       └── Footer.jsx      # Se modificarán los links
│   ├── pages/
│   │   └── HelpCenterPage.jsx  # [NUEVO] Página principal de ayuda
│   └── App.jsx                 # Se agregará la nueva ruta

---

## Fase 1: Configuración Inicial de Rutas

*Propósito*: Crear el archivo de la página y registrar la ruta en la aplicación.

- [ ] T001 Crear el componente `HelpCenterPage.jsx` en `src/pages/` con una estructura básica.
- [ ] T002 Registrar la ruta `/ayuda` en `src/App.jsx`.

---

## Fase 2: Navegación desde el Footer (US1)

*Propósito*: Asegurar que los links del footer funcionen correctamente abriendo en una nueva pestaña.

- [ ] T003 Actualizar `src/components/common/Footer.jsx` para que los links de "Ayuda" apunten a `/ayuda` (con hash si es necesario o parámetros) y usen `target="_blank"`.
- [ ] T004 Verificar que al hacer clic se abra la nueva ruta en una pestaña independiente.

---

## Fase 3: Contenido de Categorías (US2)

*Propósito*: Implementar el diseño y contenido para las tres secciones requeridas.

- [ ] T005 Diseñar el Layout de `HelpCenterPage.jsx` acorde a la estética premium del sitio (vibrante, dark mode support).
- [ ] T006 Implementar la sección de **Envíos** con tiempos y costos.
- [ ] T007 Implementar la sección de **Medios de Pago** detallando opciones.
- [ ] T008 Implementar la sección de **Cambios y Devoluciones** con la política correspondiente.
- [ ] T009 Agregar navegación interna (anclas o tabs) para moverse fácilmente entre secciones.

---

## Fase 4: Pulido y Responsive

*Propósito*: Asegurar que la experiencia sea perfecta en todos los dispositivos.

- [ ] T010 Verificar soporte completo para Dark Mode en la nueva página.
- [ ] T011 Ajustar el diseño responsive para celulares.
- [ ] T012 Añadir pequeñas animaciones de entrada para mejorar la experiencia "premium".

---

## Dependencias y Orden de Ejecución

1. **Rutas (Fase 1)**: Requisito previo para poder ver cualquier cambio.
2. **Footer (Fase 2)**: Permite el acceso desde el sitio principal.
3. **Contenido (Fase 3)**: Es el grueso del trabajo visual.
4. **Pulido (Fase 4)**: Toques finales de diseño.

## Notas

- Los links del footer deben usar tanto el path `/ayuda` como quizás un hash (ej: `/ayuda#envios`) para que el usuario caiga directamente en la sección que eligió.
- Mantener la coherencia visual con `HelpCenterPage.jsx` usando `CustomerLayout` si corresponde o un Layout similar.
