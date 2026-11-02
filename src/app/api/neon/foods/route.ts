import { NextResponse } from "next/server";
import { getFoodsFromNeon, syncFoodsToNeon, isNeonConfigured } from "@/lib/db";
import { getFoods } from "@/data/foods";

export async function GET() {
  try {
    if (!isNeonConfigured()) {
      return NextResponse.json({
        source: "local_fallback",
        foods: getFoods(),
      });
    }

    const foods = await getFoodsFromNeon();
    if (foods.length === 0) {
      // Auto seed if empty
      const localFoods = getFoods();
      await syncFoodsToNeon(localFoods);
      return NextResponse.json({
        source: "neon_seeded",
        count: localFoods.length,
        foods: localFoods,
      });
    }

    return NextResponse.json({
      source: "neon_lakebase_postgres",
      count: foods.length,
      foods,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching foods from Neon";
    return NextResponse.json(
      {
        source: "local_fallback_on_error",
        error: message,
        foods: getFoods(),
      },
      { status: 200 }
    );
  }
}

export async function POST() {
  try {
    if (!isNeonConfigured()) {
      return NextResponse.json({ error: "Neon not configured" }, { status: 503 });
    }
    const localFoods = getFoods();
    const result = await syncFoodsToNeon(localFoods);
    return NextResponse.json({
      message: "Catalog successfully synchronized with Neon Lakebase Postgres",
      ...result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error syncing foods to Neon";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
