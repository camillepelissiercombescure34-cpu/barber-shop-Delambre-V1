import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Phone, Scissors } from "lucide-react";
import { ManageCookiesButton } from "@/components/consent";
import { brand, formatPrice, openDaysLabel, pricesNotice, services } from "@/lib/data";

const footerLinks = [
  { href: "/", label: "Accueil" },
  { href: "/prestations", label: "Prestations & tarifs" },
  { href: "/savoir-faire", label: "Savoir-faire" },
  { href: "/reservation", label: "Réservation" },
  { href: "/boutique", label: "Boutique" },
  { href: "/localisation", label: "Localisation" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Confidentialité" },
  { href: "/politique-cookies", label: "Cookies" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#0b0a09]">
      <div className="site-container border-b border-line py-14 md:py-20">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <span className="eyebrow">{brand.street} · {brand.district}</span>
            <h2 className="display mt-4 text-[clamp(3rem,8vw,8rem)] text-cream">Prenez <span className="text-brass">place.</span></h2>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <Link href="/reservation" className="btn btn-primary">Réserver en ligne <ArrowUpRight size={16} /></Link>
            {brand.phone && brand.phoneHref && <a href={brand.phoneHref} className="btn btn-outline"><Phone size={15} /> {brand.phone}</a>}
          </div>
        </div>
      </div>

      <div className="site-container grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brass text-brass"><Scissors size={18} strokeWidth={1.6} /></span>
            <span className="font-display text-lg font-semibold uppercase tracking-[.16em]">Barber Shop <span className="text-brass">32</span></span>
          </div>
          <p className="body-copy mt-6 max-w-xs text-sm">{brand.activity} au {brand.address}, dans le quartier du {brand.quarter}. Coupes, dégradés, barbes et rasages à prix doux.</p>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[.2em] text-brass">Explorer</h3>
          <ul className="mt-6 grid grid-cols-1 gap-3 text-sm text-stone">
            {footerLinks.map((item) => <li key={item.href}><Link href={item.href} className="transition-colors hover:text-cream">{item.label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[.2em] text-brass">Tarifs</h3>
          <ul className="mt-6 space-y-3 text-sm text-stone">
            {services.map((service) => <li key={service.id}><Link href={`/reservation?service=${service.id}`} className="flex justify-between gap-3 transition-colors hover:text-cream"><span>{service.name}</span><span className="text-cream/70">{formatPrice(service.price)}</span></Link></li>)}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-stone/70">{pricesNotice}</p>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-[.2em] text-brass">Nous trouver</h3>
          <address className="mt-6 space-y-4 text-sm not-italic text-stone">
            <p><a href={brand.mapsUrl} target="_blank" rel="noreferrer" className="flex gap-3 transition-colors hover:text-cream"><MapPin size={17} className="mt-1 shrink-0 text-brass" />{brand.address}</a></p>
            {brand.phone && brand.phoneHref && <p><a href={brand.phoneHref} className="flex gap-3 transition-colors hover:text-cream"><Phone size={17} className="mt-1 shrink-0 text-brass" />{brand.phone}</a></p>}
            <p><Link href="/localisation" className="flex gap-3 transition-colors hover:text-cream"><Clock size={17} className="mt-1 shrink-0 text-brass" />{openDaysLabel} · voir les horaires</Link></p>
          </address>
        </div>
      </div>

      <div className="site-container flex flex-col gap-4 border-t border-line py-6 text-[.68rem] uppercase tracking-[.16em] text-stone lg:flex-row lg:items-center lg:justify-between">
        <p>© {new Date().getFullYear()} {brand.name} · {brand.address}</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Informations légales">
          {legalLinks.map((item) => <Link key={item.href} href={item.href} className="transition-colors hover:text-cream">{item.label}</Link>)}
          <ManageCookiesButton className="uppercase tracking-[.16em] transition-colors hover:text-cream" />
        </nav>
      </div>
    </footer>
  );
}
