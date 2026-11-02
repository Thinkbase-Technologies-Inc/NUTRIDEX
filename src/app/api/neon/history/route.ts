import { NextRequest, NextResponse } from "next/server";
import { logCalculationToNeon, isNeonConfigured } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, actionType, details } = body;

    if (!email || !actionType) {
      return NextResponse.json(
        { error: "Se requieren 'email' y 'actionType'" },
        { status: 400 }
      );
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ success: true, source: "unconfigured_skipped" });
    }

    await logCalculationToNeon(email, actionType, details ?? {});
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al registrar en historial";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
