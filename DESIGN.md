---
name: NutriDex
description: "Equivalencias claras. Nutrición inteligente. Sistema visual HealthTech contemporáneo y accesible inspirado en Gleb Kuznetsov."
colors:
  primary: "#15803d"
  primary-hover: "#166534"
  primary-soft: "#dcfce7"
  accent-green: "#22c55e"
  accent-cyan: "#06b6d4"
  accent-cyan-deep: "#0284c7"
  neutral-bg: "#edf4ee"
  neutral-surface: "#ffffff"
  neutral-surface-muted: "#f4f8f4"
  neutral-border: "#dae5db"
  dock: "#181d19"
  mint: "#dcf5df"
  peach: "#ffedd5"
  ice: "#e0f2fe"
  text-primary: "#141c16"
  text-secondary: "#5a6e60"
  dark-bg: "#0f1612"
  dark-surface: "#17211b"
  dark-surface-muted: "#1e2b23"
  dark-border: "#233329"
  dark-text-primary: "#f0f7f2"
  dark-text-secondary: "#8ca293"
typography:
  display:
    fontFamily: "var(--font-geist-sans), -apple-system, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "var(--font-geist-sans), -apple-system, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "var(--font-geist-sans), -apple-system, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "24px"
  "2xl": "1.5rem"
  "3xl": "1.75rem"
  full: "9999px"
---

# Design System

<!-- impeccable:design-schema 1 -->

## Overview

NutriDex adopta la dirección visual de **Food & Health Intelligence contemporánea** (inspirada en la estética de Gleb Kuznetsov y la experiencia móvil en tonos salvia/menta): tarjetas amplias y orgánicas con esquinas redondeadas (`rounded-3xl`), fotografía gastronómica apetecible y cuidada, pastillas de color suave (menta, durazno, hielo), dock flotante oscuro en móvil con píldora blanca activa y visualización analítica enriquecida con anillos de progreso para equivalentes y macros.

## Colors

### Light Palette
- **Primary:** `#15803d` (Verde hoja fresco, natural y clínico)
- **Primary Hover:** `#166534`
- **Primary Soft:** `#dcfce7` (Menta pastel para selecciones y badges)
- **Accent Cyan:** `#06b6d4` (Bloque destacado de semana y botones de acción)
- **Background:** `#edf4ee` (Tono salvia/menta suave y descansado)
- **Surface:** `#ffffff` (Blanco puro para tarjetas elevadas)
- **Surface Muted:** `#f4f8f4` (Fondos de controles y tablas)
- **Border:** `#dae5db` (Borde nítido y orgánico)
- **Dock:** `#181d19` (Dock flotante oscuro en móvil)
- **Text Primary:** `#141c16` (Texto oscuro nítido)
- **Text Secondary:** `#5a6e60` (Texto secundario en tono pizarra verde)

### Dark Palette
- **Primary:** `#4ade80` (Menta vibrante)
- **Primary Hover:** `#86efac`
- **Primary Soft:** `rgba(74, 222, 128, 0.14)`
- **Background:** `#0f1612` (Negro esmeralda OLED)
- **Surface:** `#17211b` (Superficie oscura elevada)
- **Surface Muted:** `#1e2b23`
- **Border:** `#233329`
- **Text Primary:** `#f0f7f2`
- **Text Secondary:** `#8ca293`

## Typography

- **Fuente:** Geist Sans / System Sans con números tabulares (`font-feature-settings: "tnum" 1, "lnum" 0`).
- **Escala:**
  - Display (Hero): `clamp(2rem, 5vw, 3.25rem)`, `font-extrabold`, `-0.03em`.
  - H1 / Encabezados: `1.875rem` a `2.25rem`, `font-extrabold`.
  - H2 / Subtítulos: `1.25rem`, `font-bold`.
  - Body: `0.9375rem` (`15px`), `leading-relaxed`.
  - Labels: `text-xs`, semibold o bold.

## Layout

- **Desktop (≥ 768px):** Barra lateral fija a la izquierda (240px), cabecera superior sticky con barra de búsqueda global y cápsula de usuario, panel principal con ancho máximo de 1152px.
- **Mobile (< 768px):** Barra inferior en cápsula oscura flotante (`rounded-full`), con botón activo que se transforma en píldora blanca de alto contraste con texto e icono.

## Elevation & Depth

- Tarjetas con esquinas generosas (`rounded-3xl` / `1.5rem`), borde de 1px y sombra suave (`shadow-xs` / `shadow-sm`).
- Sin dobles sombras saturadas ni degradados estridentes en textos.

## Components

- **MealCard (Gleb Kuznetsov Layout):**
  - Banner fotográfico con overlay de título, corazón y chips de equivalentes.
  - Tabla de alimentos estructurada: Grupo con color, Alimento, Porción y acciones de intercambio (`↻`) y eliminación (`✕`).
  - Pie de tarjeta con botón `+ Agregar alimento` y botón píldora `Registrar`.
- **ProgressRings:** Anillos de progreso circulares para seguimiento de grupos de equivalentes.
- **CurrentWeekBlock:** Bloque degradado cian-esmeralda con selector semanal y metas diarias.
- **MobileBottomNavigation:** Dock flotante oscuro con píldora blanca activa.
