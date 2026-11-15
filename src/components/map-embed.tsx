"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useConsent } from "@/components/consent";
import { brand } from "@/lib/data";

/**
 * Carte OpenStreetMap chargée uniquement après accord explicite du visiteur.
 * Sans accord, aucun appel n'est émis vers un serveur tiers.
 */
export default function MapEmbed({ className = "" }: { className?: string }) {
  const { ready, mapAllowed, setMapAllowed } = useConsent();
  const { lat, lon } = brand.coordinates;

  if (ready && mapAllowed) {
    const bbox = [lon - 0.0065, lat - 0.0035, lon + 0.0065, lat + 0.0035].map((value) => value.toFixed(5)).join("%2C");
    return (
      <iframe
        title={`Carte — ${brand.address}`}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`}
        loading="lazy"
        className={`map-frame h-full min-h-[330px] w-full ${className}`}
      />
    );
  }

  return (
    <div className={`map-placeholder flex h-full min-h-[330px] w-full flex-col items-center justify-center px-6 py-10 text-center ${className}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-brass text-brass"><MapPin size={20} /></span>
      <p className="mt-4 font-display text-xl uppercase tracking-wide">{brand.street}</p>
      <p className="text-sm text-stone">{brand.postalCode} {brand.city} · {brand.quarter}</p>
      <button type="button" onClick={() => setMapAllowed(true)} className="btn btn-primary mt-6">Afficher la carte</button>
      <p className="mt-4 max-w-sm text-xs leading-relaxed text-stone">
        La carte est fournie par OpenStreetMap : en l'affichant, votre navigateur se connecte à ses serveurs.{" "}
        <Link href="/politique-cookies" className="text-brass underline underline-offset-4 hover:text-brass-light">En savoir plus</Link>
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-[.14em]">
        <a href={brand.mapsUrl} target="_blank" rel="noreferrer" className="text-cream hover:text-brass">Google Maps ↗</a>
        <a href={brand.osmUrl} target="_blank" rel="noreferrer" className="text-cream hover:text-brass">OpenStreetMap ↗</a>
      </div>
    </div>
  );
}
