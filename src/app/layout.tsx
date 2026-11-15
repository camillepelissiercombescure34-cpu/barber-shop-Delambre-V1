import type { Metadata } from "next";
import type { ReactNode } from "react";
// Polices hébergées avec le site : aucun appel à un serveur tiers.
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";
import "@fontsource/barlow/300.css";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow/700.css";
import "./globals.css";
import BackToTop from "@/components/back-to-top";
import { CartProvider } from "@/components/cart-context";
import CartDrawer from "@/components/cart-drawer";
import { ConsentProvider } from "@/components/consent";
import Footer from "@/components/footer";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: {
    default: "Barber Shop 32 — Barbier à Paris 14e, rue Delambre",
    template: "%s | Barber Shop 32",
  },
  description: "Barber Shop 32, barbier et coiffeur homme au 32 rue Delambre (Paris 14e, Montparnasse) : coupe, dégradé, taille de barbe et rasage à prix doux. Réservation en ligne.",
  keywords: ["barbier Paris 14", "barber shop Montparnasse", "coiffeur homme rue Delambre", "dégradé", "taille de barbe", "Barber Shop 32"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Sans JavaScript, le contenu animé reste visible. */}
        <noscript><style>{".reveal{opacity:1!important;transform:none!important}"}</style></noscript>
      </head>
      <body className="bg-coal font-body text-cream antialiased">
        <ConsentProvider>
          <CartProvider>
            <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-brass focus:px-4 focus:py-2 focus:text-coal">Aller au contenu</a>
            <Header />
            <main id="contenu">{children}</main>
            <Footer />
            <BackToTop />
            <CartDrawer />
          </CartProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
