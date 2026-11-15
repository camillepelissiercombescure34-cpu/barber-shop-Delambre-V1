import { brand } from "@/lib/data";

/**
 * Identité légale de l'éditeur du site.
 *
 * Les valeurs `null` s'affichent sur les pages légales avec une étiquette
 * « À compléter ». Elles ne doivent jamais être inventées : renseignez-les
 * à partir des documents officiels du salon (extrait Kbis / RNE, contrat d'hébergement…).
 */
export const legal = {
  lastUpdated: "15 novembre 2026",
  publisher: {
    tradeName: brand.name,
    /** Raison sociale, ou nom et prénom de l'entrepreneur individuel. */
    legalName: null as string | null,
    /** Ex. : SAS, SARL, entrepreneur individuel. */
    legalForm: null as string | null,
    /** Uniquement pour une société. */
    shareCapital: null as string | null,
    /** SIREN / SIRET et registre (RCS Paris ou Registre national des entreprises). */
    registration: null as string | null,
    vatNumber: null as string | null,
    publicationDirector: null as string | null,
    address: brand.address,
    phone: brand.phone,
    email: brand.email,
  },
  host: {
    name: null as string | null,
    address: null as string | null,
    contact: null as string | null,
    /** Pays dans lequel les données sont hébergées. */
    dataLocation: null as string | null,
  },
  /** Nom et coordonnées du médiateur de la consommation dont relève le salon. */
  mediator: null as string | null,
  /** Auteurs / licences des photographies utilisées sur le site. */
  photoCredits: null as string | null,
};
