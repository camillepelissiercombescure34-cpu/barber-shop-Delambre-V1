import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Check, Clock, Scissors, User } from "lucide-react";
import BookingFlow from "@/components/booking-flow";
import { CTABand, PhoneButton } from "@/components/sections";
import { ButtonLink, PageHero, Reveal, SectionHeading } from "@/components/ui";
import { barbers, brand, getService, images, openDaysLabel } from "@/lib/data";

export const metadata: Metadata = { title: "Réservation", description: `Réservez un créneau chez ${brand.name}, ${brand.address} : prestation, date et heure en quelques étapes, sans paiement en ligne.` };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

const process = [
  ...(barbers.length > 0 ? [{ icon: <User size={20} />, title: "Le barbier", text: "Un nom en particulier, ou le premier disponible." }] : []),
  { icon: <Scissors size={20} />, title: "La prestation", text: "Durée et tarif indicatif connus avant de valider." },
  { icon: <CalendarDays size={20} />, title: "Le créneau", text: "Seuls les horaires encore libres sont sélectionnables." },
  { icon: <Check size={20} />, title: "La confirmation", text: "Le salon vous recontacte pour valider le rendez-vous." },
];

export default async function ReservationPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const barberParam = first(params.barber);
  const initialBarberId = barbers.some((barber) => barber.id === barberParam) ? barberParam : "";
  const initialServiceId = getService(first(params.service))?.id ?? "";

  return (
    <>
      <PageHero eyebrow="Prendre rendez-vous" title="Réservation" description={`Choisissez votre prestation et l'heure qui vous arrange. ${process.length} étapes, sans compte client ni paiement en ligne.`} image={images.fauteuil} imageAlt="Fauteuil de barbier en cuir capitonné">
        <ButtonLink href="#reserver" variant="primary">Choisir un créneau <ArrowRight size={15} /></ButtonLink>
        <PhoneButton />
      </PageHero>

      <section id="reserver" className="section-pad bg-coal">
        <div className="site-container">
          <div className="mb-12 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="En ligne" title={<>Votre créneau <span className="text-brass">en {process.length} étapes.</span></>} description="Les horaires déjà demandés ne sont plus proposés, et les créneaux passés sont automatiquement écartés." />
            <Reveal className="flex items-center gap-3 border border-line px-5 py-4 text-sm text-stone"><Clock size={18} className="shrink-0 text-brass" /> {openDaysLabel} · horaires détaillés sur la page Localisation</Reveal>
          </div>
          <BookingFlow variant="full" initialBarberId={initialBarberId} initialServiceId={initialServiceId} />
        </div>
      </section>

      <section className="section-tight border-y border-line bg-coal-2">
        <div className="site-container">
          <div className={`grid gap-px border border-line bg-line sm:grid-cols-2 ${process.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
            {process.map((item, index) => (
              <Reveal key={item.title} delay={index * 60} className="bg-coal-2 p-7">
                <span className="flex h-11 w-11 items-center justify-center border border-brass/50 text-brass">{item.icon}</span>
                <span className="mt-7 block font-display text-4xl text-cream/10">0{index + 1}</span>
                <h3 className="display mt-2 text-xl">{item.title}</h3>
                <p className="body-copy mt-2 text-sm">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-coal">
        <div className="site-container grid gap-8 lg:grid-cols-2">
          <Reveal className="card-surface p-7 sm:p-9">
            <span className="eyebrow">Par téléphone</span>
            <h2 className="display mt-4 text-3xl sm:text-4xl">Un appel suffit.</h2>
            <p className="body-copy mt-4">Pour un rendez-vous le jour même, une question sur une prestation ou une modification, le plus rapide reste d'appeler le salon.</p>
            <div className="mt-7 flex flex-wrap gap-3"><PhoneButton variant="primary" /><ButtonLink href="/contact?objet=rdv" variant="outline">Écrire au salon</ButtonLink></div>
          </Reveal>
          <Reveal delay={100} className="card-surface p-7 sm:p-9">
            <span className="eyebrow">Bon à savoir</span>
            <h2 className="display mt-4 text-3xl sm:text-4xl">Une demande, puis une confirmation.</h2>
            <p className="body-copy mt-4">Votre réservation en ligne est une demande : elle devient définitive lorsque le salon vous la confirme. Conservez la référence affichée à la fin du parcours, elle vous sera utile pour toute modification.</p>
            <ButtonLink href="/prestations#faq" variant="outline" className="mt-7">Questions fréquentes</ButtonLink>
          </Reveal>
        </div>
      </section>

      <CTABand eyebrow="Avant de venir" title="Un doute sur la prestation à choisir ?" text="Tarifs indicatifs, durées et réponses aux questions les plus fréquentes sont réunis sur la page Prestations." href="/prestations" action="Voir les prestations" />
    </>
  );
}
