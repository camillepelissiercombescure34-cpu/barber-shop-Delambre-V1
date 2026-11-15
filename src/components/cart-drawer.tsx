"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, Gift, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { brand, formatPrice } from "@/lib/data";

export default function CartDrawer() {
  const { items, count, total, isOpen, setOpen, setQuantity, remove, clear } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [isOpen, setOpen]);

  // Une fois la confirmation consultée puis le panier refermé, on repart d'un état neuf.
  useEffect(() => {
    if (!isOpen && status === "success") { setStatus("idle"); setCheckout(false); setReference(""); }
  }, [isOpen, status]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"), email: formData.get("email"), phone: formData.get("phone"),
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
        }),
      });
      const result = await response.json() as { reference?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Une erreur est survenue.");
      setReference(result.reference ?? "");
      setStatus("success");
      clear();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
      setStatus("error");
    }
  };

  return (
    <>
      <div onClick={() => setOpen(false)} className={`fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden="true" />
      <aside className={`fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-md flex-col border-l border-line bg-coal-2 shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`} aria-label="Panier" aria-hidden={!isOpen} inert={!isOpen}>
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div><span className="eyebrow">Votre sélection</span><h2 className="display mt-2 text-2xl">Panier <span className="text-brass">({count})</span></h2></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Fermer le panier" className="flex h-10 w-10 items-center justify-center border border-line transition-colors hover:border-brass hover:text-brass"><X size={18} /></button>
        </div>

        {status === "success" ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center" role="status">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brass text-brass"><Check size={28} /></div>
            <h3 className="display text-3xl">Demande enregistrée</h3>
            <p className="body-copy mt-4 text-sm">Votre demande <span className="text-brass">{reference}</span> est enregistrée. Conservez cette référence : le salon vous recontacte pour convenir du retrait.</p>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-primary mt-8">Continuer la visite</button>
          </div>
        ) : checkout && items.length > 0 ? (
          <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
            <button type="button" onClick={() => setCheckout(false)} className="mb-6 self-start text-xs uppercase tracking-[.16em] text-brass hover:text-brass-light">← Retour au panier</button>
            <h3 className="display text-3xl">Retrait au salon</h3>
            <p className="body-copy mt-3 text-sm">Aucun paiement en ligne : votre demande est préparée puis réglée sur place, au {brand.address}.</p>
            <div className="mt-7 space-y-4">
              <div><label className="field-label" htmlFor="cart-name">Nom complet *</label><input id="cart-name" name="name" required minLength={2} maxLength={120} autoComplete="name" className="field" placeholder="Votre nom" /></div>
              <div><label className="field-label" htmlFor="cart-email">E-mail *</label><input id="cart-email" name="email" type="email" required maxLength={160} autoComplete="email" className="field" placeholder="vous@exemple.fr" /></div>
              <div><label className="field-label" htmlFor="cart-phone">Téléphone *</label><input id="cart-phone" name="phone" type="tel" required minLength={6} maxLength={40} autoComplete="tel" className="field" placeholder="06 00 00 00 00" /></div>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-stone">Ces informations servent uniquement à préparer votre demande. <Link href="/politique-de-confidentialite" onClick={() => setOpen(false)} className="text-brass underline underline-offset-4">Politique de confidentialité</Link></p>
            <div className="mt-auto border-t border-line pt-6">
              <div className="mb-4 flex justify-between font-display text-xl uppercase"><span>Total</span><span className="text-brass">{formatPrice(total)}</span></div>
              {status === "error" && <p className="mb-3 text-sm text-red-300" role="alert">{error}</p>}
              <button type="submit" disabled={status === "loading"} className="btn btn-primary w-full">{status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Envoi…</> : "Valider la demande"}</button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag size={38} className="mb-5 text-brass/70" strokeWidth={1.3} />
                  <h3 className="display text-2xl">Panier vide</h3>
                  <p className="body-copy mt-3 text-sm">Produits de coiffage, soins pour la barbe et cartes cadeaux vous attendent dans la boutique.</p>
                  <Link href="/boutique" onClick={() => setOpen(false)} className="btn btn-outline mt-7">Découvrir la boutique</Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 border-b border-line pb-5">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-brass/30 bg-coal-3 text-brass">{item.kind === "giftcard" ? <Gift size={22} strokeWidth={1.4} /> : <ShoppingBag size={22} strokeWidth={1.4} />}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2"><h3 className="font-display text-sm uppercase tracking-wide">{item.name}</h3><button type="button" onClick={() => remove(item.id)} aria-label={`Retirer ${item.name}`} className="text-stone transition-colors hover:text-brass"><Trash2 size={15} /></button></div>
                        <p className="mt-1 text-sm text-brass">{formatPrice(item.price)}</p>
                        <div className="mt-3 inline-flex items-center border border-line">
                          <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`Diminuer la quantité de ${item.name}`} className="px-2.5 py-1.5 transition-colors hover:text-brass disabled:opacity-30"><Minus size={13} /></button>
                          <span className="min-w-7 text-center text-sm" aria-live="polite">{item.quantity}</span>
                          <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= 20} aria-label={`Augmenter la quantité de ${item.name}`} className="px-2.5 py-1.5 transition-colors hover:text-brass disabled:opacity-30"><Plus size={13} /></button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="mb-1 flex justify-between font-display text-xl uppercase"><span>Total</span><span className="text-brass">{formatPrice(total)}</span></div>
                <p className="mb-5 text-xs text-stone">Retrait au salon · paiement sur place · prix indicatifs</p>
                <button type="button" onClick={() => { setCheckout(true); setStatus("idle"); setError(""); }} className="btn btn-primary w-full">Finaliser la demande</button>
              </div>
            )}
          </>
        )}
      </aside>
    </>
  );
}
