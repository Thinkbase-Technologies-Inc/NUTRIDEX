import { NextRequest, NextResponse } from "next/server";
import { updateUserProfileInNeon, isNeonConfigured } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, avatarUrl, targetCalories, targetEquivalents, planName } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "El correo es requerido para actualizar el perfil" },
        { status: 400 }
      );
    }

    if (!isNeonConfigured()) {
      return NextResponse.json(
        { success: false, error: "Base de datos Neon no configurada" },
        { status: 503 }
      );
    }

    const updated = await updateUserProfileInNeon(email, {
      name,
      avatar_url: avatarUrl,
      target_calories: targetCalories,
      target_equivalents: targetEquivalents,
      plan_name: planName,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        avatarUrl: updated.avatar_url,
        targetCalories: updated.target_calories,
        targetEquivalents: updated.target_equivalents,
        planName: updated.plan_name,
        createdAt: updated.created_at,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al actualizar perfil";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
