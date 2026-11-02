import { NextRequest, NextResponse } from "next/server";
import { getRecipesFromNeon, getRecipeBySlugFromNeon, isNeonConfigured } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const slug = searchParams.get("slug") ?? undefined;

    if (!isNeonConfigured()) {
      return NextResponse.json({ source: "local_unconfigured", recetas: [] });
    }

    if (slug) {
      const receta = await getRecipeBySlugFromNeon(slug);
      if (!receta) {
        return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });
      }
      return NextResponse.json({ source: "neon_lakebase_postgres", receta });
    }

    const recetas = await getRecipesFromNeon(category, search);
    return NextResponse.json({
      source: "neon_lakebase_postgres",
      count: recetas.length,
      recetas,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener recetas";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
