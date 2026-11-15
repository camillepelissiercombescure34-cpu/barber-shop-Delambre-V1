"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock, Info, Loader2, Phone, Scissors, User } from "lucide-react";
import { barbers, brand, formatDuration, formatPrice, getService, pricesNotice, serviceCategories, services } from "@/lib/data";
import { formatDateFr, upcomingDates } from "@/lib/booking";
import { ButtonLink, SuccessPanel } from "@/components/ui";

type StepId = "barber" | "service" | "slot" | "details";
type Slot = { time: string; available: boolean };
type Status = "idle" | "loading" | "success" | "error";

/** L'étape « Barbier » n'existe que si de vrais barbiers sont renseignés dans les données. */
const hasBarbers = barbers.length > 0;
const steps: { id: StepId; label: string }[] = [
  ...(hasBarbers ? [{ id: "barber" as StepId, label: "Barbier" }] : []),
  { id: "service", label: "Prestation" },
  { id: "slot", label: "Créneau" },
  { id: "details", label: "Vos infos" },
];
const indexOfStep = (id: StepId) => Math.max(0, steps.findIndex((step) => step.id === id));
const two = (value: number) => String(value).padStart(2, "0");

export default function BookingFlow({ variant = "full", initialBarberId = "", initialServiceId = "" }: { variant?: "full" | "compact"; initialBarberId?: string; initialServiceId?: string }) {
  const [stepIndex, setStepIndex] = useState(() => initialServiceId ? indexOfStep("slot") : initialBarberId && hasBarbers ? indexOfStep("service") : 0);
  const [barberId, setBarberId] = useState(initialBarberId || "any");
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [category, setCategory] = useState<string>("Toutes");
  const [dates, setDates] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [conflict, setConflict] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  const stepId = steps[stepIndex].id;
  const stepLabel = `Étape ${two(stepIndex + 1)} / ${two(steps.length)}`;
  const service = getService(serviceId);
  const barber = barbers.find((person) => person.id === barberId);
  const filteredServices = services.filter((item) => category === "Toutes" || item.category === category);
  const hasAvailability = slots.some((slot) => slot.available);
  const dateLabel = date ? formatDateFr(date, { weekday: "long", day: "numeric", month: "long" }) : "";
  const canContinue = stepId === "barber" ? Boolean(barberId) : stepId === "service" ? Boolean(service) : stepId === "slot" ? Boolean(date && time) : false;

  // Les jours proposés sont calculés dans le navigateur, à l'heure de Paris.
  useEffect(() => {
    const next = upcomingDates(14);
    setDates(next);
    setDate((current) => current || next[0] || "");
  }, []);

  // Les créneaux et leur disponibilité viennent toujours du serveur.
  useEffect(() => {
    if (!date || !serviceId) { setSlots([]); return; }
    const controller = new AbortController();
    setSlots([]);
    setSlotError("");
    setLoadingSlots(true);
    const query = new URLSearchParams({ date, service: serviceId, barber: barberId });
    fetch(`/api/bookings?${query.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as { slots?: Slot[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "Disponibilités momentanément indisponibles.");
        setSlots(Array.isArray(result.slots) ? result.slots : []);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setSlotError(cause instanceof Error ? cause.message : "Disponibilités momentanément indisponibles.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoadingSlots(false); });
    return () => controller.abort();
  }, [date, serviceId, barberId, refreshKey]);

  // Un créneau sélectionné puis devenu indisponible est désélectionné.
  useEffect(() => {
    if (time && !loadingSlots && slots.length > 0 && !slots.some((slot) => slot.time === time && slot.available)) setTime("");
  }, [slots, time, loadingSlots]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accepted) { setError("Merci de cocher la case pour que le salon puisse vous recontacter."); setStatus("error"); return; }
    setStatus("loading");
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId, serviceId, date, time,
          name: formData.get("name"), email: formData.get("email"), phone: formData.get("phone"), notes: formData.get("notes"),
        }),
      });
      const result = await response.json() as { reference?: string; error?: string };
      if (response.status === 409) {
        // Le créneau vient d'être pris : on revient à l'étape précédente avec des disponibilités à jour.
        setConflict(result.error ?? "Ce créneau n'est plus disponible.");
        setTime("");
        setRefreshKey((key) => key + 1);
        setStepIndex(indexOfStep("slot"));
        setStatus("idle");
        return;
      }
      if (!response.ok) throw new Error(result.error ?? "Une erreur est survenue.");
      setReference(result.reference ?? "");
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle"); setReference(""); setStepIndex(0); setBarberId("any"); setServiceId(""); setTime("");
    setAccepted(false); setError(""); setConflict(""); setRefreshKey((key) => key + 1);
  };

  if (status === "success") {
    return (
      <div className={variant === "full" ? "mx-auto max-w-3xl" : ""}>
        <SuccessPanel
          title="Demande enregistrée"
          message={`Votre demande ${reference} est enregistrée${service ? ` : ${service.name}, ${dateLabel} à ${time}` : ""}. Conservez cette référence : le salon vous recontacte pour confirmer le rendez-vous.`}
          action={<div className="flex flex-wrap justify-center gap-3"><button type="button" onClick={reset} className="btn btn-outline">Nouvelle demande</button><ButtonLink href="/" variant="primary">Retour à l'accueil</ButtonLink></div>}
        />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-6 ${variant === "full" ? "lg:grid-cols-[minmax(0,1fr)_340px]" : ""}`}>
      <div className="card-surface p-5 sm:p-8">
        <ol className="mb-8 grid gap-1 sm:gap-3" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label="Étapes de la réservation">
          {steps.map((item, index) => {
            const active = index === stepIndex;
            const done = index < stepIndex;
            return (
              <li key={item.id}>
                <button type="button" disabled={!done} onClick={() => setStepIndex(index)} aria-current={active ? "step" : undefined} aria-label={`${item.label}${done ? " — modifier" : ""}`} className="w-full text-left disabled:cursor-default">
                  <span className={`mb-2 block h-[3px] w-full transition-colors ${active || done ? "bg-brass" : "bg-white/12"}`} />
                  <span className={`flex items-center gap-2 font-display text-[.6rem] uppercase tracking-[.12em] sm:text-[.68rem] ${active ? "text-brass" : done ? "text-cream" : "text-stone/60"}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center border text-[.6rem] ${active || done ? "border-brass" : "border-line"}`}>{done ? <Check size={11} /> : two(index + 1)}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {stepId === "barber" && (
          <div>
            <span className="eyebrow">{stepLabel}</span>
            <h3 className="display card-title mt-3">Choisissez votre barbier</h3>
            <p className="body-copy mt-3 text-sm">Un nom en particulier, ou le premier fauteuil disponible.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button type="button" aria-pressed={barberId === "any"} onClick={() => { setBarberId("any"); setTime(""); }} className={`selectable flex items-center gap-4 border p-4 text-left ${barberId === "any" ? "selected" : "border-line"}`}>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-brass/50 bg-coal-3 text-brass"><Scissors size={21} /></span>
                <span><span className="block font-display text-lg uppercase">Premier disponible</span><span className="mt-1 block text-sm text-stone">Le créneau le plus proche.</span></span>
              </button>
              {barbers.map((person) => (
                <button key={person.id} type="button" aria-pressed={barberId === person.id} onClick={() => { setBarberId(person.id); setTime(""); }} className={`selectable flex items-center gap-4 border p-3 text-left ${barberId === person.id ? "selected" : "border-line"}`}>
                  <img src={person.image} alt="" className="h-14 w-14 shrink-0 object-cover" />
                  <span><span className="block font-display text-base uppercase">{person.name}</span><span className="mt-1 block text-xs text-stone">{person.specialty}</span></span>
                </button>
              ))}
            </div>
          </div>
        )}

        {stepId === "service" && (
          <div>
            <span className="eyebrow">{stepLabel}</span>
            <h3 className="display card-title mt-3">Choisissez la prestation</h3>
            <p className="body-copy mt-3 text-sm">{pricesNotice}</p>
            <div className="hide-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
              {serviceCategories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`filter-pill shrink-0 ${category === item ? "active" : ""}`}>{item}</button>)}
            </div>
            <div className="mt-4 space-y-2">
              {filteredServices.map((item) => (
                <button key={item.id} type="button" aria-pressed={serviceId === item.id} onClick={() => { setServiceId(item.id); setTime(""); setConflict(""); }} className={`selectable flex w-full items-center justify-between gap-4 border p-4 text-left ${serviceId === item.id ? "selected" : "border-line"}`}>
                  <span className="min-w-0"><span className="block font-display text-base uppercase">{item.name}{item.tag && <span className="ml-2 align-middle text-[.55rem] tracking-widest text-brass">● {item.tag}</span>}</span><span className="mt-1 block text-xs text-stone sm:text-sm">{item.description}</span></span>
                  <span className="shrink-0 text-right"><span className="block font-display text-lg text-brass">{formatPrice(item.price)}</span><span className="text-xs text-stone">{formatDuration(item.duration)}</span></span>
                </button>
              ))}
            </div>
          </div>
        )}

        {stepId === "slot" && (
          <div>
            <span className="eyebrow">{stepLabel}</span>
            <h3 className="display card-title mt-3">Choisissez le créneau</h3>
            <p className="body-copy mt-3 text-sm">{service ? `${service.name} · ${formatDuration(service.duration)}. ` : ""}Les horaires barrés ne sont plus disponibles.</p>
            {conflict && <p className="mt-4 border border-brass/40 bg-brass/10 px-4 py-3 text-sm text-brass" role="alert">{conflict}</p>}
            <div className="mt-7 flex items-center gap-2 text-xs uppercase tracking-[.14em] text-stone"><CalendarDays size={15} className="text-brass" /> Prochains jours d'ouverture</div>
            <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-3">
              {dates.map((value) => (
                <button key={value} type="button" aria-pressed={date === value} aria-label={formatDateFr(value, { weekday: "long", day: "numeric", month: "long" })} onClick={() => { setDate(value); setTime(""); setConflict(""); }} className={`selectable min-w-[66px] shrink-0 border px-3 py-3 text-center ${date === value ? "selected" : "border-line"}`}>
                  <span className="block text-[.62rem] uppercase tracking-widest text-stone">{formatDateFr(value, { weekday: "short" }).replace(".", "")}</span>
                  <span className="my-1 block font-display text-xl">{formatDateFr(value, { day: "2-digit" })}</span>
                  <span className="block text-[.62rem] uppercase text-stone">{formatDateFr(value, { month: "short" }).replace(".", "")}</span>
                </button>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[.14em] text-stone">
              <span className="flex items-center gap-2"><Clock size={15} className="text-brass" /> Horaires{dateLabel && <span className="text-cream"> · {dateLabel}</span>}</span>
              {loadingSlots && <span className="flex items-center gap-1 text-brass"><Loader2 size={12} className="animate-spin" /> chargement</span>}
            </div>
            {slotError ? (
              <p className="mt-4 text-sm text-red-300" role="alert">{slotError} <button type="button" onClick={() => setRefreshKey((key) => key + 1)} className="ml-2 text-brass underline underline-offset-4">Réessayer</button></p>
            ) : (
              <div className="mt-3 grid min-h-[52px] grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {slots.map((slot) => (
                  <button key={slot.time} type="button" disabled={!slot.available} aria-pressed={time === slot.time} onClick={() => { setTime(slot.time); setConflict(""); }} className={`border px-2 py-3 font-display text-sm transition-colors ${time === slot.time ? "border-brass bg-brass text-coal" : slot.available ? "border-line text-cream hover:border-brass hover:text-brass" : "cursor-not-allowed border-line text-stone/30 line-through"}`}>{slot.time}</button>
                ))}
              </div>
            )}
            {!loadingSlots && !slotError && slots.length > 0 && !hasAvailability && <p className="mt-4 text-sm text-brass">Plus de créneau disponible ce jour-là pour cette prestation. Essayez une autre date.</p>}
          </div>
        )}

        {stepId === "details" && (
          <form onSubmit={submit}>
            <span className="eyebrow">{stepLabel}</span>
            <h3 className="display card-title mt-3">Vos coordonnées</h3>
            <p className="body-copy mt-3 text-sm">Aucun paiement en ligne. Le salon vous recontacte pour confirmer le rendez-vous.</p>
            {service && (
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border border-line bg-coal-3/60 px-4 py-3 text-sm">
                <span className="font-display uppercase tracking-wide">{service.name}</span>
                <span className="text-stone">{dateLabel} à {time}</span>
                <span className="ml-auto font-display text-brass">{formatPrice(service.price)}</span>
              </div>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="field-label" htmlFor={`booking-name-${variant}`}>Nom complet *</label><input id={`booking-name-${variant}`} name="name" className="field" required minLength={2} maxLength={120} autoComplete="name" placeholder="Prénom et nom" /></div>
              <div><label className="field-label" htmlFor={`booking-email-${variant}`}>E-mail *</label><input id={`booking-email-${variant}`} name="email" type="email" className="field" required maxLength={160} autoComplete="email" placeholder="vous@exemple.fr" /></div>
              <div><label className="field-label" htmlFor={`booking-phone-${variant}`}>Téléphone *</label><input id={`booking-phone-${variant}`} name="phone" type="tel" className="field" required minLength={6} maxLength={40} autoComplete="tel" placeholder="06 00 00 00 00" /></div>
              <div className="sm:col-span-2"><label className="field-label" htmlFor={`booking-notes-${variant}`}>Précision pour le barbier</label><textarea id={`booking-notes-${variant}`} name="notes" rows={3} maxLength={800} className="field resize-none" placeholder="Facultatif : longueur souhaitée, style, première visite…" /></div>
            </div>
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-stone">
              <input type="checkbox" checked={accepted} onChange={(event) => { setAccepted(event.target.checked); setError(""); }} className="mt-1 h-4 w-4 shrink-0 accent-[#d9a441]" />
              <span>J'accepte d'être recontacté par le salon au sujet de cette demande. Mes informations ne servent qu'à cela : <Link href="/politique-de-confidentialite" className="text-brass underline underline-offset-4 hover:text-brass-light">politique de confidentialité</Link>.</span>
            </label>
            {error && <p className="mt-4 text-sm text-red-300" role="alert">{error}</p>}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => setStepIndex(stepIndex - 1)} className="btn btn-outline"><ArrowLeft size={15} /> Retour</button>
              <button type="submit" disabled={status === "loading"} className="btn btn-primary">{status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Enregistrement…</> : <>Envoyer la demande <ArrowRight size={16} /></>}</button>
            </div>
          </form>
        )}

        {stepId !== "details" && (
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
            <button type="button" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0} className="btn btn-outline"><ArrowLeft size={15} /> Retour</button>
            <button type="button" onClick={() => setStepIndex(stepIndex + 1)} disabled={!canContinue} className="btn btn-primary">Continuer <ArrowRight size={15} /></button>
          </div>
        )}
      </div>

      {variant === "full" && (
        <aside className="h-fit space-y-5 lg:sticky lg:top-28">
          <div className="card-surface p-6">
            <span className="eyebrow">Récapitulatif</span>
            <h3 className="display mt-3 text-2xl">Votre rendez-vous</h3>
            <dl className="mt-6 space-y-4 text-sm">
              {hasBarbers && <div className="flex items-start justify-between gap-4 border-b border-line pb-4"><dt className="flex items-center gap-2 text-stone"><User size={15} className="text-brass" /> Barbier</dt><dd className="text-right font-medium">{barber?.name ?? "Premier disponible"}</dd></div>}
              <div className="flex items-start justify-between gap-4 border-b border-line pb-4"><dt className="flex items-center gap-2 text-stone"><Scissors size={15} className="text-brass" /> Prestation</dt><dd className="max-w-[55%] text-right font-medium">{service?.name ?? "À choisir"}</dd></div>
              <div className="flex items-start justify-between gap-4 border-b border-line pb-4"><dt className="flex items-center gap-2 text-stone"><CalendarDays size={15} className="text-brass" /> Date & heure</dt><dd className="text-right font-medium">{service && time ? <>{dateLabel}<span className="mt-1 block text-brass">à {time}</span></> : "À choisir"}</dd></div>
              <div className="flex items-center justify-between gap-4"><dt className="flex items-center gap-2 text-stone"><Clock size={15} className="text-brass" /> Durée</dt><dd className="font-medium">{service ? formatDuration(service.duration) : "—"}</dd></div>
              <div className="flex items-center justify-between gap-4 border-t border-line pt-4"><dt className="font-display uppercase tracking-wider">Tarif indicatif</dt><dd className="font-display text-2xl text-brass">{service ? formatPrice(service.price) : "—"}</dd></div>
            </dl>
          </div>
          <div className="border border-line bg-coal-3/50 p-6 text-sm text-stone">
            <Info size={19} className="mb-3 text-brass" />
            <p className="leading-relaxed">Votre réservation est une demande : elle devient définitive lorsque le salon vous la confirme. Le règlement s'effectue sur place.</p>
            {brand.phone && brand.phoneHref && <a href={brand.phoneHref} className="mt-4 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-brass hover:text-brass-light"><Phone size={14} /> {brand.phone}</a>}
          </div>
        </aside>
      )}
    </div>
  );
}
