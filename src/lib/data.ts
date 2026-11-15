/**
 * Source unique des informations du salon.
 *
 * Les éléments marqués « À CONFIRMER » proviennent d'annuaires publics ou sont
 * donnés à titre indicatif : ils doivent être validés par le salon avant la mise en ligne.
 * Rien n'est inventé ici : ni barbier fictif, ni avis client, ni historique.
 */

export const brand = {
  name: "Barber Shop 32",
  activity: "Barbier & coiffeur homme",
  street: "32 rue Delambre",
  postalCode: "75014",
  city: "Paris",
  address: "32 rue Delambre, 75014 Paris",
  district: "Paris 14e",
  quarter: "Montparnasse",
  // À CONFIRMER — numéro relevé à l'identique dans plusieurs annuaires publics.
  phone: "07 85 08 86 47" as string | null,
  phoneHref: "tel:+33785088647" as string | null,
  // À COMPLÉTER — aucune adresse e-mail publique n'a été trouvée.
  email: null as string | null,
  coordinates: { lat: 48.8414634, lon: 2.3258885 },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Barber+Shop+32%2C+32+rue+Delambre%2C+75014+Paris",
  osmUrl: "https://www.openstreetmap.org/?mlat=48.8414634&mlon=2.3258885#map=18/48.8414634/2.3258885",
};

/** Photographies fournies pour le site (hébergées localement dans /public/images). */
export const images = {
  hero: "/images/hero.jpg",
  salon: "/images/salon.jpg",
  degrade: "/images/degrade.jpg",
  coupe: "/images/coupe.jpg",
  tondeuse: "/images/tondeuse.jpg",
  produits: "/images/produits.jpg",
  fauteuil: "/images/fauteuil.jpg",
  barbe: "/images/barbe.jpg",
} as const;

/* ------------------------------------------------------------------ */
/* Prestations                                                         */
/* ------------------------------------------------------------------ */

export type ServiceCategory = "Coupe" | "Barbe" | "Rasage";
export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  duration: number;
  tag?: string;
};

export const serviceCategories = ["Toutes", "Coupe", "Barbe", "Rasage"] as const;

// À CONFIRMER — aucune grille tarifaire publique fiable n'a été trouvée.
// Les montants ci-dessous sont volontairement bas et purement indicatifs.
export const services: Service[] = [
  { id: "coupe", name: "Coupe homme", category: "Coupe", description: "Coupe à la tondeuse et aux ciseaux, finitions et coiffage.", price: 15, duration: 30 },
  { id: "degrade", name: "Dégradé", category: "Coupe", description: "Dégradé bas, moyen ou haut, fondu régulier et contours tracés.", price: 18, duration: 30 },
  { id: "coupe-barbe", name: "Coupe + barbe", category: "Barbe", description: "La coupe homme et la taille de barbe dans le même rendez-vous.", price: 22, duration: 45, tag: "Formule" },
  { id: "barbe", name: "Taille de barbe", category: "Barbe", description: "Taille, mise en forme et contours de la barbe.", price: 10, duration: 15 },
  { id: "rasage", name: "Rasage à la serviette chaude", category: "Rasage", description: "Rasage complet du visage, préparé à la serviette chaude.", price: 12, duration: 30 },
  { id: "crane", name: "Rasage du crâne", category: "Rasage", description: "Rasage intégral du crâne, net et régulier.", price: 10, duration: 15 },
];

export const pricesNotice = "Tarifs indicatifs, confirmés au salon avant la prestation.";

/* ------------------------------------------------------------------ */
/* Équipe                                                              */
/* ------------------------------------------------------------------ */

export type Barber = { id: string; name: string; role: string; specialty: string; bio: string; image: string };

/**
 * Volontairement vide : aucun barbier n'est inventé.
 * Ajoutez ici les membres réels de l'équipe (avec leur accord et leur photo) :
 * la section « L'équipe » et l'étape « Choix du barbier » de la réservation
 * apparaissent alors automatiquement.
 */
export const barbers: Barber[] = [];

/** Nombre de rendez-vous simultanés acceptés en ligne tant que l'équipe n'est pas renseignée. */
export const bookingCapacity = 1;

/* ------------------------------------------------------------------ */
/* Savoir-faire                                                        */
/* ------------------------------------------------------------------ */

