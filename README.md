# NutriDex

Equivalencias claras. Nutrición inteligente.

Aplicación local-first para consultar equivalentes alimenticios, calcular porciones, comparar alimentos del mismo grupo y organizar un plan personal.

## Estado del catálogo

El PDF de origen esperado en `docs/lista-alimentos-equivalentes.pdf` no estaba presente al iniciar el desarrollo. La aplicación incluye los **6 ejemplos** escritos en el requerimiento como datos provisionales, con estado `needs_review`; no representan el catálogo completo ni han sido verificados contra el PDF. Las **17 categorías** están modeladas y disponibles. No se incluyen datos nutricionales inventados.

Coloca el PDF en la ruta anterior y ejecuta el pipeline de `scripts/extract-foods/`. La extracción de columnas requiere verificación visual antes de marcar registros como verificados; el extractor actual documenta ese punto y reporta explícitamente cuando falta el documento.

## Funciones implementadas

- Inicio con búsqueda, accesos rápidos y las 17 categorías.
- Explorador con búsqueda insensible a acentos, filtros y vistas de tarjetas/lista.
- Ficha individual con cálculo de fracciones y gramos documentados.
- Calculadora y comparador, con la comparación limitada al mismo grupo.
- Favoritos, plan diario/semanal, edición de comidas, duplicado diario e impresión.
- Preferencias de tema, respaldo JSON validado con Zod y borrado de datos locales.
- Persistencia de favoritos/preferencias en localStorage y planes en IndexedDB.
- Diseño adaptable, navegación móvil, manifest PWA y accesibilidad básica de teclado/lectores.

## Desarrollo

Requisitos: Node.js compatible con Next.js 16.

```bash
npm install --legacy-peer-deps
npm run dev
```

Abrir `http://localhost:3000`.

## Calidad

```bash
npx tsc --noEmit
npm run lint
npm test
npm run build
```

## Despliegue en Vercel

Importa el repositorio en Vercel o ejecuta `npx vercel`. Usa el preset Next.js y el comando de build predeterminado (`npm run build`). No se requiere backend remoto.

## Datos y privacidad

Los datos del usuario permanecen en el navegador. La aplicación no requiere cuenta ni envía planes a un servidor. Exporta una copia desde Configuración antes de limpiar los datos del navegador.

NutriDex es una herramienta de consulta y organización de equivalentes alimenticios. No sustituye una valoración individual realizada por un profesional de la nutrición.
