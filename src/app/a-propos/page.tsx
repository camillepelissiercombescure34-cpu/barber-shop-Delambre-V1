import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Gallery from "@/components/gallery";
import { CTABand, TeamSection, ValuesGrid } from "@/components/sections";
import { ButtonLink, PageHero, Reveal, SectionHeading } from "@/components/ui";
import { brand, highlights, images, openDaysLabel, transport } from "@/lib/data";

export const metadata: Metadata = { title: "À propos", description: `${brand.name}, barbier et coiffeur homme au ${brand.address} : le salon, son approche et son quartier.` };

const approach = [
  { title: "Écouter avant de couper", text: "Quelques questions sur ce que vous voulez et sur votre quotidien évitent les mauvaises surprises." },
  { title: "Soigner les finitions", text: "Une coupe se juge à la nuque, aux pattes et aux contours : on y revient avant de terminer." },
  { title: "Rester accessible", text: "Des prestations simples et des prix doux, pour que l'on puisse revenir aussi souvent que nécessaire." },
];

const facts = [
  "Coupe homme, dégradé, taille de barbe et rasage",
  "Des tarifs accessibles, affichés au salon",
  openDaysLabel,
  brand.phone ? "Réservation en ligne ou par téléphone" : "Réservation en ligne",
];

export default function AProposPage() {
  return (
    <>
      <PageHero eyebrow="Le salon" title="À propos" description={`${brand.name} est un salon de coiffure et de barbier pour hommes installé au ${brand.address}, dans le quartier du ${brand.quarter}.`} image={images.barbe} imageAlt="Taille de barbe aux ciseaux">
        <ButtonLink href="/reservation" variant="primary">Réserver un créneau <ArrowRight size={15} /></ButtonLink>
        <ButtonLink href="/savoir-faire" variant="outline">Notre savoir-faire</ButtonLink>
      </PageHero>

      <section className="section-pad bg-coal">
        <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="eyebrow">Présentation</span>
            <h2 className="display section-title mt-5">Un barbier de quartier, <span className="text-brass">à Montparnasse.</span></h2>
            <p className="body-copy mt-6">Notre idée du métier tient en peu de mots : écouter ce que vous voulez, couper proprement, soigner les finitions — et garder des prix accessibles.</p>
            <p className="body-copy mt-4">Que vous veniez pour un dégradé, une coupe aux ciseaux, une barbe à remettre en forme ou un rasage, vous savez à l'avance ce que vous demandez et ce que cela coûte.</p>
            <ul className="mt-8 space-y-3">
              {facts.map((item) => <li key={item} className="flex items-start gap-3 text-sm text-cream/85"><Check size={17} className="mt-0.5 shrink-0 text-brass" />{item}</li>)}
            </ul>
            <div className="mt-9"><ButtonLink href="/prestations" variant="outline">Voir les prestations <ArrowRight size={15} /></ButtonLink></div>
          </Reveal>
          <Reveal delay={100} className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
            <div className="relative aspect-square overflow-hidden border border-line">
              <img src={images.fauteuil} alt="Fauteuil de barbier en cuir capitonné" loading="lazy" className="h-full w-full object-cover" />
              <div className="image-shade absolute inset-0" aria-hidden="true" />
              <div className="absolute bottom-6 left-6 border-l-2 border-brass pl-4"><span className="block font-display text-xl uppercase tracking-widest">Prenez place</span><span className="text-sm text-cream/70">{brand.street} · {brand.district}</span></div>
            </div>
            <span className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 border-r-2 border-t-2 border-brass" aria-hidden="true" />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-brass/25 bg-[#171208] py-14">
        <div className="site-container grid grid-cols-2 gap-y-9 md:grid-cols-4">
          {highlights.map((item, index) => (
            <Reveal key={item.label} delay={index * 70} className="border-l border-brass/20 pl-5 sm:pl-8">
              <p className="display text-4xl text-brass sm:text-5xl">{item.value}</p>
              <p className="mt-2 text-[.62rem] uppercase tracking-[.18em] text-cream/65 sm:text-xs">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad bg-coal-2">
        <div className="site-container">
          <SectionHeading eyebrow="Notre approche" title={<>Trois <span className="text-brass">principes.</span></>} align="center" />
          <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
            {approach.map((item, index) => (
              <Reveal key={item.title} delay={index * 80} className="bg-coal-2 p-7 md:p-9">
                <span className="font-display text-4xl text-brass/80">0{index + 1}</span>
                <h3 className="display mt-5 text-2xl">{item.title}</h3>
                <p className="body-copy mt-3 text-sm">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-coal">
        <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-[560px] lg:mx-0">
            <div className="relative aspect-square overflow-hidden border border-line">
              <img src={images.salon} alt="Fauteuils de barbier, miroirs et mur de briques dans une ambiance tamisée" loading="lazy" className="h-full w-full object-cover" />
              <div className="image-shade absolute inset-0" aria-hidden="true" />
            </div>
            <span className="pointer-events-none absolute -bottom-3 -left-3 h-24 w-24 border-b-2 border-l-2 border-brass" aria-hidden="true" />
          </Reveal>
          <Reveal delay={100}>
            <span className="eyebrow">Le quartier</span>
            <h2 className="display section-title mt-5">Rue Delambre, <span className="text-brass">Paris 14e.</span></h2>
            <p className="body-copy mt-6">La rue Delambre relie le boulevard du Montparnasse au boulevard Edgar-Quinet. Le salon se trouve au numéro 32, à quelques minutes à pied des transports du quartier.</p>
            <ul className="mt-7 border-t border-line">
              {transport.map((stop) => (
                <li key={stop.name} className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-sm">
                  <span><span className="mr-2 text-[.62rem] font-semibold uppercase tracking-[.16em] text-brass">{stop.mode}</span><span className="text-cream">{stop.name}</span></span>
                  <span className="shrink-0 text-right text-stone">{stop.detail}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8"><ButtonLink href="/localisation" variant="outline">Horaires & plan d'accès <ArrowRight size={15} /></ButtonLink></div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad border-t border-line bg-coal-2">
        <div className="site-container">
          <SectionHeading eyebrow={`Pourquoi ${brand.name}`} title={<>Simple, soigné, <span className="text-brass">accessible.</span></>} />
          <div className="mt-12"><ValuesGrid /></div>
        </div>
      </section>

      <TeamSection />
      <Gallery />

      <CTABand eyebrow="Faites connaissance" title="Le mieux est encore de s'asseoir." text="Réservez un créneau et jugez sur pièce, du premier échange à la dernière finition." href="/reservation" action="Prendre rendez-vous" />
    </>
  );
}
