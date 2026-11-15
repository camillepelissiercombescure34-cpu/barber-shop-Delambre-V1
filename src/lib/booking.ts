import { weeklyHours } from "@/lib/data";

/** Règles de réservation partagées entre le navigateur et le serveur. */
export const SLOT_STEP_MINUTES = 30;
export const BOOKING_HORIZON_DAYS = 60;
export const LEAD_TIME_MINUTES = 30;

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

export const fromMinutes = (total: number) => `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;

/** Date et heure courantes à Paris, indépendamment du fuseau du serveur ou du visiteur. */
export function parisNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const read = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return { date: `${read("year")}-${read("month")}-${read("day")}`, minutes: Number(read("hour")) * 60 + Number(read("minute")) };
}

const atNoonUTC = (iso: string) => new Date(`${iso}T12:00:00Z`);

export function isValidISODate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = atNoonUTC(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function addDays(iso: string, amount: number) {
  const date = atNoonUTC(iso);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export const dayOfWeek = (iso: string) => atNoonUTC(iso).getUTCDay();
export const rangesForDate = (iso: string) => weeklyHours.find((day) => day.dow === dayOfWeek(iso))?.ranges ?? [];

export function isBookableDate(value: string) {
  if (!isValidISODate(value)) return false;
  const today = parisNow().date;
  return value >= today && value <= addDays(today, BOOKING_HORIZON_DAYS) && rangesForDate(value).length > 0;
}

/** Créneaux de départ possibles : la prestation doit se terminer avant la fermeture de la plage. */
export function slotsForDate(value: string, duration: number) {
  const slots: string[] = [];
  for (const [open, close] of rangesForDate(value)) {
    for (let start = toMinutes(open); start + duration <= toMinutes(close); start += SLOT_STEP_MINUTES) slots.push(fromMinutes(start));
  }
  return slots;
}

export function isPastSlot(date: string, time: string) {
  const now = parisNow();
  return date < now.date || (date === now.date && toMinutes(time) < now.minutes + LEAD_TIME_MINUTES);
}

/** Prochains jours d'ouverture, à partir d'aujourd'hui (heure de Paris). */
export function upcomingDates(count: number) {
  const today = parisNow().date;
  const dates: string[] = [];
  for (let offset = 0; offset <= BOOKING_HORIZON_DAYS && dates.length < count; offset += 1) {
    const iso = addDays(today, offset);
    if (rangesForDate(iso).length > 0) dates.push(iso);
  }
  return dates;
}

export const formatDateFr = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("fr-FR", { ...options, timeZone: "UTC" }).format(atNoonUTC(iso));
