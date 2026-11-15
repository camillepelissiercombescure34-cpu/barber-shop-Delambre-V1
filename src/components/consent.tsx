"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CONSENT_MAX_AGE_DAYS, CONSENT_STORAGE_KEY } from "@/lib/storage-keys";

type ConsentContextValue = {
  /** Vrai une fois le choix éventuel relu depuis le navigateur. */
  ready: boolean;
  /** `null` tant qu'aucun choix n'a été exprimé. */
  mapAllowed: boolean | null;
  setMapAllowed: (allowed: boolean) => void;
  openPanel: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);
const MAX_AGE_MS = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

/**
 * Seul contenu soumis à accord : la carte interactive (service tiers).
 *
 * Aucun bandeau n'est imposé à l'arrivée : rien n'est déposé ni chargé depuis un tiers
 * sans action du visiteur. L'accord se donne là où la carte s'affiche (bouton
 * « Afficher la carte ») et se modifie à tout moment via « Gérer les cookies ».
 * Le choix est conservé localement et expire au bout de six mois.
 */
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [mapAllowed, setMapState] = useState<boolean | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as { map?: unknown; savedAt?: unknown };
        if (typeof stored.map === "boolean" && typeof stored.savedAt === "number" && Date.now() - stored.savedAt < MAX_AGE_MS) setMapState(stored.map);
        else window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      }
    } catch {
      // Stockage indisponible : le choix sera simplement redemandé.
    }
    setReady(true);
  }, []);

  const setMapAllowed = useCallback((allowed: boolean) => {
    setMapState(allowed);
    setPanelOpen(false);
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ map: allowed, savedAt: Date.now() }));
    } catch {
      // Le choix reste valable pour la visite en cours.
    }
  }, []);

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const value = useMemo(() => ({ ready, mapAllowed, setMapAllowed, openPanel }), [ready, mapAllowed, setMapAllowed, openPanel]);
  const visible = ready && panelOpen;

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {visible && (
        <div role="dialog" aria-label="Préférences de confidentialité" className="fixed inset-x-3 bottom-3 z-[65] border border-brass/40 bg-coal-2 p-5 shadow-[0_20px_70px_rgba(0,0,0,.65)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md sm:p-6">
          <p className="font-display text-lg uppercase tracking-wide">Cookies & carte interactive</p>
          <p className="mt-2 text-sm leading-relaxed text-stone">
            Ce site n'utilise ni publicité ni mesure d'audience. Seule la carte interactive, fournie par OpenStreetMap, nécessite votre accord.
            {mapAllowed !== null && <span className="text-cream"> Choix actuel : carte {mapAllowed ? "acceptée" : "refusée"}.</span>}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMapAllowed(false)} className="btn btn-outline">Refuser</button>
            <button type="button" onClick={() => setMapAllowed(true)} className="btn btn-outline">Accepter</button>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 text-xs">
            <Link href="/politique-cookies" className="text-brass underline underline-offset-4 hover:text-brass-light">Politique de cookies</Link>
            <button type="button" onClick={() => setPanelOpen(false)} className="uppercase tracking-[.14em] text-stone hover:text-cream">Fermer</button>
          </div>
        </div>
      )}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent must be used within ConsentProvider");
  return context;
}

export function ManageCookiesButton({ className = "", children = "Gérer les cookies" }: { className?: string; children?: ReactNode }) {
  const { openPanel } = useConsent();
  return <button type="button" onClick={openPanel} className={className}>{children}</button>;
}

/** Rappelle le choix en cours sur la page « Politique de cookies ». */
export function ConsentStatus() {
  const { ready, mapAllowed } = useConsent();
  const label = !ready ? "lecture en cours…" : mapAllowed === null ? "aucun choix enregistré" : mapAllowed ? "carte interactive acceptée" : "carte interactive refusée";
  return <strong>{label}</strong>;
}
