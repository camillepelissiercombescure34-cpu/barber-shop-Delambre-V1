import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { CraftGrid, CTABand, TeamSection } from "@/components/sections";
import { ButtonLink, PageHero, Reveal, SectionHeading } from "@/components/ui";
import { brand, images } from "@/lib/data";

export const metadata: Metadata = { title: "Savoir-faire", description: `Dégradés, coupes aux ciseaux, barbes et finitions : le savoir-faire de ${brand.name}, barbier à ${brand.district}.` };

const method = [
  { title: "On en parle d'abord", text: "Longueur, style, entretien au quotidien : quelques mots avant de commencer pour partir sur la bonne coupe." },
  { title: "On coupe avec méthode", text: "La tondeuse pour la structure, les ciseaux pour le détail, le peigne pour vérifier chaque ligne." },
  { title: "On soigne la sortie", text: "Nuque, pattes et contours sont repris avant de vous rendre le miroir." },
];

const tools = ["Tondeuse et sabots pour les dégradés", "Ciseaux droits et sculpteurs", "Rasoir pour les contours et le rasage", "Peigne et brosse pour les finitions"];

export default function SavoirFairePage() {
  return (
    <>
      <PageHero eyebrow="Le métier" title="Savoir-faire" description="Un barbier, ce sont d'abord des gestes : fondre un dégradé, travailler une mèche aux ciseaux, dessiner une barbe, finir une nuque. Voici ceux que nous pratiquons chaque jour." image={images.degrade} imageAlt="Dégradé en cours de réalisation, contour tracé au rasoir">
        <ButtonLink href="/reservation" variant="primary">Réserver un créneau <ArrowRight size={15} /></ButtonLink>
        <ButtonLink href="/prestations" variant="outline">Voir les tarifs</ButtonLink>
      </PageHero>

      <section className="section-pad bg-coal">
        <div className="site-container">
          <SectionHeading eyebrow="Spécialités" title={<>Quatre <span className="text-brass">gestes.</span></>} description="Chaque carte renvoie vers la prestation correspondante : choisissez la vôtre et réservez directement." />
          <div className="mt-12"><CraftGrid /></div>
        </div>
      </section>

      <TeamSection />

      <section className="section-pad border-y border-line bg-coal-2">
        <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-[560px] lg:mx-0">
            <div className="relative aspect-square overflow-hidden border border-line">
              <img src={images.barbe} alt="Taille de barbe aux ciseaux" loading="lazy" className="h-full w-full object-cover" />
              <div className="image-shade absolute inset-0" aria-hidden="true" />
              <div className="absolute bottom-6 left-6 border-l-2 border-brass pl-4"><span className="block font-display text-xl uppercase tracking-widest">La main, puis l'œil</span><span className="text-sm text-cream/70">Couper, vérifier, reprendre</span></div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <span className="eyebrow">Notre façon de travailler</span>
            <h2 className="display section-title mt-5">Écouter, couper, <span className="text-brass">finir.</span></h2>
            <ol className="mt-8 space-y-6">
              {method.map((step, index) => (
                <li key={step.title} className="flex gap-5 border-b border-line pb-6 last:border-0 last:pb-0">
                  <span className="font-display text-3xl text-brass/80">0{index + 1}</span>
                  <div><h3 className="font-display text-xl uppercase tracking-wide">{step.title}</h3><p className="body-copy mt-2 text-sm">{step.text}</p></div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-coal">
        <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="eyebrow">Les outils</span>
            <h2 className="display section-title mt-5">Le bon outil, <span className="text-brass">au bon moment.</span></h2>
            <p className="body-copy mt-6">Une coupe réussie tient autant au geste qu'à l'outil choisi pour le faire. Chaque étape a le sien.</p>
            <ul className="mt-8 space-y-3">
              {tools.map((item) => <li key={item} className="flex items-start gap-3 text-sm text-cream/85"><Check size={17} className="mt-0.5 shrink-0 text-brass" />{item}</li>)}
            </ul>
            <div className="mt-9"><ButtonLink href="/boutique" variant="outline">Voir la boutique <ArrowRight size={15} /></ButtonLink></div>
          </Reveal>
          <Reveal delay={100} className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
            <div className="relative aspect-square overflow-hidden border border-line">
              <img src={images.produits} alt="Ciseaux, tondeuses, peigne et produits de coiffage" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <span className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 border-b-2 border-r-2 border-brass" aria-hidden="true" />
          </Reveal>
        </div>
      </section>

      <CTABand eyebrow="À vous" title="Le geste se juge sur le fauteuil." text="Choisissez une prestation et un créneau : on s'occupe du reste." href="/reservation" action="Réserver un créneau" />
    </>
  );
}
