"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Scissors, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { brand } from "@/lib/data";

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/prestations", label: "Prestations" },
  { href: "/savoir-faire", label: "Savoir-faire" },
  { href: "/boutique", label: "Boutique" },
  { href: "/localisation", label: "Localisation" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const solid = pathname !== "/" || scrolled || menuOpen;
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? "border-b border-line bg-coal/95 shadow-[0_10px_40px_rgba(0,0,0,.35)] backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}>
        <div className="site-container flex h-[84px] items-center justify-between gap-4">
          <Link href="/" aria-label={`${brand.name} — accueil`} className="group flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brass/70 text-brass transition-colors group-hover:bg-brass group-hover:text-coal">
              <Scissors size={17} strokeWidth={1.7} />
            </span>
            <span className="font-display text-[.95rem] font-semibold uppercase tracking-[.14em] text-cream sm:text-lg sm:tracking-[.2em]">Barber Shop <span className="text-brass">32</span></span>
          </Link>

          <nav className="hidden items-center gap-5 xl:flex" aria-label="Navigation principale">
            {navigation.map((item) => <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={`nav-link whitespace-nowrap ${isActive(item.href) ? "active text-brass" : "text-cream/80"}`}>{item.label}</Link>)}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={() => setOpen(true)} aria-label={`Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`} className="relative flex h-10 w-10 items-center justify-center border border-line text-cream transition-colors hover:border-brass hover:text-brass">
              <ShoppingBag size={17} />
              {count > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brass px-1 text-[.65rem] font-bold text-coal">{count}</span>}
            </button>
            <Link href="/reservation" className="btn btn-primary hidden h-10 min-h-0 px-4 py-0 text-[.68rem] lg:inline-flex">Réserver <ArrowUpRight size={14} /></Link>
            <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen} className="flex h-10 w-10 items-center justify-center border border-line text-cream transition-colors hover:border-brass hover:text-brass xl:hidden">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-coal px-6 pb-8 pt-28 xl:hidden">
          <div className="grain pointer-events-none absolute inset-0" />
          <nav className="relative flex flex-col" aria-label="Navigation mobile">
            {navigation.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`flex items-baseline justify-between border-b border-line py-3.5 font-display text-3xl uppercase sm:text-4xl ${isActive(item.href) ? "text-brass" : "text-cream"}`}>
                <span>{item.label}</span><span className="font-body text-xs tracking-widest text-stone">0{index + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="relative mt-8">
            <Link href="/reservation" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full">Réserver un créneau <ArrowUpRight size={16} /></Link>
            {brand.phone && brand.phoneHref && <a href={brand.phoneHref} className="mt-5 block text-center text-sm tracking-[.14em] text-stone hover:text-cream">{brand.phone}</a>}
            <p className="mt-2 text-center text-xs tracking-[.12em] text-stone/70">{brand.address}</p>
          </div>
        </div>
      )}
    </>
  );
}
