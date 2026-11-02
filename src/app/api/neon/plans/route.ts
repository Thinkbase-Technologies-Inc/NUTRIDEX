import { NextRequest, NextResponse } from "next/server";
import {
  getMealPlansFromNeon,
  upsertMealPlanInNeon,
  deleteMealPlanFromNeon,
  isNeonConfigured,
} from "@/lib/db";
import type { MealPlan } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Falta el parámetro 'email'" }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ source: "local_unconfigured", plans: [] });
    }

    const plans = await getMealPlansFromNeon(email);
    return NextResponse.json({
      source: "neon_lakebase_postgres",
      count: plans.length,
      plans,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener planes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, plan } = body as { email: string; plan: MealPlan };

    if (!email || !plan || !plan.date) {
      return NextResponse.json(
        { error: "Se requieren 'email' y 'plan' con fecha válida" },
        { status: 400 }
      );
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ error: "Servicio no disponible temporalmente" }, { status: 503 });
    }

    await upsertMealPlanInNeon(email, plan);
    return NextResponse.json({
      success: true,
      message: `Plan del día ${plan.date} guardado exitosamente en la nube`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al guardar el plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const date = searchParams.get("date");

    if (!email || !date) {
      return NextResponse.json({ error: "Se requieren 'email' y 'date'" }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ error: "Servicio no disponible temporalmente" }, { status: 503 });
    }

    await deleteMealPlanFromNeon(email, date);
    return NextResponse.json({
      success: true,
      message: `Plan del día ${date} eliminado de tu cuenta`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al eliminar el plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
