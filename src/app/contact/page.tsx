import type { Metadata } from "next";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/contact-form";
import MapEmbed from "@/components/map-embed";
import { CTABand, HoursTable, PhoneButton } from "@/components/sections";
import { ButtonLink, PageHero, Reveal } from "@/components/ui";
import { brand, images } from "@/lib/data";

export const metadata: Metadata = { title: "Contact", description: `Contacter ${brand.name} : formulaire, téléphone, adresse (${brand.address}) et horaires d'ouverture.` };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <>
      <PageHero eyebrow="Parlons-nous" title="Contact" description="Une question sur une prestation, un rendez-vous à modifier, une demande concernant vos données : écrivez-nous ou appelez le salon." image={images.tondeuse} imageAlt="Finition de la nuque à la tondeuse">
        <PhoneButton variant="primary" label="Appeler le salon" />
        <ButtonLink href="#formulaire" variant="outline">Écrire un message <ArrowRight size={15} /></ButtonLink>
      </PageHero>

      <section id="formulaire" className="section-pad bg-coal">
        <div className="site-container grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
          <Reveal><ContactForm initialTopic={first(params.objet)} /></Reveal>
          <Reveal delay={120} className="space-y-5">
            <div className="card-surface p-7">
              <span className="eyebrow">Coordonnées</span>
              <h2 className="display mt-3 text-3xl">Le salon</h2>
              <div className="mt-7 space-y-5 text-sm">
                <a href={brand.mapsUrl} target="_blank" rel="noreferrer" className="flex items-start gap-4 border-b border-line pb-5 transition-colors hover:text-brass"><MapPin size={19} className="mt-0.5 shrink-0 text-brass" /><span><span className="block text-xs uppercase tracking-widest text-stone">Adresse</span><span className="mt-1 block">{brand.address}</span></span></a>
                {brand.phone && brand.phoneHref && <a href={brand.phoneHref} className={`flex items-start gap-4 transition-colors hover:text-brass ${brand.email ? "border-b border-line pb-5" : ""}`}><Phone size={19} className="mt-0.5 shrink-0 text-brass" /><span><span className="block text-xs uppercase tracking-widest text-stone">Téléphone</span><span className="mt-1 block">{brand.phone}</span></span></a>}
                {brand.email && <a href={`mailto:${brand.email}`} className="flex items-start gap-4 transition-colors hover:text-brass"><Mail size={19} className="mt-0.5 shrink-0 text-brass" /><span><span className="block text-xs uppercase tracking-widest text-stone">E-mail</span><span className="mt-1 block">{brand.email}</span></span></a>}
              </div>
            </div>
            <HoursTable />
            <div className="overflow-hidden border border-line"><MapEmbed /></div>
            <ButtonLink href="/localisation" variant="outline" className="w-full">Plan d'accès et transports <ArrowRight size={15} /></ButtonLink>
          </Reveal>
        </div>
      </section>

      <CTABand eyebrow="Plus rapide" title="Pour un rendez-vous, réservez en ligne." text="Choisissez la prestation, le jour et l'heure : votre demande est enregistrée en moins d'une minute." href="/reservation" action="Voir les créneaux" />
    </>
  );
}
