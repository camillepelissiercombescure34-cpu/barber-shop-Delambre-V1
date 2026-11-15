import { NextResponse } from "next/server";
import { db } from "@/db";
import { shopOrderItems, shopOrders } from "@/db/schema";
import { emailPattern } from "@/lib/booking";
import { resolveCartLine, type CartLine, type ResolvedLine } from "@/lib/commerce";
import { readJson, text } from "@/lib/http";
import { purgeExpiredData } from "@/lib/retention";

export const dynamic = "force-dynamic";

const isCartLine = (value: unknown): value is CartLine =>
  typeof value === "object" && value !== null && typeof (value as CartLine).id === "string" && typeof (value as CartLine).quantity === "number";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  const name = text(body.name);
  const email = text(body.email);
  const phone = text(body.phone);
  const items = Array.isArray(body.items) ? body.items : [];

  if (name.length < 2 || name.length > 120 || !emailPattern.test(email) || email.length > 160 || phone.length < 6 || phone.length > 40 || items.length === 0 || items.length > 30) {
    return NextResponse.json({ error: "Informations ou panier invalides." }, { status: 400 });
  }

  const lines = items.filter(isCartLine).map(resolveCartLine).filter((line): line is ResolvedLine => line !== null);
  if (lines.length !== items.length) {
    return NextResponse.json({ error: "Un article du panier n'est plus disponible." }, { status: 400 });
  }

  try {
    const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const reference = `CMD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // La commande et ses lignes sont écrites ensemble, ou pas du tout.
    await db.transaction(async (tx) => {
      await tx.insert(shopOrders).values({ reference, name, email, phone, total, status: "pending" });
      await tx.insert(shopOrderItems).values(lines.map((line) => ({ orderReference: reference, productId: line.productId, name: line.name, price: line.price, quantity: line.quantity })));
    });
    void purgeExpiredData();
    return NextResponse.json({ reference, total }, { status: 201 });
  } catch (error) {
    console.error("Order error", error);
    return NextResponse.json({ error: "Impossible d'enregistrer la demande pour le moment." }, { status: 500 });
  }
}
