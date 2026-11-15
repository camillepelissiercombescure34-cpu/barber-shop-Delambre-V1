import { sql } from "drizzle-orm";
import { db } from "@/db";
import { bookings, contactMessages, shopOrderItems, shopOrders } from "@/db/schema";

/**
 * Durées de conservation des données personnelles, en mois.
 * Ces valeurs sont affichées telles quelles dans la politique de confidentialité
 * et appliquées par `purgeExpiredData` : le texte et le comportement restent alignés.
 */
export const retention = {
  /** Après la date du rendez-vous. */
  bookingsMonths: 12,
  /** Après réception du message. */
  contactMonths: 12,
  /** Après la demande de produits ou de carte cadeau. */
  ordersMonths: 12,
} as const;

const PURGE_INTERVAL_MS = 6 * 60 * 60 * 1000;
let lastPurge = 0;

/** Supprime les données arrivées à échéance. Appelée en tâche de fond par les routes d'API. */
export async function purgeExpiredData() {
  const now = Date.now();
  if (now - lastPurge < PURGE_INTERVAL_MS) return;
  lastPurge = now;

  try {
    await db.delete(bookings).where(sql`to_date(${bookings.date}, 'YYYY-MM-DD') < current_date - make_interval(months => ${retention.bookingsMonths})`);
    await db.delete(contactMessages).where(sql`${contactMessages.createdAt} < now() - make_interval(months => ${retention.contactMonths})`);
    await db.delete(shopOrderItems).where(sql`${shopOrderItems.orderReference} in (select ${shopOrders.reference} from ${shopOrders} where ${shopOrders.createdAt} < now() - make_interval(months => ${retention.ordersMonths}))`);
    await db.delete(shopOrders).where(sql`${shopOrders.createdAt} < now() - make_interval(months => ${retention.ordersMonths})`);
  } catch (error) {
    lastPurge = 0;
    console.error("Retention purge error", error);
  }
}
