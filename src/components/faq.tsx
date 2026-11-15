"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { faqs } from "@/lib/data";
import { Reveal } from "@/components/ui";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-4xl">
      {faqs.map((faq, index) => (
        <Reveal key={faq.question} delay={index * 40} className="border-b border-line">
          <button type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index} className="flex w-full items-center justify-between gap-5 py-6 text-left">
            <span className={`font-display text-lg uppercase tracking-wide transition-colors sm:text-xl ${open === index ? "text-brass" : "text-cream"}`}>{faq.question}</span>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center border ${open === index ? "border-brass bg-brass text-coal" : "border-line text-brass"}`}>{open === index ? <Minus size={15} /> : <Plus size={15} />}</span>
          </button>
          <div className={`grid transition-all duration-300 ${open === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden"><p className="body-copy max-w-3xl pb-6 pr-10 text-sm">{faq.answer}</p></div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
