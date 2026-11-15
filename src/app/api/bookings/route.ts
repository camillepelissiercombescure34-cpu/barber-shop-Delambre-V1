import { NextResponse } from "next/server";
import { BookingConflictError, bookingProvider } from "@/lib/booking-provider";
import { emailPattern, isBookableDate, isPastSlot, slotsForDate } from "@/lib/booking";
import { barbers, getService } from "@/lib/data";
import { readJson, text } from "@/lib/http";
import { purgeExpiredData } from "@/lib/retention";

export const dynamic = "force-dynamic";

/** « any » tant qu'aucun barbier n'est renseigné ; `null` si l'identifiant est inconnu. */
const resolveBarber = (value: string | null) => {
  if (!value || value === "any") return "any";
  return barbers.some((barber) => barber.id === value) ? value : null;
};

/** Créneaux d'une journée pour une prestation, avec leur disponibilité. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "";
  const service = getService(searchParams.get("service") ?? "");
  const barberId = resolveBarber(searchParams.get("barber"));
  if (!service || barberId === null || !isBookableDate(date)) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  try {
    void purgeExpiredData();
    const candidates = slotsForDate(date, service.duration);
    const unavailable = new Set(await bookingProvider.getUnavailableSlots({ barberId, date, duration: service.duration, candidates }));
    return NextResponse.json({ slots: candidates.map((time) => ({ time, available: !unavailable.has(time) && !isPastSlot(date, time) })) });
  } catch (error) {
    console.error("Availability error", error);
    return NextResponse.json({ error: "Disponibilités momentanément indisponibles." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });

  const serviceId = text(body.serviceId);
  const date = text(body.date);
  const time = text(body.time);
  const name = text(body.name);
  const email = text(body.email);
  const phone = text(body.phone);
  const notes = text(body.notes);
  const service = getService(serviceId);
  const barberId = resolveBarber(text(body.barberId) || null);

  if (!service || barberId === null) {
    return NextResponse.json({ error: "Prestation invalide." }, { status: 400 });
  }
  if (!isBookableDate(date) || !slotsForDate(date, service.duration).includes(time)) {
    return NextResponse.json({ error: "Date ou créneau invalide." }, { status: 400 });
  }
  if (isPastSlot(date, time)) {
    return NextResponse.json({ error: "Ce créneau est trop proche ou déjà passé. Merci d'en choisir un autre." }, { status: 409 });
  }
  if (name.length < 2 || name.length > 120 || !emailPattern.test(email) || email.length > 160 || phone.length < 6 || phone.length > 40 || notes.length > 800) {
    return NextResponse.json({ error: "Merci de vérifier vos coordonnées." }, { status: 400 });
  }

  try {
    const reference = `RDV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const result = await bookingProvider.create({ reference, barberId, serviceId: service.id, duration: service.duration, date, time, name, email, phone, notes, price: service.price });
    void purgeExpiredData();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof BookingConflictError) return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("Booking error", error);
    return NextResponse.json({ error: "Impossible d'enregistrer la demande pour le moment." }, { status: 500 });
  }
}
