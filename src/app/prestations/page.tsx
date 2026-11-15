import type { Metadata } from "next";
import { ArrowRight, Check, MessageCircle, Scissors } from "lucide-react";
import FAQ from "@/components/faq";
import { CTABand } from "@/components/sections";
import ServicesCatalog from "@/components/services-catalog";
import { ButtonLink, PageHero, Reveal, SectionHeading } from "@/components/ui";
import { brand, formatDuration, formatPrice, getService, images } from "@/lib/data";

export const metadata: Metadata = { title: "Prestations & tarifs", description: `Coupe homme, dégradé, taille de barbe et rasage chez ${brand.name}, ${brand.address} : tarifs indicatifs, durées et questions fréquentes.` };

const included = [
  { icon: <MessageCircle size={22} />, title: "On en parle d'abord", text: "Longueur, style, entretien : quelques mots avant de commencer pour partir sur la bonne coupe." },
  { icon: <Scissors size={22} />, title: "Des finitions nettes", text: "Nuque, pattes et contours sont repris en fin de prestation." },
  { icon: <Check size={22} />, title: "Un prix clair", text: "Le tarif vous est confirmé au salon avant de commencer." },
];

export default function PrestationsPage() {
  const formula = getService("coupe-barbe");

  return (
    <>
      <PageHero eyebrow="La carte" title="Prestations" description="Coupe homme, dégradé, barbe et rasage : des prestations simples, à prix doux. Filtrez par famille, comparez les durées et réservez en ligne." image={images.coupe} imageAlt="Coupe texturée travaillée au peigne">
        <ButtonLink href="/reservation" variant="primary">Réserver <ArrowRight size={15} /></ButtonLink>
        <ButtonLink href="#faq" variant="outline">Questions fréquentes</ButtonLink>
      </PageHero>

      <section className="section-pad bg-coal">
        <div className="site-container">
          <SectionHeading eyebrow="Tarifs & durées" title={<>Choisissez votre <span className="text-brass">prestation.</span></>} description="Cliquez sur le nom d'une prestation pour ouvrir directement la réservation sur le bon service." />
          <div className="mt-12"><ServicesCatalog /></div>
          {formula && (
            <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-5 border border-brass/30 bg-[#171208] p-6">
              <div><span className="eyebrow">La formule complète</span><h3 className="display mt-2 text-2xl">{formula.name} · {formatDuration(formula.duration)} · {formatPrice(formula.price)}</h3></div>
              <ButtonLink href={`/reservation?service=${formula.id}`} variant="primary">Réserver cette formule</ButtonLink>
            </Reveal>
          )}
        </div>
      </section>

      <section className="section-tight border-y border-line bg-coal-2">
        <div className="site-container">
          <div className="grid gap-px border border-line bg-line md:grid-cols-3">
            {included.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="bg-coal-2 p-7 sm:p-9">
                <span className="flex h-12 w-12 items-center justify-center border border-brass/50 text-brass">{item.icon}</span>
                <h3 className="display mt-7 text-2xl">{item.title}</h3>
                <p className="body-copy mt-3 text-sm">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section-pad bg-coal">
        <div className="site-container">
          <SectionHeading eyebrow="Bon à savoir" title={<>Questions <span className="text-brass">fréquentes.</span></>} align="center" description="Rendez-vous, tarifs, horaires et accès : l'essentiel avant de venir." />
          <div className="mt-12"><FAQ /></div>
        </div>
      </section>

      <CTABand eyebrow="Prêt ?" title="Une coupe nette commence par un créneau." text="Choisissez votre prestation, votre jour et votre heure en moins d'une minute." href="/reservation" action="Réserver en ligne" />
    </>
  );
}
