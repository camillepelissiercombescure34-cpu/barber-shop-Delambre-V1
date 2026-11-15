"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add("in-view");
        observer.unobserve(node);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function ButtonLink({ href, children, variant = "primary", className = "" }: { href: string; children: ReactNode; variant?: "primary" | "outline" | "dark"; className?: string }) {
  const classes = `btn btn-${variant} ${className}`;
  if (href.startsWith("http")) return <a href={href} className={classes} target="_blank" rel="noreferrer">{children}</a>;
  if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("#")) return <a href={href} className={classes}>{children}</a>;
  return <Link href={href} className={classes}>{children}</Link>;
}

export function SectionHeading({ eyebrow, title, description, align = "left", className = "" }: { eyebrow: string; title: ReactNode; description?: string; align?: "left" | "center"; className?: string }) {
  return (
    <Reveal className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      <span className={`eyebrow ${align === "center" ? "eyebrow-center" : ""}`}>{eyebrow}</span>
      <h2 className="display section-title mt-5 text-cream">{title}</h2>
      {description && <p className={`body-copy mt-5 max-w-2xl text-balance ${align === "center" ? "mx-auto" : ""}`}>{description}</p>}
    </Reveal>
  );
}

/**
 * En-tête des pages intérieures. La photo est présentée dans un cadre à sa taille
 * réelle (les visuels fournis font 600 px) plutôt qu'étirée en fond d'écran.
 */
export function PageHero({ eyebrow, title, description, image, imageAlt = "", compact = false, children }: { eyebrow: string; title: string; description: string; image?: string; imageAlt?: string; compact?: boolean; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line pt-[84px]">
      <div className="absolute inset-0 -z-20 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/images/hero.jpg')" }} aria-hidden="true" />
      <div className="page-hero-shade absolute inset-0 -z-10" aria-hidden="true" />
      <div className={`site-container grid items-center gap-10 py-14 md:py-20 ${image ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,430px)] lg:gap-16" : ""}`}>
        <Reveal>
          <div className="mb-6 flex flex-wrap items-center gap-3 text-[.68rem] font-semibold uppercase tracking-[.2em] text-stone">
            <Link href="/" className="hover:text-brass">Accueil</Link><span className="text-brass">/</span><span className="text-brass">{title}</span>
          </div>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className={`display mt-5 text-cream ${compact ? "text-[clamp(2.3rem,5.2vw,4.6rem)]" : "text-[clamp(3rem,7vw,6.6rem)]"}`}>{title}</h1>
          <p className="body-copy mt-6 max-w-2xl md:text-lg">{description}</p>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </Reveal>
        {image && (
          <Reveal delay={120} className="relative mx-auto w-full max-w-[430px] lg:mx-0 lg:justify-self-end">
            <div className="relative aspect-[4/3] overflow-hidden border border-line sm:aspect-square">
              <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
              <div className="image-shade absolute inset-0 opacity-50" aria-hidden="true" />
            </div>
            <span className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 border-b-2 border-r-2 border-brass" aria-hidden="true" />
            <span className="pointer-events-none absolute -left-3 -top-3 h-24 w-24 border-l-2 border-t-2 border-brass/50" aria-hidden="true" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function TextArrow({ children, href }: { children: ReactNode; href: string }) {
  return <Link href={href} className="group inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[.16em] text-brass hover:text-brass-light">{children}<ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></Link>;
}

export function SuccessPanel({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <div className="card-surface amber-glow p-8 text-center md:p-12" role="status">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-brass text-2xl text-brass">✓</div>
      <h3 className="display text-3xl md:text-4xl">{title}</h3>
      <p className="body-copy mx-auto mt-4 max-w-lg">{message}</p>
      {action && <div className="mt-7 flex justify-center">{action}</div>}
    </div>
  );
}
