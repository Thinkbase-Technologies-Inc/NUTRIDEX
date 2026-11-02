import { NextRequest, NextResponse } from "next/server";
import {
  getUserFavoritesFromNeon,
  addUserFavoriteToNeon,
  removeUserFavoriteFromNeon,
  isNeonConfigured,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Missing 'email' parameter" }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ source: "local_unconfigured", favorites: [] });
    }

    const favorites = await getUserFavoritesFromNeon(email);
    return NextResponse.json({
      source: "neon_lakebase_postgres",
      email,
      favorites,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching favorites";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isNeonConfigured()) {
      return NextResponse.json({ error: "Neon not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { email, foodId } = body;

    if (!email || !foodId) {
      return NextResponse.json({ error: "Both 'email' and 'foodId' are required" }, { status: 400 });
    }

    await addUserFavoriteToNeon(email, foodId);
    return NextResponse.json({
      success: true,
      message: `Added food '${foodId}' to favorites for ${email}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error saving favorite to Neon";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isNeonConfigured()) {
      return NextResponse.json({ error: "Neon not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { email, foodId } = body;

    if (!email || !foodId) {
      return NextResponse.json({ error: "Both 'email' and 'foodId' are required" }, { status: 400 });
    }

    await removeUserFavoriteFromNeon(email, foodId);
    return NextResponse.json({
      success: true,
      message: `Removed food '${foodId}' from favorites for ${email}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting favorite from Neon";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
