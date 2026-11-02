import { NextResponse } from "next/server";
import { getNeonHealth, initDatabase, isNeonConfigured } from "@/lib/db";

export async function GET() {
  try {
    if (!isNeonConfigured()) {
      return NextResponse.json(
        {
          status: "unconfigured",
          message: "Neon environment variables (DATABASE_URL) are not set.",
        },
        { status: 503 }
      );
    }

    // Ensure schema is up to date
    await initDatabase();
    const health = await getNeonHealth();

    return NextResponse.json({
      service: "Neon Lakebase Postgres",
      ...health,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error connecting to Neon";
    return NextResponse.json(
      {
        status: "error",
        service: "Neon Lakebase Postgres",
        error: message,
      },
      { status: 500 }
    );
  }
}
