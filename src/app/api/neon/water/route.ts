import { NextResponse } from "next/server";
import {
  getWaterIntakeFromNeon,
  saveWaterIntakeInNeon,
  isNeonConfigured,
} from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({
        user_email: email,
        date,
        intake_ml: 0,
        target_ml: 2000,
      });
    }

    const water = await getWaterIntakeFromNeon(email, date);
    return NextResponse.json(water);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener hidratación";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, date, intakeMl, targetMl } = body;

    if (!email || !date || typeof intakeMl !== "number") {
      return NextResponse.json(
        { error: "Email, fecha y consumo de agua válidos requeridos" },
        { status: 400 }
      );
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({
        user_email: email,
        date,
        intake_ml: intakeMl,
        target_ml: targetMl ?? 2000,
      });
    }

    const saved = await saveWaterIntakeInNeon(email, date, intakeMl, targetMl ?? 2000);
    return NextResponse.json({ success: true, water: saved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al guardar hidratación";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
