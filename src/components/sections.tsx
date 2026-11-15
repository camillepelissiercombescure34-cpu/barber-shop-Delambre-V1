import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock, MapPin, MessageCircle, Phone, TrainFront, Wallet } from "lucide-react";
import MapEmbed from "@/components/map-embed";
import { ButtonLink, Reveal, SectionHeading, TextArrow } from "@/components/ui";
import { barbers, brand, crafts, formatDuration, formatPrice, formatRanges, hoursNotice, images, pricesNotice, services, values, weeklyHours, type Service } from "@/lib/data";

/** Bouton d'appel : masqué automatiquement tant qu'aucun numéro n'est renseigné. */
export function PhoneButton({ variant = "outline", label, className = "" }: { variant?: "primary" | "outline" | "dark"; label?: ReactNode; className?: string }) {
  if (!brand.phone || !brand.phoneHref) return null;
  return <a href={brand.phoneHref} className={`btn btn-${variant} ${className}`}><Phone size={15} /> {label ?? brand.phone}</a>;
}

export function PriceNotice({ className = "" }: { className?: string }) {
  return <p className={`text-xs uppercase tracking-[.16em] text-stone ${className}`}>{pricesNotice}</p>;
}

export function ServiceRow({ service, delay = 0 }: { service: Service; delay?: number }) {
  return (
    <Reveal delay={delay} className="border-b border-line py-6 md:py-7">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-xl uppercase tracking-[.02em] text-cream sm:text-2xl"><Link href={`/reservation?service=${service.id}`} className="transition-colors hover:text-brass">{service.name}</Link></h3>
            {service.tag && <span className="shrink-0 border border-brass/50 px-2 py-1 text-[.55rem] font-semibold uppercase tracking-[.15em] text-brass">{service.tag}</span>}
          </div>
          <p className="body-copy mt-2 max-w-xl text-sm">{service.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="block font-display text-2xl text-brass sm:text-3xl">{formatPrice(service.price)}</span>
          <span className="mt-1 flex items-center justify-end gap-1 text-xs uppercase tracking-widest text-stone"><Clock size={12} /> {formatDuration(service.duration)}</span>
        </div>
      </div>
    </Reveal>
  );
}

export function ServiceList({ items = services }: { items?: Service[] }) {
  const midpoint = Math.ceil(items.length / 2);
  return (
    <div className="grid gap-x-12 lg:grid-cols-2">
      {[items.slice(0, midpoint), items.slice(midpoint)].map((column, columnIndex) => (
        <div key={columnIndex}>{column.map((service, index) => <ServiceRow key={service.id} service={service} delay={(columnIndex * midpoint + index) * 45} />)}</div>
      ))}
    </div>
  );
}

/** Rangée de quatre cartes « portrait » : les gestes du métier, sans personne inventée. */
export function CraftGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {crafts.map((craft, index) => (
        <Reveal key={craft.id} delay={index * 70} className="group h-full">
          <article className="card-surface flex h-full flex-col overflow-hidden transition-colors hover:border-brass/50">
            <div className="hover-zoom relative aspect-[4/5] overflow-hidden bg-coal-3 sm:aspect-square xl:aspect-[4/5]">
              <img src={craft.image} alt={craft.alt} loading="lazy" className="h-full w-full object-cover" />
              <div className="image-shade absolute inset-0" aria-hidden="true" />
              <span className="absolute left-4 top-4 border border-brass/70 bg-coal/75 px-3 py-1 font-display text-xs uppercase tracking-widest text-brass">0{index + 1}</span>
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <span className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-brass">{craft.tag}</span>
              <h3 className="display mt-2 text-2xl sm:text-3xl">{craft.title}</h3>
              <p className="body-copy mt-3 flex-1 text-sm">{craft.text}</p>
              <div className="mt-6 border-t border-line pt-5"><TextArrow href={`/reservation?service=${craft.serviceId}`}>Réserver</TextArrow></div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/** N'apparaît que lorsque de vrais membres de l'équipe sont renseignés dans `src/lib/data.ts`. */
export function TeamSection() {
  if (barbers.length === 0) return null;
  return (
    <section className="section-pad border-t border-line bg-coal-2">
      <div className="site-container">
        <SectionHeading eyebrow="L'équipe" title={<>Vos <span className="text-brass">barbiers.</span></>} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {barbers.map((barber, index) => (
            <Reveal key={barber.id} delay={index * 70} className="h-full">
              <article className="card-surface flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[4/5] overflow-hidden bg-coal-3"><img src={barber.image} alt={`Portrait de ${barber.name}`} loading="lazy" className="h-full w-full object-cover" /></div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <span className="text-[.65rem] font-semibold uppercase tracking-[.18em] text-brass">{barber.specialty}</span>
                  <h3 className="display mt-2 text-2xl">{barber.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-stone">{barber.role}</p>
                  <p className="body-copy mt-3 flex-1 text-sm">{barber.bio}</p>
                  <div className="mt-6 border-t border-line pt-5"><TextArrow href={`/reservation?barber=${barber.id}`}>Réserver</TextArrow></div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ValuesGrid() {
  const icons = [<Wallet key="price" size={22} />, <CalendarDays key="days" size={22} />, <MapPin key="place" size={22} />];
  return (
    <div className="grid gap-px border border-line bg-line md:grid-cols-3">
      {values.map((value, index) => (
        <Reveal key={value.number} delay={index * 80} className="bg-coal p-7 md:p-9">
          <div className="flex items-center justify-between"><span className="flex h-12 w-12 items-center justify-center border border-brass/50 text-brass">{icons[index]}</span><span className="font-display text-4xl text-cream/10">{value.number}</span></div>
          <h3 className="display mt-8 text-2xl">{value.title}</h3>
          <p className="body-copy mt-3 text-sm">{value.text}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function HoursTable() {
  return (
    <div className="card-surface p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3"><Clock size={20} className="text-brass" /><h3 className="display text-2xl">Horaires d'ouverture</h3></div>
      <table className="w-full text-sm" aria-label="Horaires d'ouverture">
        <tbody>
          {weeklyHours.map((row) => (
            <tr key={row.day} className="border-b border-line last:border-0">
              <th scope="row" className="py-3.5 pr-4 text-left align-top font-normal text-stone">{row.day}</th>
              <td className={`py-3.5 text-right ${row.ranges.length === 0 ? "text-brass" : "font-medium text-cream"}`}>{formatRanges(row.ranges)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-stone">{hoursNotice}</p>
    </div>
  );
}

export function VisitSection({ showHeading = true, tone = "bg-coal-2" }: { showHeading?: boolean; tone?: string }) {
  return (
    <section className={`section-pad ${tone}`} id="acces">
      <div className="site-container">
        {showHeading && <SectionHeading eyebrow="Nous trouver" title={<>Horaires <span className="text-brass">& adresse.</span></>} description={`Au ${brand.address}, dans le quartier du ${brand.quarter}, entre les stations Edgar Quinet et Vavin.`} />}
        <div className={`grid gap-6 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] ${showHeading ? "mt-12" : ""}`}>
          <Reveal><HoursTable /></Reveal>
          <Reveal delay={100} className="flex flex-col gap-5">
            <div className="relative min-h-[330px] flex-1 overflow-hidden border border-line bg-coal-3"><MapEmbed /></div>
            <div className="card-surface grid gap-5 p-6 sm:grid-cols-3">
              <div className="flex items-start gap-3"><MapPin size={18} className="mt-1 shrink-0 text-brass" /><div><span className="font-display text-sm uppercase tracking-wider">Adresse</span><p className="mt-1 text-sm leading-relaxed text-stone">{brand.street}<br />{brand.postalCode} {brand.city}</p></div></div>
              {brand.phone && brand.phoneHref && <div className="flex items-start gap-3"><Phone size={18} className="mt-1 shrink-0 text-brass" /><div><span className="font-display text-sm uppercase tracking-wider">Téléphone</span><a href={brand.phoneHref} className="mt-1 block text-sm text-stone transition-colors hover:text-cream">{brand.phone}</a></div></div>}
              <div className="flex items-start gap-3"><TrainFront size={18} className="mt-1 shrink-0 text-brass" /><div><span className="font-display text-sm uppercase tracking-wider">Métro</span><p className="mt-1 text-sm leading-relaxed text-stone">Edgar Quinet (6) · Vavin (4)</p></div></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={brand.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-dark">Itinéraire <ArrowUpRight size={15} /></a>
              <ButtonLink href="/localisation" variant="outline">Informations pratiques <ArrowRight size={15} /></ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Aucun témoignage n'est inventé : on renvoie vers les avis réellement publiés. */
export function ReviewsInvite() {
  return (
    <section className="section-pad border-t border-line bg-[#100e0b]">
      <div className="site-container grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
        <Reveal>
          <span className="eyebrow">Avis clients</span>
          <h2 className="display section-title mt-5">Votre avis <span className="text-brass">compte.</span></h2>
          <p className="body-copy mt-5 max-w-2xl">Plutôt que de sélectionner des témoignages, nous vous renvoyons vers les avis publiés par nos clients sur Google. Lisez-les librement — et laissez le vôtre après votre passage.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={brand.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-primary">Voir les avis sur Google <ArrowUpRight size={16} /></a>
            <ButtonLink href="/contact" variant="outline">Nous faire un retour</ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={100} className="card-surface p-7 sm:p-9">
          <span className="flex h-12 w-12 items-center justify-center border border-brass/50 text-brass"><MessageCircle size={22} /></span>
          <p className="display mt-6 text-2xl leading-snug">Un mot après votre coupe ?</p>
          <p className="body-copy mt-3 text-sm">Satisfait ou non, dites-le-nous : vos retours nous aident à progresser et guident les prochains clients.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function CTABand({ eyebrow = "Une question ?", title = "Parlons de votre prochaine coupe.", text = "Écrivez-nous ou appelez le salon : un message suffit pour préparer votre venue.", href = "/contact", action = "Nous écrire" }: { eyebrow?: string; title?: string; text?: string; href?: string; action?: string }) {
  return (
    <section className="relative isolate overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url('${images.hero}')` }} aria-hidden="true" />
      <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />
      <div className="site-container">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="display section-title mt-5">{title}</h2>
          <p className="body-copy mt-5 max-w-xl">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3"><ButtonLink href={href} variant="primary">{action} <ArrowRight size={16} /></ButtonLink><PhoneButton /></div>
        </Reveal>
      </div>
    </section>
  );
}
