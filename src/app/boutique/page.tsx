import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CTABand } from "@/components/sections";
import { GiftCardSection, ProductShelf } from "@/components/shop";
import { ButtonLink, PageHero, Reveal, SectionHeading } from "@/components/ui";
import { brand, images } from "@/lib/data";

export const metadata: Metadata = { title: "Boutique", description: `Produits de coiffage, soins pour la barbe et cartes cadeaux ${brand.name} : demande en ligne, retrait et paiement au salon.` };

const steps = [
  { title: "Ajoutez au panier", text: "Produits et cartes cadeaux se retrouvent dans le panier, accessible en haut de chaque page." },
  { title: "Validez votre demande", text: "Nom, e-mail et téléphone suffisent. Aucun paiement n'est effectué en ligne." },
  { title: "Retirez au salon", text: `Le salon vous recontacte, puis vous réglez sur place au ${brand.address}.` },
];

export default function BoutiquePage() {
  return (
    <>
      <PageHero eyebrow="L'étagère" title="Boutique" description="De quoi entretenir la coupe et la barbe entre deux passages, et des cartes cadeaux à offrir. Vous préparez votre demande en ligne, vous réglez au salon." image={images.produits} imageAlt="Produits de coiffage, ciseaux, tondeuses et peigne">
        <ButtonLink href="#produits" variant="primary">Voir les produits <ArrowRight size={15} /></ButtonLink>
        <ButtonLink href="#cartes-cadeaux" variant="outline">Cartes cadeaux</ButtonLink>
      </PageHero>

      <section id="produits" className="section-pad bg-coal">
        <div className="site-container">
          <SectionHeading eyebrow="Produits" title={<>L'essentiel, <span className="text-brass">rien de plus.</span></>} description="Coiffage, barbe et accessoires. Filtrez par famille puis ajoutez au panier ce que vous souhaitez retirer au salon." />
          <div className="mt-12"><ProductShelf /></div>
        </div>
      </section>

      <section className="section-tight border-y border-line bg-coal-2">
        <div className="site-container">
          <div className="grid gap-px border border-line bg-line md:grid-cols-3">
            {steps.map((item, index) => (
              <Reveal key={item.title} delay={index * 70} className="bg-coal-2 p-7 sm:p-9">
                <span className="font-display text-4xl text-brass/80">0{index + 1}</span>
                <h3 className="display mt-5 text-2xl">{item.title}</h3>
                <p className="body-copy mt-3 text-sm">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="cartes-cadeaux" className="section-pad bg-coal">
        <div className="site-container"><GiftCardSection /></div>
      </section>

      <CTABand eyebrow="Déjà sur place ?" title="Demandez conseil au fauteuil." text="Le plus simple reste d'en parler pendant votre coupe : réservez un créneau et repartez avec le bon produit." href="/reservation" action="Réserver un créneau" />
    </>
  );
}
