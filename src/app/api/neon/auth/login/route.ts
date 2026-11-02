import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, isNeonConfigured } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Correo electrónico y contraseña requeridos" },
        { status: 400 }
      );
    }

    if (!isNeonConfigured()) {
      return NextResponse.json(
        { success: false, error: "Base de datos Neon no configurada" },
        { status: 503 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user || user.password_hash !== password) {
      return NextResponse.json(
        {
          success: false,
          error: "Credenciales incorrectas en NeonDB. Verifica tus datos o usa la cuenta demo.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar_url,
        targetCalories: user.target_calories,
        targetEquivalents: user.target_equivalents,
        planName: user.plan_name,
        createdAt: user.created_at,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error durante el inicio de sesión";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
