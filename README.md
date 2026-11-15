# Barber Shop 32

Site du salon **Barber Shop 32**, 32 rue Delambre, 75014 Paris (quartier du Montparnasse).
Next.js (App Router), Tailwind CSS 4, PostgreSQL et Drizzle ORM. La structure reprend la logique
éditoriale du template Fade : hero immersif, carte tarifaire en deux colonnes, rangée de quatre cartes,
galerie filtrable, réservation par étapes, boutique, horaires et localisation.

## Principe : rien d'inventé

Le site ne contient ni barbier fictif, ni avis client, ni historique imaginaire. Toutes les informations
du salon sont centralisées dans `src/lib/data.ts`, où chaque donnée non vérifiée porte un commentaire
`À CONFIRMER`.

| Donnée | Statut | Où la modifier |
| --- | --- | --- |
| Nom, adresse, quartier | Fournis par le salon | `brand` |
| Téléphone | Relevé dans plusieurs annuaires publics — à confirmer | `brand.phone`, `brand.phoneHref` |
| E-mail | Inconnu (`null`, donc masqué partout) | `brand.email` |
| Horaires | Relevés dans un annuaire public — à confirmer | `weeklyHours` |
| Prestations et tarifs | Indicatifs (aucune grille publique fiable) | `services` |
| Produits et cartes cadeaux | Sélection générique indicative | `products`, `giftCardPresets` |
| Équipe | Vide, volontairement | `barbers` |
| Identité légale, hébergeur, médiateur | À compléter | `src/lib/legal.ts` |

Ajouter de vrais barbiers dans `barbers` fait apparaître automatiquement la section « L'équipe »
et l'étape « Choix du barbier » de la réservation.

## Pages

- `/` — accueil : hero, présentation, tarifs, savoir-faire, galerie, réservation, boutique, horaires, avis, appels à l'action
- `/prestations` — carte filtrable, tarifs, durées et FAQ
- `/savoir-faire` — spécialités, méthode et outils (remplace l'ancienne page « Équipe » ; `/equipe` y redirige)
- `/reservation` — parcours par étapes, présélection possible par URL (`?service=degrade`)
- `/boutique` — produits filtrables, panier persistant et cartes cadeaux
- `/localisation` — horaires, carte, transports et itinéraire
- `/a-propos` — présentation du salon, approche et quartier
- `/contact` — formulaire enregistré en base et coordonnées (`?objet=rdv|boutique|donnees|autre`)
- `/mentions-legales`, `/politique-de-confidentialite`, `/politique-cookies`

## Architecture

- `src/lib/data.ts` — contenu, catalogue, horaires et typages.
- `src/lib/booking.ts` — règles de réservation partagées (créneaux dérivés des horaires, heure de Paris).
- `src/lib/booking-provider.ts` — interface `BookingProvider` et implémentation PostgreSQL.
- `src/lib/retention.ts` — durées de conservation et purge automatique.
- `src/lib/legal.ts`, `src/lib/storage-keys.ts` — données affichées par les pages légales.
- `src/components/ui.tsx`, `sections.tsx` — briques réutilisables (titres, héros, tarifs, horaires, carte…).
- `src/components/consent.tsx`, `map-embed.tsx` — consentement et carte chargée à la demande.
- `src/app/api/*` — validation serveur et écriture Drizzle.
- `src/db/schema.ts` — `bookings`, `contact_messages`, `shop_orders`, `shop_order_items`.

## Réservation

Le navigateur ne connaît que `/api/bookings`. Le serveur calcule les créneaux à partir de `weeklyHours`
et de la durée de la prestation, écarte les créneaux passés (heure de Paris) et ceux qui chevauchent
une demande existante. La capacité vaut le nombre de barbiers renseignés, ou `bookingCapacity`
(1 par défaut) tant que l'équipe est vide. Un verrou transactionnel empêche deux demandes simultanées
d'obtenir le même créneau.

Pour brancher un agenda externe (Fresha, Planity, Calendly…), implémentez `BookingProvider`
(`create`, `getUnavailableSlots`) et remplacez l'export `bookingProvider`.

**À connecter avant la mise en ligne :** les demandes (rendez-vous, messages, commandes) sont
enregistrées en base, mais aucune notification n'est envoyée au salon et il n'existe pas encore
d'interface pour les consulter.

## Confidentialité

- Aucun cookie. Deux clés de stockage local : panier et choix concernant la carte.
- Polices (`@fontsource`) et images hébergées avec le site : aucun appel à un serveur tiers.
- Carte OpenStreetMap chargée uniquement après accord, mémorisé six mois.
- Données supprimées automatiquement après 12 mois (réglable dans `src/lib/retention.ts`,
  valeurs reprises dans la politique de confidentialité).

## Développement

```bash
npx drizzle-kit push
npm run dev
```
