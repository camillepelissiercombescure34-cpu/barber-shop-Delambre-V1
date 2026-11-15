"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { galleryCategories, galleryItems } from "@/lib/data";
import { Reveal, SectionHeading } from "@/components/ui";

export default function Gallery() {
  const [category, setCategory] = useState<string>("Toutes");
  const [active, setActive] = useState<number | null>(null);
  const filtered = galleryItems.filter((item) => category === "Toutes" || item.category === category);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((current) => current === null ? null : (current + 1) % filtered.length);
      if (event.key === "ArrowLeft") setActive((current) => current === null ? null : (current - 1 + filtered.length) % filtered.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [active, filtered.length]);

  return (
    <section id="galerie" className="section-pad bg-coal">
      <div className="site-container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Galerie" title={<>En <span className="text-brass">images.</span></>} description="Dégradés, barbes, outils et ambiance barber. Cliquez sur une image pour l'afficher en grand." />
          <Reveal className="hide-scrollbar flex shrink-0 gap-2 overflow-x-auto pb-2">
            {galleryCategories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => { setCategory(item); setActive(null); }} className={`filter-pill shrink-0 ${category === item ? "active" : ""}`}>{item}</button>)}
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[250px] md:grid-cols-4">
          {filtered.map((item, index) => (
            <Reveal key={item.id} delay={index * 50} className={`overflow-hidden ${index === 0 && filtered.length > 4 ? "row-span-2" : ""}`}>
              <button type="button" onClick={() => setActive(index)} className="hover-zoom group relative h-full w-full overflow-hidden border border-line bg-coal-3" aria-label={`Agrandir : ${item.title}`}>
                <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
                <span className="image-shade absolute inset-0" aria-hidden="true" />
                <span className="absolute bottom-4 left-4 right-4 text-left font-display text-sm uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-base">{item.title}</span>
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-white/30 bg-black/30 text-cream transition-colors group-hover:border-brass group-hover:text-brass"><Plus size={17} /></span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active !== null && filtered[active] && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/93 p-4" role="dialog" aria-modal="true" aria-label={filtered[active].title}>
          <button type="button" onClick={() => setActive(null)} className="absolute inset-0 cursor-default" aria-label="Fermer la galerie" />
          <button type="button" onClick={() => setActive(null)} aria-label="Fermer" className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-white/30 text-cream hover:border-brass hover:text-brass"><X size={22} /></button>
          <button type="button" onClick={() => setActive((active - 1 + filtered.length) % filtered.length)} aria-label="Image précédente" className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center border border-white/30 bg-black/40 text-cream hover:border-brass hover:text-brass sm:left-8"><ChevronLeft size={22} /></button>
          <div className="relative z-[1] flex max-h-[86vh] max-w-4xl flex-col items-center">
            <img src={filtered[active].image} alt={filtered[active].title} className="max-h-[76vh] w-auto object-contain" />
            <p className="mt-4 text-center font-display text-sm uppercase tracking-[.2em] text-brass">{filtered[active].title} <span className="ml-3 text-stone">{active + 1} / {filtered.length}</span></p>
          </div>
          <button type="button" onClick={() => setActive((active + 1) % filtered.length)} aria-label="Image suivante" className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center border border-white/30 bg-black/40 text-cream hover:border-brass hover:text-brass sm:right-8"><ChevronRight size={22} /></button>
        </div>
      )}
    </section>
  );
}
