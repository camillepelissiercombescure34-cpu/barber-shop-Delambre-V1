import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { emailPattern } from "@/lib/booking";
import { readJson, text } from "@/lib/http";
import { purgeExpiredData } from "@/lib/retention";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  const name = text(body.name);
  const email = text(body.email);
  const phone = text(body.phone);
  const subject = text(body.subject);
  const message = text(body.message);

  if (name.length < 2 || name.length > 120 || !emailPattern.test(email) || email.length > 160 || phone.length > 40 || subject.length < 3 || subject.length > 120 || message.length < 10 || message.length > 3000) {
    return NextResponse.json({ error: "Merci de vérifier les champs du formulaire." }, { status: 400 });
  }

  try {
    await db.insert(contactMessages).values({ name, email, phone: phone || null, subject, message });
    void purgeExpiredData();
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Contact error", error);
    return NextResponse.json({ error: "Impossible d'enregistrer le message pour le moment." }, { status: 500 });
  }
}
