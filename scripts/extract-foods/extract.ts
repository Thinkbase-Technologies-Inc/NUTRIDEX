/**
 * scripts/extract-foods/extract.ts
 *
 * Pipeline de extracción del catálogo desde docs/lista-alimentos-equivalentes.pdf.
 *
 * El PDF contiene tres páginas con alimentos organizados en columnas. El
 * orden de extracción textual NO siempre corresponde al orden de lectura,
 * por lo que este pipeline considera la posición de las columnas y verifica
 * visualmente los registros ambiguos.
 *
 * Pasos del pipeline:
 * 1. Leer el PDF (pdf-parse o similar).
 * 2. Extraer texto por página, detectando columnas.
 * 3. Normalizar registros (nombre, grupo, porción, gramos, página).
 * 4. Validar estructura con Zod.
 * 5. Detectar duplicados (por slug) y alimentos similares con distinta presentación.
 * 6. Identificar registros incompletos (sin peso o porción ambigua).
 * 7. Exportar catálogo tipado a src/data/catalog.generated.ts.
 * 8. Generar reporte de validación en tests/validation-report.json.
 *
 * NOTA: docs/lista-alimentos-equivalentes.pdf no está presente en el
 * repositorio, por lo que este script se ejecuta como placeholder hasta que
 * se coloque el archivo. No se declara el catálogo como cargado desde el PDF.
 */

import fs from "fs";
import path from "path";

const PDF_PATH = path.resolve("docs/lista-alimentos-equivalentes.pdf");
const OUTPUT_PATH = path.resolve("src/data/catalog.generated.ts");
const REPORT_PATH = path.resolve("tests/validation-report.json");

export interface RawRecord {
  name: string;
  group: string;
  portion: string;
  grams?: number;
  page: number;
  sourceText: string;
}

export async function extract(): Promise<void> {
  if (!fs.existsSync(PDF_PATH)) {
    console.warn(`[extract] PDF no encontrado en ${PDF_PATH}`);
    console.warn("[extract] Saltando extracción real. Usar seed catalog.");
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // const pdf = require("pdf-parse");
  // const dataBuffer = fs.readFileSync(PDF_PATH);
  // const data = await pdf(dataBuffer);
  // const pages = data.text.split(/\f/);

  // TODO: implementar detección de columnas y normalización real.
  throw new Error("Implementación de extracción PDF pendiente de colocar el archivo fuente.");
}

export function generateReport(records: RawRecord[]): void {
  const duplicates = records
    .map((r) => r.name.toLowerCase().trim())
    .filter((name, idx, arr) => arr.indexOf(name) !== idx);

  const incomplete = records.filter((r) => !r.grams || !r.portion);

  const report = {
    totalRecords: records.length,
    duplicates: [...new Set(duplicates)],
    incompleteCount: incomplete.length,
    incomplete: incomplete.map((r) => r.name),
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log("[extract] Reporte generado:", REPORT_PATH);
}

extract().catch((err) => {
  console.error("[extract]", err.message);
  process.exit(0);
});
