"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CART_STORAGE_KEY } from "@/lib/storage-keys";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  kind?: "product" | "giftcard";
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  add: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const isCartItem = (value: unknown): value is CartItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.name === "string" && typeof item.price === "number" && typeof item.quantity === "number";
};

/** Panier conservé dans le stockage local du navigateur (voir la politique de cookies). */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) setItems(parsed.filter(isCartItem));
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (items.length > 0) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      else window.localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Stockage indisponible : le panier reste valable pour la visite en cours.
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    isOpen,
    setOpen,
    add: (item) => {
      setItems((current) => {
        const existing = current.find((entry) => entry.id === item.id);
        if (existing) return current.map((entry) => entry.id === item.id ? { ...entry, quantity: Math.min(20, entry.quantity + (item.quantity ?? 1)) } : entry);
        return [...current, { ...item, quantity: item.quantity ?? 1 }];
      });
      setOpen(true);
    },
    remove: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    setQuantity: (id, quantity) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(20, quantity)) } : item)),
    clear: () => setItems([]),
  }), [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
