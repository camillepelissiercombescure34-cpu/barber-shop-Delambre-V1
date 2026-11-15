"use client";

import { useState } from "react";
import { Check, Gift, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { Reveal } from "@/components/ui";
import { formatPrice, giftCardPresets, giftCardRange, images, productCategories, products, shopNotice, type Product } from "@/lib/data";

/** L'étagère : la photo fournie d'un côté, la liste filtrable des produits de l'autre. */
export function ProductShelf({ limit, showFilters = true }: { limit?: number; showFilters?: boolean }) {
  const [category, setCategory] = useState<string>("Tous");
  const [added, setAdded] = useState("");
  const { add } = useCart();
  const filtered = products.filter((product) => category === "Tous" || product.category === category);
  const visible = limit ? filtered.slice(0, limit) : filtered;

  const addProduct = (product: Product) => {
    add({ id: product.id, name: product.name, price: product.price, kind: "product" });
    setAdded(product.id);
    window.setTimeout(() => setAdded(""), 1300);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-14">
      <Reveal className="lg:sticky lg:top-28">
        <div className="hover-zoom relative aspect-[4/3] overflow-hidden border border-line sm:aspect-square">
          <img src={images.produits} alt="Produits de coiffage, ciseaux, tondeuses et peigne posés sur un plan de travail" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <p className="mt-4 text-xs uppercase leading-relaxed tracking-[.14em] text-stone">{shopNotice}</p>
      </Reveal>

      <div>
        {showFilters && (
          <Reveal className="hide-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
            {productCategories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`filter-pill shrink-0 ${category === item ? "active" : ""}`}>{item}</button>)}
          </Reveal>
        )}
        <ul className="border-t border-line">
          {visible.map((product, index) => (
            <li key={product.id} className="border-b border-line">
              <Reveal delay={index * 45} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <span className="text-[.62rem] font-semibold uppercase tracking-[.2em] text-brass">{product.category}</span>
                  <h3 className="mt-1 font-display text-xl uppercase tracking-[.02em] sm:text-2xl">{product.name}</h3>
                  <p className="body-copy mt-1 text-sm">{product.description}</p>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
                  <span className="font-display text-2xl text-brass">{formatPrice(product.price)}</span>
                  <button type="button" onClick={() => addProduct(product)} className={`btn min-h-0 px-4 py-2.5 text-[.62rem] ${added === product.id ? "btn-dark border-brass text-brass" : "btn-primary"}`}>
                    {added === product.id ? <><Check size={14} /> Ajouté</> : <><ShoppingBag size={14} /> Ajouter</>}
                  </button>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function GiftCardSection() {
  const [selected, setSelected] = useState<number>(giftCardPresets[1]);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  const addGiftCard = () => {
    const amount = custom ? Number(custom) : selected;
    if (!Number.isInteger(amount) || amount < giftCardRange.min || amount > giftCardRange.max) {
      setError(`Choisissez un montant entier entre ${giftCardRange.min} € et ${giftCardRange.max} €.`);
      return;
    }
    setError("");
    add({ id: `gift-${amount}`, name: `Carte cadeau ${amount} €`, price: amount, kind: "giftcard" });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal>
        <div className="grain relative aspect-[1.65/1] overflow-hidden border border-brass/50 bg-[radial-gradient(circle_at_75%_20%,rgba(217,164,65,.22),transparent_45%),linear-gradient(135deg,#1c1710,#0e0d0b)] p-7 shadow-[0_25px_80px_rgba(0,0,0,.55)] sm:p-10">
          <div className="flex items-start justify-between"><span className="font-display text-lg uppercase tracking-[.2em]">Barber Shop <span className="text-brass">32</span></span><Gift size={26} className="text-brass" strokeWidth={1.3} /></div>
          <div className="absolute bottom-7 left-7 sm:bottom-10 sm:left-10"><span className="block text-[.6rem] uppercase tracking-[.24em] text-stone">Carte cadeau</span><span className="display mt-1 block text-5xl text-brass sm:text-7xl">{custom || selected} €</span></div>
          <span className="absolute bottom-8 right-8 font-display text-[.6rem] uppercase tracking-[.18em] text-stone">Paris 14e</span>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <span className="eyebrow">Offrir une coupe</span>
        <h2 className="display section-title mt-5">La carte <span className="text-brass">cadeau.</span></h2>
        <p className="body-copy mt-5 max-w-xl">Choisissez un montant, ajoutez la carte à votre panier puis validez la demande : elle est préparée au salon, où vous la réglez lors du retrait.</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {giftCardPresets.map((amount) => <button key={amount} type="button" aria-pressed={!custom && selected === amount} onClick={() => { setSelected(amount); setCustom(""); setError(""); }} className={`filter-pill ${!custom && selected === amount ? "active" : ""}`}>{amount} €</button>)}
        </div>
        <div className="mt-5 flex max-w-md items-end gap-3">
          <div className="flex-1">
            <label className="field-label" htmlFor="gift-custom">Ou montant libre ({giftCardRange.min} – {giftCardRange.max} €)</label>
            <input id="gift-custom" type="number" inputMode="numeric" min={giftCardRange.min} max={giftCardRange.max} step={1} value={custom} onChange={(event) => { setCustom(event.target.value); setError(""); }} placeholder="Ex. 35" className="field" />
          </div>
          <button type="button" onClick={addGiftCard} className={`btn ${added ? "btn-dark border-brass text-brass" : "btn-primary"}`}>{added ? <><Check size={15} /> Ajoutée</> : <><Plus size={15} /> Ajouter</>}</button>
        </div>
        {error && <p className="mt-3 text-sm text-red-300" role="alert">{error}</p>}
        <p className="mt-5 text-xs leading-relaxed text-stone">Aucun paiement en ligne. Les conditions d'utilisation de la carte vous sont précisées au salon lors du retrait.</p>
      </Reveal>
    </div>
  );
}
