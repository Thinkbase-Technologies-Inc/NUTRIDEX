import { NextRequest, NextResponse } from "next/server";
import {
  getNotificationsFromNeon,
  markNotificationReadInNeon,
  markAllNotificationsReadInNeon,
  createNotificationInNeon,
  isNeonConfigured,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Falta el parámetro 'email'" }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ source: "local_unconfigured", notificaciones: [] });
    }

    const notificaciones = await getNotificationsFromNeon(email);
    const unreadCount = notificaciones.filter((n) => !n.is_read).length;

    return NextResponse.json({
      source: "neon_lakebase_postgres",
      count: notificaciones.length,
      unreadCount,
      notificaciones,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener notificaciones";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, email, title, message, type, linkUrl } = body;

    if (!email) {
      return NextResponse.json({ error: "Falta el parámetro 'email'" }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ error: "Neon no configurado" }, { status: 503 });
    }

    if (action === "mark_read" && id) {
      await markNotificationReadInNeon(id, email);
      return NextResponse.json({ success: true });
    }

    if (action === "mark_all_read") {
      await markAllNotificationsReadInNeon(email);
      return NextResponse.json({ success: true });
    }

    if (action === "create" && title && message) {
      const res = await createNotificationInNeon(email, title, message, type, linkUrl);
      return NextResponse.json(res);
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al actualizar notificaciones";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
