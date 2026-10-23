<div align="center">

<img src="public/icons/nutridex.svg" alt="Logo de NutriDex" width="88" height="88" />

# NutriDex

### Equivalencias claras. Nutrición inteligente.

Consulta alimentos, calcula porciones y organiza equivalentes desde una experiencia sencilla y accesible.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-111111?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![HeroUI](https://img.shields.io/badge/HeroUI-v3-7828C8)](https://www.heroui.com/)

<br />

**Diseñado y desarrollado por ThinkBase**<br />
<img src="public/icons/thinkbase.svg" alt="ThinkBase" height="42" />

</div>

---

## Sobre el producto

NutriDex convierte una tabla de equivalentes alimenticios en una herramienta de consulta práctica. Busca alimentos por nombre, revisa su porción de referencia, calcula cantidades proporcionales y compara alternativas del mismo grupo.

La aplicación es **local-first**: se puede utilizar sin crear una cuenta y los datos personales se guardan en el navegador.

## Funcionalidades

| Área | Qué puedes hacer |
| --- | --- |
| **Explorar** | Buscar alimentos al instante, sin distinguir acentos o mayúsculas; filtrar por grupo y alternar entre tarjetas y lista. |
| **Calcular** | Escalar porciones y pesos documentados con cantidades enteras o fraccionarias. |
| **Comparar** | Contrastar alimentos manteniendo el mismo grupo y número de equivalentes. |
| **Planificar** | Organizar comidas por día, consultar la semana, duplicar días e imprimir el plan. |
| **Personalizar** | Guardar favoritos, elegir tema claro u oscuro, importar y exportar respaldos JSON. |
| **Consultar** | Ver la fuente y el estado de validación asociado a cada registro. |

La interfaz incluye navegación adaptable a móvil, foco visible, etiquetas accesibles y una paleta oscura propia.

## Catálogo y fuente de datos

El catálogo previsto se basa en `docs/lista-alimentos-equivalentes.pdf`. **Ese archivo no estaba disponible en el repositorio durante la implementación**, por lo que no se ha podido digitalizar ni verificar su contenido completo.

Actualmente hay **6 ejemplos** proporcionados en el requerimiento, todos marcados como `needs_review`. Las **17 categorías** están definidas, pero la mayoría todavía no tiene alimentos cargados. Estos ejemplos no deben interpretarse como un catálogo clínico completo ni como información verificada contra el documento fuente.

El pipeline de extracción y validación está en `scripts/`. Cuando se incorpore el PDF, los registros deben verificarse frente al orden visual de las columnas y conservar la página y el texto de origen. No se incluyen calorías, macronutrientes ni conversiones que no estén documentadas.

## Stack

- **Aplicación:** Next.js 16 App Router, React 19 y TypeScript estricto.
- **Interfaz:** Tailwind CSS v4, HeroUI v3, Lucide React y Motion.
- **Dominio y estado:** funciones puras, aritmética racional, Zustand y esquemas Zod.
- **Persistencia:** localStorage para preferencias y favoritos; IndexedDB para planes.
- **Calidad:** Vitest y ESLint.

## Empezar

### Requisitos

- Node.js compatible con Next.js 16.
- npm.

### Instalación y desarrollo

```bash
git clone https://github.com/Thinkbase-Technologies-Inc/NUTRIDEX.git
cd NUTRIDEX
npm install --legacy-peer-deps
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Comandos

```bash
npm run dev       # Servidor local
npm run lint      # ESLint
npm test          # Pruebas Vitest
npm run test:watch
npx tsc --noEmit  # Comprobación TypeScript
npm run build     # Build de producción
npm run start     # Servir el build localmente
```

## Estructura del proyecto

```text
public/                 Logos, iconos y manifest de la aplicación
scripts/                Pipeline y validación del catálogo
src/app/                Rutas y páginas del App Router
src/components/         Componentes de interfaz y navegación
src/data/               Catálogo tipado y grupos alimenticios
src/domain/             Cálculos y reglas de equivalencias
src/repositories/       Persistencia local y acceso a IndexedDB
src/stores/             Estado compartido con Zustand
src/types/              Contratos TypeScript y esquemas Zod
tests/                  Pruebas de dominio y catálogo
```

## Privacidad y uso responsable

NutriDex no requiere autenticación ni envía planes a un servidor remoto. Favoritos y preferencias se guardan en el almacenamiento local del navegador; los planes se guardan en IndexedDB. Desde **Configuración** se pueden exportar respaldos JSON o borrar los datos locales.

> NutriDex es una herramienta de consulta y organización de equivalentes alimenticios. No sustituye una valoración individual realizada por un profesional de la nutrición ni ofrece recomendaciones médicas personalizadas.

## Despliegue

El proyecto está preparado para Vercel:

1. Importa el repositorio en Vercel.
2. Selecciona el preset **Next.js**.
3. Usa `npm run build` como comando de compilación.

También puedes desplegar desde la terminal con `npx vercel`.

## Identidad de marca

<div align="center">

<img src="public/icons/nutridex.svg" alt="NutriDex" height="56" />
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="public/icons/thinkbase.svg" alt="ThinkBase" height="56" />

**NutriDex · producto de ThinkBase**

</div>

---

<div align="center">
Hecho para que consultar equivalentes alimenticios sea más claro, rápido y útil.
</div>
