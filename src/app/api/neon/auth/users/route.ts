import { NextResponse } from "next/server";
import { getAllUsers, isNeonConfigured } from "@/lib/db";

export async function GET() {
  try {
    if (!isNeonConfigured()) {
      return NextResponse.json({ success: true, users: [] });
    }

    const users = await getAllUsers();
    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatarUrl: u.avatar_url,
        targetCalories: u.target_calories,
        targetEquivalents: u.target_equivalents,
        planName: u.plan_name,
        createdAt: u.created_at,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener usuarios";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
