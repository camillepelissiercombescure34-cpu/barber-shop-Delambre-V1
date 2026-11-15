import { getProduct, giftCardRange } from "@/lib/data";

export type CartLine = { id: string; quantity: number };
export type ResolvedLine = { productId: string; name: string; price: number; quantity: number };

/** Les prix sont toujours recalculés côté serveur à partir du catalogue, jamais repris du navigateur. */
export function resolveCartLine(line: CartLine): ResolvedLine | null {
  const quantity = Number(line.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return null;

  const product = getProduct(String(line.id));
  if (product) return { productId: product.id, name: product.name, price: product.price, quantity };

  const gift = /^gift-(\d{2,3})$/.exec(String(line.id));
  if (gift) {
    const amount = Number(gift[1]);
    if (amount >= giftCardRange.min && amount <= giftCardRange.max) return { productId: `gift-${amount}`, name: `Carte cadeau ${amount} €`, price: amount, quantity };
  }
  return null;
}
