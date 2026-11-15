import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, CalendarDays, Navigation, TrainFront } from "lucide-react";
import { CTABand, PhoneButton, VisitSection } from "@/components/sections";
import { ButtonLink, PageHero, Reveal, SectionHeading } from "@/components/ui";
import { brand, images, openDaysLabel, transport } from "@/lib/data";

export const metadata: Metadata = { title: "Localisation", description: `${brand.name}, ${brand.address} : adresse, horaires, plan d'accès et transports (Edgar Quinet, Vavin, Montparnasse – Bienvenüe).` };

export default function LocalisationPage() {
  return (
    <>
      <PageHero eyebrow={`${brand.district} · ${brand.quarter}`} title="Localisation" description={`${brand.name} se trouve au ${brand.address}, dans le quartier du ${brand.quarter}, entre les stations Edgar Quinet et Vavin.`} image={images.salon} imageAlt="Fauteuils de barbier, miroirs et mur de briques">
        <ButtonLink href={brand.mapsUrl} variant="primary">Itinéraire <ArrowUpRight size={15} /></ButtonLink>
        <PhoneButton />
      </PageHero>

      <VisitSection showHeading={false} tone="bg-coal" />

      <section className="section-pad border-t border-line bg-coal-2">
        <div className="site-container">
          <SectionHeading eyebrow="Informations pratiques" title={<>Venir jusqu'à <span className="text-brass">nous.</span></>} description="La rue Delambre relie le boulevard du Montparnasse au boulevard Edgar-Quinet : le salon est à quelques minutes à pied des transports du quartier." />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <Reveal className="card-surface p-7 lg:col-span-2">
              <span className="flex h-12 w-12 items-center justify-center border border-brass/50 text-brass"><TrainFront size={22} /></span>
              <h3 className="display mt-7 text-2xl">Transports à proximité</h3>
              <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
                {transport.map((stop) => (
                  <li key={stop.name} className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-sm">
                    <span><span className="mr-2 text-[.62rem] font-semibold uppercase tracking-[.16em] text-brass">{stop.mode}</span><span className="text-cream">{stop.name}</span></span>
                    <span className="shrink-0 text-right text-stone">{stop.detail}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={80} className="card-surface flex flex-col p-7">
              <span className="flex h-12 w-12 items-center justify-center border border-brass/50 text-brass"><Navigation size={22} /></span>
              <h3 className="display mt-7 text-2xl">Itinéraire</h3>
              <p className="body-copy mt-3 flex-1 text-sm">Ouvrez l'adresse dans votre application de cartographie pour calculer votre trajet.</p>
              <div className="mt-6 flex flex-col gap-2">
                <a href={brand.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-dark">Google Maps <ArrowUpRight size={15} /></a>
                <a href={brand.osmUrl} target="_blank" rel="noreferrer" className="btn btn-dark">OpenStreetMap <ArrowUpRight size={15} /></a>
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-5 border border-line bg-coal p-6">
            <div className="flex items-start gap-4"><CalendarDays size={24} className="mt-1 shrink-0 text-brass" /><div><h3 className="display text-xl">Avant de venir</h3><p className="body-copy mt-1 max-w-2xl text-sm">{openDaysLabel}. Pour être sûr d'avoir votre place, réservez votre créneau en ligne ou appelez le salon.</p></div></div>
            <ButtonLink href="/reservation" variant="primary" className="shrink-0">Réserver <ArrowRight size={15} /></ButtonLink>
          </Reveal>
        </div>
      </section>

      <CTABand eyebrow="On vous attend" title="Rendez-vous rue Delambre." text="Réservez un créneau en ligne, ou appelez le salon pour toute question avant votre venue." href="/reservation" action="Choisir un créneau" />
    </>
  );
}
