import type { Metadata } from "next";
import Link from "next/link";
import { ConsentStatus, ManageCookiesButton } from "@/components/consent";
import { LegalPage } from "@/components/legal";
import { brand } from "@/lib/data";
import { CART_STORAGE_KEY, CONSENT_MAX_AGE_DAYS, CONSENT_STORAGE_KEY } from "@/lib/storage-keys";

export const metadata: Metadata = { title: "Politique de cookies", description: `Cookies, stockage local et contenus tiers utilisés sur le site de ${brand.name}, et moyens de gérer vos préférences.` };

const sections = [
  { id: "definition", label: "Cookies et traceurs" },
  { id: "utilises", label: "Ce que le site utilise" },
  { id: "tiers", label: "Contenus tiers" },
  { id: "absents", label: "Ce que le site n'utilise pas" },
  { id: "preferences", label: "Gérer vos préférences" },
  { id: "contact", label: "Une question ?" },
];

const consentMonths = Math.round(CONSENT_MAX_AGE_DAYS / 30.4);

export default function PolitiqueCookiesPage() {
  return (
    <LegalPage eyebrow="Transparence" title="Politique de cookies" intro="Cette page décrit précisément ce que le site enregistre sur votre appareil, les contenus fournis par des tiers et la manière de modifier vos choix à tout moment." current="/politique-cookies" sections={sections}>
      <div className="legal-callout">
        <p><strong>En bref.</strong> Le site ne dépose aucun cookie publicitaire ni de mesure d'audience. Il utilise uniquement deux éléments de stockage local, strictement nécessaires, et n'affiche la carte interactive — fournie par un tiers — qu'avec votre accord.</p>
      </div>

      <h2 id="definition">1. Cookies et traceurs : de quoi parle-t-on ?</h2>
      <p>Un cookie est un petit fichier déposé sur votre appareil par un site web. D'autres techniques, comme le « stockage local » du navigateur, permettent également de conserver des informations sur votre appareil : on parle plus largement de « traceurs ».</p>
      <p>Certains traceurs sont indispensables au fonctionnement d'un service que vous demandez ; d'autres, comme la publicité ciblée ou la mesure d'audience, nécessitent votre consentement préalable.</p>

      <h2 id="utilises">2. Ce que le site utilise</h2>
      <p>Le site ne dépose <strong>aucun cookie</strong>. Il enregistre uniquement les deux éléments suivants dans le stockage local de votre navigateur :</p>
      <div className="overflow-x-auto">
        <table className="legal-table">
          <thead><tr><th scope="col">Nom</th><th scope="col">Finalité</th><th scope="col">Durée</th></tr></thead>
          <tbody>
            <tr><td><code>{CART_STORAGE_KEY}</code></td><td>Mémoriser le contenu de votre panier (produits, cartes cadeaux) d'une page à l'autre</td><td>Jusqu'à la validation de la demande, au vidage du panier ou à l'effacement des données du navigateur</td></tr>
            <tr><td><code>{CONSENT_STORAGE_KEY}</code></td><td>Mémoriser votre choix concernant l'affichage de la carte interactive</td><td>{consentMonths} mois ; passé ce délai, votre accord est de nouveau nécessaire pour afficher la carte</td></tr>
          </tbody>
        </table>
      </div>
      <p>Ces éléments sont strictement nécessaires à des fonctionnalités que vous utilisez ; ils sont à ce titre dispensés de consentement (article 82 de la loi Informatique et Libertés). Ils restent sur votre appareil : le contenu du panier n'est transmis au salon que lorsque vous validez une demande.</p>

      <h2 id="tiers">3. Contenus tiers</h2>
      <h3>Carte interactive — OpenStreetMap</h3>
      <p>La carte proposée sur les pages Accueil, Localisation et Contact est fournie par OpenStreetMap (OpenStreetMap Foundation). <strong>Elle n'est chargée qu'après votre accord</strong>, que vous donnez en cliquant sur « Afficher la carte ». Tant que vous ne l'avez pas acceptée, aucune connexion n'est établie avec ce service : c'est pourquoi aucun bandeau ne vous est imposé à votre arrivée sur le site.</p>
      <p>Son affichage entraîne une connexion directe de votre navigateur aux serveurs d'OpenStreetMap, qui reçoivent alors votre adresse IP et peuvent déposer leurs propres traceurs. Pour en savoir plus : <a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noreferrer">politique de confidentialité d'OpenStreetMap</a>.</p>
      <h3>Liens vers des services externes</h3>
      <p>Les liens « Itinéraire », « Google Maps », « OpenStreetMap » et « Voir les avis sur Google » ouvrent ces services dans un nouvel onglet. Aucune information n'est transmise avant que vous ne cliquiez ; une fois sur ces sites, leurs propres politiques s'appliquent.</p>

      <h2 id="absents">4. Ce que le site n'utilise pas</h2>
      <ul>
        <li>Aucun outil de mesure d'audience.</li>
        <li>Aucune publicité, aucun traceur de réseau social.</li>
        <li>Aucune police ni image chargée depuis un serveur tiers : elles sont hébergées avec le site.</li>
      </ul>

      <h2 id="preferences">5. Gérer vos préférences</h2>
      <p>Votre choix actuel : <ConsentStatus />.</p>
      <p>Vous pouvez le modifier à tout moment à l'aide du bouton ci-dessous, ou du lien « Gérer les cookies » présent en bas de chaque page.</p>
      <p><ManageCookiesButton className="btn btn-primary mt-3">Modifier mon choix</ManageCookiesButton></p>
      <p>Vous pouvez également supprimer les éléments enregistrés par le site depuis les paramètres de votre navigateur (rubrique « Confidentialité » ou « Données de sites »). Votre panier sera alors vidé et votre choix concernant la carte vous sera redemandé.</p>

      <h2 id="contact">6. Une question ?</h2>
      <p>Pour toute question sur cette politique, utilisez le <Link href="/contact?objet=donnees">formulaire de contact</Link>. Le traitement des informations saisies dans les formulaires est décrit dans la <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.</p>
    </LegalPage>
  );
}
