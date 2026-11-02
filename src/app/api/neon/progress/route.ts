import { NextResponse } from "next/server";
import {
  getProgressLogsFromNeon,
  addProgressLogInNeon,
  deleteProgressLogInNeon,
  isNeonConfigured,
} from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ logs: [] });
    }

    const logs = await getProgressLogsFromNeon(email);
    return NextResponse.json({ logs, count: logs.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener progreso";
    return NextResponse.json({ error: message, logs: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, entry } = body;

    if (!email || !entry || typeof entry.weight !== "number") {
      return NextResponse.json(
        { error: "Email y datos de peso válidos requeridos" },
        { status: 400 }
      );
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({
        success: true,
        entry: { ...entry, id: `local-${Date.now()}`, user_email: email },
      });
    }

    const saved = await addProgressLogInNeon(email, entry);
    return NextResponse.json({ success: true, entry: saved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al guardar progreso";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id || !email) {
      return NextResponse.json({ error: "ID y email requeridos" }, { status: 400 });
    }

    if (isNeonConfigured()) {
      await deleteProgressLogInNeon(id, email);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al eliminar registro";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
