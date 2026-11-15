"use client";

import { useState } from "react";
import { pricesNotice, serviceCategories, services } from "@/lib/data";
import { ServiceList } from "@/components/sections";
import { Reveal } from "@/components/ui";

export default function ServicesCatalog() {
  const [category, setCategory] = useState<string>("Toutes");
  const filtered = services.filter((service) => category === "Toutes" || service.category === category);
  return (
    <>
      <Reveal className="hide-scrollbar mb-4 flex gap-2 overflow-x-auto pb-2">
        {serviceCategories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`filter-pill shrink-0 ${category === item ? "active" : ""}`}>{item}</button>)}
      </Reveal>
      <p className="mb-8 text-xs uppercase tracking-[.16em] text-stone" aria-live="polite">{filtered.length} prestation{filtered.length > 1 ? "s" : ""} · {pricesNotice}</p>
      <ServiceList key={category} items={filtered} />
    </>
  );
}
