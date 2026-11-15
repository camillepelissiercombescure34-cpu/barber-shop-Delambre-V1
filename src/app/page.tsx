import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import BookingFlow from "@/components/booking-flow";
import Gallery from "@/components/gallery";
import { CraftGrid, CTABand, PhoneButton, PriceNotice, ReviewsInvite, ServiceList, TeamSection, ValuesGrid, VisitSection } from "@/components/sections";
import { ProductShelf } from "@/components/shop";
import { ButtonLink, Reveal, SectionHeading, TextArrow } from "@/components/ui";
import { barbers, brand, formatDuration, formatPrice, getService, highlights, images, openDaysLabel } from "@/lib/data";

const presentationPoints = [
  "Coupe homme, dégradé, taille de barbe et rasage",
  "Des tarifs accessibles",
  openDaysLabel,
  brand.phone ? "Réservation en ligne ou par téléphone" : "Réservation en ligne",
];

const bookingSteps = [
  ...(barbers.length > 0 ? [{ title: "Choisissez votre barbier", text: "Un nom en particulier, ou le premier disponible." }] : []),
  { title: "Choisissez la prestation", text: "Coupe, dégradé, barbe ou rasage : durée et tarif sont affichés." },
  { title: "Choisissez le créneau", text: "Seuls les horaires encore libres peuvent être sélectionnés." },
  { title: "Laissez vos coordonnées", text: "Sans compte client ni paiement en ligne." },
  { title: "Le salon confirme", text: "Vous êtes recontacté pour valider le rendez-vous." },
];