export const crafts = [
  { id: "degrades", title: "Dégradés", tag: "Tondeuse & rasoir", text: "Bas, moyen ou haut : un fondu régulier et des contours tracés net.", image: images.degrade, alt: "Dégradé en cours de réalisation, contour tracé au rasoir", serviceId: "degrade" },
  { id: "ciseaux", title: "Coupes aux ciseaux", tag: "Peigne & ciseaux", text: "Coupes classiques ou texturées, travaillées mèche à mèche.", image: images.coupe, alt: "Coupe texturée travaillée au peigne", serviceId: "coupe" },
  { id: "barbes", title: "Barbes", tag: "Taille & contours", text: "Taille, mise en forme et contours pour une barbe nette, courte ou longue.", image: images.barbe, alt: "Taille de barbe aux ciseaux", serviceId: "barbe" },
  { id: "finitions", title: "Finitions", tag: "Nuque & pattes", text: "Nuque, pattes, tour d'oreille : les détails qui font une coupe propre.", image: images.tondeuse, alt: "Finition de la nuque à la tondeuse", serviceId: "coupe-barbe" },
] as const;

/* ------------------------------------------------------------------ */
/* Boutique                                                            */
/* ------------------------------------------------------------------ */

export type ProductCategory = "Coiffage" | "Barbe" | "Accessoires";
export type Product = { id: string; name: string; category: ProductCategory; description: string; price: number };
export const productCategories = ["Tous", "Coiffage", "Barbe", "Accessoires"] as const;

// À CONFIRMER — sélection générique et prix indicatifs, à remplacer par le stock réel du salon.
export const products: Product[] = [
  { id: "cire-mate", name: "Cire coiffante mate", category: "Coiffage", description: "Tenue forte et fini mat pour les coupes courtes et texturées.", price: 10 },
  { id: "pommade", name: "Pommade brillante", category: "Coiffage", description: "Tenue souple et brillance pour les coiffages plaqués.", price: 10 },
  { id: "spray-texture", name: "Spray texturisant", category: "Coiffage", description: "Du volume et de la matière en quelques pulvérisations.", price: 9 },
  { id: "huile-barbe", name: "Huile à barbe", category: "Barbe", description: "Assouplit le poil et hydrate la peau sous la barbe.", price: 9 },
  { id: "baume-barbe", name: "Baume à barbe", category: "Barbe", description: "Discipline et nourrit les barbes moyennes à longues.", price: 9 },
  { id: "peigne", name: "Peigne de poche", category: "Accessoires", description: "Pour les cheveux comme pour la barbe, à glisser partout.", price: 4 },
];

export const shopNotice = "Sélection et prix indicatifs, selon disponibilité au salon.";
export const giftCardPresets = [15, 22, 30, 50] as const;
export const giftCardRange = { min: 10, max: 200 } as const;

/* ------------------------------------------------------------------ */
/* Galerie                                                             */
/* ------------------------------------------------------------------ */

export type GalleryCategory = "Coupes" | "Barbe" | "Salon";
export type GalleryItem = { id: string; title: string; category: GalleryCategory; image: string };
export const galleryCategories = ["Toutes", "Coupes", "Barbe", "Salon"] as const;
export const galleryItems: GalleryItem[] = [
  { id: "g1", title: "Dégradé et tracé au rasoir", category: "Coupes", image: images.degrade },
  { id: "g2", title: "Taille de barbe aux ciseaux", category: "Barbe", image: images.barbe },
  { id: "g3", title: "L'esprit barber shop", category: "Salon", image: images.salon },
  { id: "g4", title: "Coupe texturée", category: "Coupes", image: images.coupe },
  { id: "g5", title: "Finitions à la tondeuse", category: "Coupes", image: images.tondeuse },
  { id: "g6", title: "Le fauteuil", category: "Salon", image: images.fauteuil },
  { id: "g7", title: "Barbe aux ciseaux", category: "Barbe", image: images.hero },
  { id: "g8", title: "Outils et produits", category: "Salon", image: images.produits },
];

/* ------------------------------------------------------------------ */
/* Horaires                                                            */
/* ------------------------------------------------------------------ */

/** `dow` suit la convention JavaScript : 0 = dimanche … 6 = samedi. */
export type DayHours = { dow: number; day: string; ranges: [string, string][] };

// À CONFIRMER — horaires relevés dans un annuaire public ; ils diffèrent légèrement d'une source à l'autre.
// Cette liste alimente à la fois l'affichage et les créneaux proposés à la réservation.
export const weeklyHours: DayHours[] = [
  { dow: 1, day: "Lundi", ranges: [["09:30", "20:00"]] },
  { dow: 2, day: "Mardi", ranges: [["09:30", "20:00"]] },
  { dow: 3, day: "Mercredi", ranges: [["09:30", "20:00"]] },
  { dow: 4, day: "Jeudi", ranges: [["09:30", "20:00"]] },
  { dow: 5, day: "Vendredi", ranges: [["09:00", "13:00"], ["14:00", "20:00"]] },
  { dow: 6, day: "Samedi", ranges: [["09:30", "20:00"]] },
  { dow: 0, day: "Dimanche", ranges: [["10:00", "19:00"]] },
];

