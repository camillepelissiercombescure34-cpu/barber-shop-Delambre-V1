import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { toMinutes } from "@/lib/booking";
import { barbers, bookingCapacity, getService } from "@/lib/data";

export type BookingInput = {
  reference: string;
  barberId: string;
  serviceId: string;
  duration: number;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  price: number;
};

export type BookingResult = { reference: string; status: string };
export type AvailabilityQuery = { barberId: string; date: string; duration: number; candidates: string[] };

/**
 * Contrat d'intégration pour un futur service de réservation externe.
 * Il suffit d'implémenter cette interface (Fresha, Planity, Calendly, ...)
 * puis de remplacer l'export `bookingProvider` en bas de fichier.
 */
export interface BookingProvider {
  create(input: BookingInput): Promise<BookingResult>;
  /** Parmi les créneaux candidats, renvoie ceux qui ne peuvent plus être réservés. */
  getUnavailableSlots(query: AvailabilityQuery): Promise<string[]>;
}

export class BookingConflictError extends Error {
  constructor() { super("Ce créneau vient d'être réservé. Merci d'en choisir un autre."); }
}

type Reader = Pick<typeof db, "select">;
const FALLBACK_DURATION = 30;

async function unavailableSlots(reader: Reader, { barberId, date, duration, candidates }: AvailabilityQuery) {
  const rows = await reader
    .select({ barberId: bookings.barberId, serviceId: bookings.serviceId, time: bookings.time })
    .from(bookings)
    .where(and(eq(bookings.date, date), ne(bookings.status, "cancelled")));

  const taken = rows.map((row) => {
    const start = toMinutes(row.time);
    return { barberId: row.barberId, start, end: start + (getService(row.serviceId)?.duration ?? FALLBACK_DURATION) };
  });
  // Un fauteuil par barbier renseigné ; à défaut, la capacité prudente définie dans les données.
  const capacity = Math.max(1, barbers.length || bookingCapacity);

  return candidates.filter((time) => {
    const start = toMinutes(time);
    const end = start + duration;
    const overlapping = taken.filter((booking) => booking.start < end && booking.end > start);
    if (overlapping.length >= capacity) return true;
    return barberId !== "any" && overlapping.some((booking) => booking.barberId === barberId);
  });
}

export class InternalBookingProvider implements BookingProvider {
  getUnavailableSlots(query: AvailabilityQuery) {
    return unavailableSlots(db, query);
  }

  async create(input: BookingInput): Promise<BookingResult> {
    return db.transaction(async (tx) => {
      // Sérialise les réservations d'une même journée : deux demandes simultanées ne peuvent pas se chevaucher.
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${input.date}))`);
      const blocked = await unavailableSlots(tx, { barberId: input.barberId, date: input.date, duration: input.duration, candidates: [input.time] });
      if (blocked.length > 0) throw new BookingConflictError();

      await tx.insert(bookings).values({
        reference: input.reference,
        barberId: input.barberId,
        serviceId: input.serviceId,
        date: input.date,
        time: input.time,
        name: input.name,
        email: input.email,
        phone: input.phone,
        notes: input.notes || null,
        price: input.price,
        status: "pending",
        provider: "internal",
      });
      return { reference: input.reference, status: "pending" };
    });
  }
}

// Point de bascule unique : remplacer par un adaptateur externe quand nécessaire.
export const bookingProvider: BookingProvider = new InternalBookingProvider();
