import { NextResponse } from "next/server";
import {
  getShoppingListFromNeon,
  saveShoppingItemInNeon,
  toggleShoppingItemInNeon,
  deleteShoppingItemInNeon,
  clearShoppingListInNeon,
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
      return NextResponse.json({ items: [] });
    }

    const items = await getShoppingListFromNeon(email);
    return NextResponse.json({ items, count: items.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener lista de compras";
    return NextResponse.json({ error: message, items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, item } = body;

    if (!email || !item || !item.item_name) {
      return NextResponse.json(
        { error: "Email y datos de artículo válidos requeridos" },
        { status: 400 }
      );
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({
        success: true,
        item: {
          ...item,
          id: item.id ?? `local-shop-${Date.now()}`,
          user_email: email,
          is_purchased: Boolean(item.is_purchased),
        },
      });
    }

    const saved = await saveShoppingItemInNeon(email, item);
    return NextResponse.json({ success: true, item: saved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al guardar artículo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, email, isPurchased } = body;

    if (!id || !email) {
      return NextResponse.json({ error: "ID y email requeridos" }, { status: 400 });
    }

    if (isNeonConfigured()) {
      await toggleShoppingItemInNeon(id, email, Boolean(isPurchased));
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al actualizar estado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const clearAll = searchParams.get("all") === "true";

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    if (isNeonConfigured()) {
      if (clearAll) {
        await clearShoppingListInNeon(email);
      } else if (id) {
        await deleteShoppingItemInNeon(id, email);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al eliminar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