export default function HomePage() {
  const formula = getService("coupe-barbe");

  return (
    <>
      {/* HERO */}
      <section className="relative isolate min-h-[100svh] overflow-hidden" id="top">
        <div className="slow-pan absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url('${images.hero}')` }} aria-hidden="true" />
        <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />
        <div className="grain pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="site-container flex min-h-[100svh] flex-col pb-8 pt-[84px]">
          <Reveal className="my-auto max-w-5xl py-10">
            <span className="inline-flex items-center gap-3 rounded-full border border-brass/50 bg-black/25 px-4 py-2 text-[.62rem] font-semibold uppercase tracking-[.2em] text-brass sm:text-[.7rem]">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brass" /> Barbier · {brand.district} · {brand.quarter}
            </span>
            <h1 className="display hero-title mt-7 text-cream md:mt-9">Barbes soignées.<br />Coupes nettes.<br /><span className="text-brass">Prix justes.</span></h1>
            <p className="body-copy mt-7 max-w-xl sm:text-lg">{brand.name} vous accueille au {brand.address}, à deux pas de Montparnasse : coupe homme, dégradé, taille de barbe et rasage, à prix doux.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/reservation" variant="primary">Réserver un créneau <ArrowRight size={16} /></ButtonLink>
              <ButtonLink href="#prestations" variant="outline">Voir les tarifs</ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={250} className="grid grid-cols-2 gap-y-6 border-t border-white/20 pt-8 md:grid-cols-4 md:pt-10">
            {highlights.map((item) => (
              <div key={item.label} className="pr-4 md:border-l md:border-white/15 md:pl-8 md:first:border-0 md:first:pl-0">
                <p className="display text-3xl text-brass sm:text-4xl">{item.value}</p>
                <p className="mt-1 text-[.62rem] uppercase tracking-[.18em] text-cream/65 sm:text-xs">{item.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* PRÉSENTATION */}
      <section className="section-pad bg-coal">
        <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-[560px] lg:mx-0">
            <div className="relative aspect-square overflow-hidden border border-line">
              <img src={images.salon} alt="Fauteuils de barbier, miroirs et mur de briques dans une ambiance tamisée" loading="lazy" className="h-full w-full object-cover" />
              <div className="image-shade absolute inset-0" aria-hidden="true" />
              <div className="absolute bottom-6 left-6 border-l-2 border-brass pl-4"><span className="block font-display text-xl uppercase tracking-widest">L'esprit barber</span><span className="text-sm text-cream/70">{brand.street} · {brand.district}</span></div>
            </div>
            <span className="display pointer-events-none absolute -bottom-7 right-2 text-[6rem] leading-none text-brass/20 md:text-[9rem]" aria-hidden="true">32</span>
          </Reveal>
          <Reveal delay={100}>
            <span className="eyebrow">Le salon</span>
            <h2 className="display section-title mt-5">Un barbier de quartier, <span className="text-brass">sans chichis.</span></h2>
            <p className="body-copy mt-6">Au {brand.street}, entre Vavin et Edgar Quinet, {brand.name} est une adresse simple et directe : on s'installe, on explique ce que l'on veut, et l'on repart avec une coupe propre.</p>
            <p className="body-copy mt-4">Dégradés, coupes classiques, barbes et rasages : l'essentiel, bien fait, à des tarifs accessibles.</p>
            <ul className="mt-8 space-y-3">
              {presentationPoints.map((item) => <li key={item} className="flex items-start gap-3 text-sm text-cream/85"><Check size={17} className="mt-0.5 shrink-0 text-brass" />{item}</li>)}
            </ul>
            <div className="mt-9"><TextArrow href="/a-propos">En savoir plus sur le salon</TextArrow></div>
          </Reveal>
        </div>
      </section>

      {/* PRESTATIONS */}
      <section id="prestations" className="section-pad border-t border-line bg-coal-2">
        <div className="site-container">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="La carte" title={<>Prestations <span className="text-brass">& tarifs.</span></>} description="Des prestations simples et des prix doux. Cliquez sur une prestation pour la réserver directement." />
            <Reveal className="shrink-0"><ButtonLink href="/prestations" variant="outline">Toutes les prestations <ArrowRight size={15} /></ButtonLink></Reveal>
          </div>
          <div className="mt-12"><ServiceList /></div>
          <PriceNotice className="mt-6" />
          {formula && (
            <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-line bg-coal-3/50 p-5 sm:p-6">
              <p className="text-sm text-stone"><span className="font-display uppercase tracking-wider text-cream">{formula.name}</span> · la formule complète · {formatDuration(formula.duration)} · {formatPrice(formula.price)}</p>
              <ButtonLink href={`/reservation?service=${formula.id}`} variant="primary" className="min-h-0 px-5 py-2.5 text-[.65rem]">Réserver cette formule</ButtonLink>
            </Reveal>
          )}
        </div>
      </section>

      {/* SAVOIR-FAIRE */}
      <section className="section-pad bg-coal">
        <div className="site-container">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Spécialités" title={<>Le <span className="text-brass">savoir-faire.</span></>} description="Dégradés, ciseaux, barbes et finitions : les quatre gestes au cœur du métier de barbier." />
            <Reveal className="shrink-0"><TextArrow href="/savoir-faire">Découvrir le savoir-faire</TextArrow></Reveal>
          </div>
          <div className="mt-12"><CraftGrid /></div>
        </div>
      </section>

      <TeamSection />
      <Gallery />

      {/* RÉSERVATION */}
      <section id="reservation" className="section-pad border-y border-line bg-coal-2">
        <div className="site-container">
          <SectionHeading eyebrow="Réserver un créneau" title={<>Votre heure, <span className="text-brass">en quelques clics.</span></>} description="Aucun compte à créer, aucun paiement en ligne. Les créneaux déjà demandés ne sont plus proposés." />
          <div className="mt-12 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)]">
            <Reveal><BookingFlow variant="compact" /></Reveal>
            <Reveal delay={120} className="space-y-5">
              <div className="card-surface p-6 sm:p-8">
                <span className="eyebrow">Mode d'emploi</span>
                <h3 className="display mt-3 text-3xl">Comment ça marche</h3>
                <ol className="mt-8 space-y-6">
                  {bookingSteps.map((step, index) => (
                    <li key={step.title} className="flex gap-4 border-b border-line pb-5 last:border-0 last:pb-0">
                      <span className="font-display text-2xl text-brass/80">0{index + 1}</span>
                      <div><h4 className="font-display text-base uppercase tracking-wide">{step.title}</h4><p className="mt-1 text-sm leading-relaxed text-stone">{step.text}</p></div>
                    </li>
                  ))}
                </ol>
                {brand.phone && <div className="mt-8 border-t border-line pt-6"><p className="text-sm text-stone">Vous préférez réserver de vive voix ?</p><PhoneButton variant="dark" className="mt-4" /></div>}
              </div>
              <Link href="/reservation" className="btn btn-outline w-full">Ouvrir la page réservation <ArrowRight size={15} /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="section-pad bg-coal">
        <div className="site-container">
          <SectionHeading eyebrow={`Pourquoi ${brand.name}`} title={<>Simple, soigné, <span className="text-brass">accessible.</span></>} />
          <div className="mt-12"><ValuesGrid /></div>
        </div>
      </section>

      {/* BOUTIQUE */}
      <section className="section-pad border-t border-line bg-coal-2">
        <div className="site-container">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="La boutique" title={<>L'entretien <span className="text-brass">à la maison.</span></>} description="Coiffage, soin de la barbe et accessoires : ajoutez-les au panier et retirez-les au salon." />
            <Reveal className="shrink-0"><ButtonLink href="/boutique" variant="outline">Toute la boutique <ArrowRight size={15} /></ButtonLink></Reveal>
          </div>
          <div className="mt-12"><ProductShelf limit={3} showFilters={false} /></div>
        </div>
      </section>

      <VisitSection tone="bg-coal" />
      <ReviewsInvite />
      <CTABand eyebrow="Dernière ligne droite" title="Le fauteuil n'attend que vous." text="Réservez votre créneau en ligne ou appelez le salon : la coupe, on s'en occupe." href="/reservation" action="Choisir mon créneau" />
    </>
  );
}
