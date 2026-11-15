import { Scissors } from "lucide-react";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center bg-coal-2 pt-24">
      <div className="site-container py-16 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brass text-brass"><Scissors size={26} strokeWidth={1.4} /></span>
        <span className="eyebrow eyebrow-center mt-8">Erreur 404</span>
        <h1 className="display mt-5 text-[clamp(3.5rem,14vw,11rem)]">Page <span className="text-brass">introuvable.</span></h1>
        <p className="body-copy mx-auto mt-5 max-w-lg">Cette page n'existe pas ou a été déplacée. Retrouvez les prestations, les horaires ou un créneau disponible depuis l'accueil.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3"><ButtonLink href="/" variant="primary">Retour à l'accueil</ButtonLink><ButtonLink href="/reservation" variant="outline">Réserver un créneau</ButtonLink></div>
      </div>
    </section>
  );
}
