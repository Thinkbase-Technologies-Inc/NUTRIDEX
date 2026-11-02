import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser, isNeonConfigured } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, avatarUrl } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nombre, correo y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    if (!isNeonConfigured()) {
      return NextResponse.json(
        { success: false, error: "Servicio de cuentas temporalmente no disponible" },
        { status: 503 }
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Este correo electrónico ya está registrado. Inicia sesión en su lugar.",
        },
        { status: 409 }
      );
    }

    const defaultAvatar =
      avatarUrl ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80";

    const newUser = await createUser({
      name,
      email,
      passwordHash: password,
      avatarUrl: defaultAvatar,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatarUrl: newUser.avatar_url,
        targetCalories: newUser.target_calories,
        targetEquivalents: newUser.target_equivalents,
        planName: newUser.plan_name,
        createdAt: newUser.created_at,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al registrar usuario";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
