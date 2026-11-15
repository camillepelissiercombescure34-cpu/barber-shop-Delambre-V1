import Link from "next/link";
import type { ReactNode } from "react";
import { PageHero } from "@/components/ui";
import { legal } from "@/lib/legal";

/** Étiquette visible signalant une information que seul le salon peut fournir. */
export function Todo({ children = "À compléter" }: { children?: ReactNode }) {
  return <span className="todo-badge">{children}</span>;
}

export function Value({ value, hint }: { value: string | null; hint?: string }) {
  return value ? <>{value}</> : <Todo>{hint ? `À compléter — ${hint}` : "À compléter"}</Todo>;
}

const legalPages = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
  { href: "/politique-cookies", label: "Politique de cookies" },
];

export function LegalPage({ title, eyebrow, intro, current, sections, children }: { title: string; eyebrow: string; intro: string; current: string; sections: { id: string; label: string }[]; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={intro} compact />
      <section className="section-tight bg-coal">
        <div className="site-container grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
          <aside className="h-fit lg:sticky lg:top-28">
            <p className="text-[.68rem] font-semibold uppercase tracking-[.2em] text-brass">Sommaire</p>
            <nav className="mt-4 border-l border-line" aria-label="Sommaire de la page">
              {sections.map((section) => <a key={section.id} href={`#${section.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-stone transition-colors hover:border-brass hover:text-cream">{section.label}</a>)}
            </nav>
            <p className="mt-8 text-[.68rem] font-semibold uppercase tracking-[.2em] text-brass">Documents</p>
            <ul className="mt-4 space-y-2 text-sm">
              {legalPages.map((page) => <li key={page.href}><Link href={page.href} aria-current={page.href === current ? "page" : undefined} className={page.href === current ? "text-cream" : "text-stone transition-colors hover:text-cream"}>{page.label}</Link></li>)}
            </ul>
            <p className="mt-8 text-xs leading-relaxed text-stone">Dernière mise à jour : {legal.lastUpdated}</p>
          </aside>
          <article className="legal-prose min-w-0 max-w-3xl">{children}</article>
        </div>
      </section>
    </>
  );
}