export const hoursNotice = "Horaires indicatifs, susceptibles de varier les jours fériés.";
export const openDaysCount = weeklyHours.filter((day) => day.ranges.length > 0).length;
export const openDaysLabel = openDaysCount === 7 ? "Ouvert 7 jours sur 7" : `Ouvert ${openDaysCount} jours sur 7`;
export const formatRanges = (ranges: [string, string][]) => ranges.length > 0 ? ranges.map(([open, close]) => `${open} – ${close}`).join(" · ") : "Fermé";

/* ------------------------------------------------------------------ */
/* Accès                                                               */
/* ------------------------------------------------------------------ */

export const transport = [
  { mode: "Métro", name: "Edgar Quinet", detail: "Ligne 6" },
  { mode: "Métro", name: "Vavin", detail: "Ligne 4" },
  { mode: "Métro", name: "Montparnasse – Bienvenüe", detail: "Lignes 4, 6, 12 et 13" },
  { mode: "Train", name: "Gare Montparnasse", detail: "TGV, TER et Transilien N" },
] as const;

/* ------------------------------------------------------------------ */
/* Éditorial                                                           */
/* ------------------------------------------------------------------ */

export const formatPrice = (price: number) => `${price} €`;
export const formatDuration = (duration: number) => duration >= 60 ? `${Math.floor(duration / 60)} h${duration % 60 ? ` ${duration % 60}` : ""}` : `${duration} min`;
export const getService = (id: string) => services.find((service) => service.id === id);
export const getProduct = (id: string) => products.find((product) => product.id === id);

const referencePrice = getService("coupe")?.price ?? Math.min(...services.map((service) => service.price));

/** Bandeau de repères du hero : uniquement des faits vérifiables. */
export const highlights = [
  { value: "32", label: "rue Delambre" },
  { value: "14e", label: "Paris · Montparnasse" },
  { value: `${openDaysCount}j/7`, label: "jours d'ouverture" },
  { value: formatPrice(referencePrice), label: "coupe homme · tarif indicatif" },
];

export const values = [
  { number: "01", title: "Des prix accessibles", text: "Une coupe soignée ne devrait pas être un luxe : nos tarifs restent volontairement doux." },
  { number: "02", title: openDaysLabel, text: "En semaine comme le week-end. Les horaires détaillés figurent sur la page Localisation." },
  { number: "03", title: "Au cœur de Montparnasse", text: "À deux pas des stations Edgar Quinet, Vavin et Montparnasse – Bienvenüe." },
];

const phoneSentence = brand.phone ? ` Vous pouvez aussi appeler le salon au ${brand.phone}.` : "";
const phoneFirst = brand.phone ? `Appelez le salon dès que possible au ${brand.phone}, ou utilisez` : "Utilisez";

export const faqs = [
  { question: "Comment prendre rendez-vous ?", answer: `Directement en ligne depuis la page Réservation : choisissez la prestation, le jour et l'heure, puis laissez vos coordonnées.${phoneSentence}` },
  { question: "Les tarifs affichés sont-ils définitifs ?", answer: "Ils sont donnés à titre indicatif. Le prix dépend de la prestation réalisée et vous est confirmé au salon avant de commencer." },
  { question: "Comment modifier ou annuler un rendez-vous ?", answer: `${phoneFirst} le formulaire de contact en indiquant la référence reçue lors de votre demande.` },
  { question: "Quels sont les horaires d'ouverture ?", answer: `${openDaysLabel}. Les horaires détaillés figurent sur la page Localisation ; ils peuvent varier les jours fériés.` },
  { question: "Où se trouve le salon ?", answer: `Au ${brand.address}, dans le quartier du Montparnasse. Les stations Edgar Quinet (ligne 6), Vavin (ligne 4) et Montparnasse – Bienvenüe (lignes 4, 6, 12 et 13) sont à proximité.` },
  { question: "Que deviennent les informations saisies dans les formulaires ?", answer: "Elles servent uniquement à traiter votre demande de rendez-vous, votre message ou votre commande. Le détail figure dans notre politique de confidentialité." },
];
