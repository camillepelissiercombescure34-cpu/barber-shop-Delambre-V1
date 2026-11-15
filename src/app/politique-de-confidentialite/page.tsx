import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Value } from "@/components/legal";
import { brand } from "@/lib/data";
import { legal } from "@/lib/legal";
import { retention } from "@/lib/retention";

export const metadata: Metadata = { title: "Politique de confidentialité", description: `Données personnelles collectées sur le site de ${brand.name} : finalités, durées de conservation et droits.` };

const sections = [
  { id: "responsable", label: "Responsable du traitement" },
  { id: "donnees", label: "Données collectées" },
  { id: "non-collecte", label: "Ce que nous ne collectons pas" },
  { id: "destinataires", label: "Destinataires" },
  { id: "durees", label: "Durées de conservation" },
  { id: "hebergement", label: "Hébergement des données" },
  { id: "droits", label: "Vos droits" },
  { id: "securite", label: "Sécurité" },
  { id: "cookies", label: "Cookies et contenus tiers" },
  { id: "evolution", label: "Évolution de la politique" },
];

export default function PolitiqueConfidentialitePage() {
  const { publisher, host } = legal;

  return (
    <LegalPage eyebrow="Vos données" title="Politique de confidentialité" intro="Cette page explique quelles informations personnelles sont collectées sur ce site, dans quel but, pendant combien de temps, et comment exercer vos droits." current="/politique-de-confidentialite" sections={sections}>
      <div className="legal-callout">
        <p><strong>En bref.</strong> Nous ne collectons que les informations que vous saisissez dans nos formulaires, uniquement pour traiter votre demande. Pas de compte client, pas de paiement en ligne, pas de publicité, pas de mesure d'audience.</p>
      </div>

      <h2 id="responsable">1. Responsable du traitement</h2>
      <p>Le responsable du traitement est l'exploitant du salon {brand.name}, {publisher.address} — <Value value={publisher.legalName} hint="raison sociale ou nom de l'entrepreneur" />. Son identité complète figure dans les <Link href="/mentions-legales">mentions légales</Link>.</p>
      <p>Pour toute question relative à vos données, vous pouvez nous écrire à l'adresse postale ci-dessus, utiliser le <Link href="/contact?objet=donnees">formulaire de contact</Link>{publisher.phone ? `, appeler le ${publisher.phone}` : ""} ou envoyer un e-mail à : <Value value={publisher.email} hint="adresse e-mail de contact" /></p>

      <h2 id="donnees">2. Données collectées et finalités</h2>
      <p>Les seules données personnelles traitées sont celles que vous nous transmettez volontairement :</p>
      <div className="overflow-x-auto">
        <table className="legal-table">
          <thead><tr><th scope="col">Formulaire</th><th scope="col">Données</th><th scope="col">Finalité</th><th scope="col">Base légale</th></tr></thead>
          <tbody>
            <tr><td>Demande de rendez-vous</td><td>Nom, e-mail, téléphone, prestation, date et heure souhaitées, précision facultative</td><td>Enregistrer votre demande, vous recontacter et gérer le rendez-vous</td><td>Mesures précontractuelles prises à votre demande (art. 6.1.b du RGPD)</td></tr>
            <tr><td>Formulaire de contact</td><td>Nom, e-mail, téléphone (facultatif), sujet, message</td><td>Répondre à votre message</td><td>Intérêt légitime à répondre aux sollicitations (art. 6.1.f du RGPD)</td></tr>
            <tr><td>Demande de produits ou de carte cadeau</td><td>Nom, e-mail, téléphone, articles et montants</td><td>Préparer votre demande en vue d'un retrait au salon</td><td>Mesures précontractuelles prises à votre demande (art. 6.1.b du RGPD)</td></tr>
          </tbody>
        </table>
      </div>
      <p>Les champs marqués d'un astérisque sont nécessaires au traitement de la demande. Merci de ne pas indiquer d'informations sensibles (santé, par exemple) dans les champs libres.</p>

      <h2 id="non-collecte">3. Ce que nous ne collectons pas</h2>
      <ul>
        <li>Aucune donnée bancaire : le site ne propose pas de paiement en ligne.</li>
        <li>Aucun compte client ni mot de passe.</li>
        <li>Aucune donnée de navigation à des fins publicitaires ou de mesure d'audience.</li>
        <li>Aucun profilage et aucune prospection commerciale : vos coordonnées ne servent qu'à traiter votre demande.</li>
      </ul>

      <h2 id="destinataires">4. Destinataires</h2>
      <p>Vos données sont destinées au personnel habilité du salon. Elles sont hébergées par notre prestataire technique (<Value value={host.name} hint="nom de l'hébergeur" />), qui intervient en qualité de sous-traitant et uniquement sur nos instructions.</p>
      <p>Elles ne sont ni vendues, ni louées, ni cédées à des tiers.</p>

      <h2 id="durees">5. Durées de conservation</h2>
      <div className="overflow-x-auto">
        <table className="legal-table">
          <thead><tr><th scope="col">Données</th><th scope="col">Durée de conservation</th></tr></thead>
          <tbody>
            <tr><td>Demandes de rendez-vous</td><td>{retention.bookingsMonths} mois après la date du rendez-vous</td></tr>
            <tr><td>Messages du formulaire de contact</td><td>{retention.contactMonths} mois après leur réception</td></tr>
            <tr><td>Demandes de produits et de cartes cadeaux</td><td>{retention.ordersMonths} mois après la demande</td></tr>
          </tbody>
        </table>
      </div>
      <p>À l'issue de ces délais, les données sont supprimées automatiquement de la base du site. Vous pouvez demander leur suppression avant ce terme (voir « Vos droits »).</p>

      <h2 id="hebergement">6. Hébergement des données</h2>
      <p>Les données sont stockées sur les serveurs de notre hébergeur. Lieu d'hébergement : <Value value={host.dataLocation} hint="pays d'hébergement" /></p>
      <p>Si un prestataire situé hors de l'Union européenne devait intervenir, le transfert serait encadré par les garanties prévues par le RGPD, notamment les clauses contractuelles types de la Commission européenne.</p>

      <h2 id="droits">7. Vos droits</h2>
      <p>Conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>accès</strong> : obtenir la confirmation que des données vous concernant sont traitées, et en recevoir une copie ;</li>
        <li><strong>rectification</strong> : faire corriger des données inexactes ou incomplètes ;</li>
        <li><strong>effacement</strong> : demander la suppression de vos données ;</li>
        <li><strong>limitation</strong> et <strong>opposition</strong> : demander la suspension d'un traitement ou vous y opposer pour des raisons tenant à votre situation ;</li>
        <li><strong>portabilité</strong> : recevoir les données que vous avez fournies dans un format structuré ;</li>
        <li><strong>directives post-mortem</strong> : définir le sort de vos données après votre décès.</li>
      </ul>
      <p>Pour exercer ces droits, contactez-nous par l'un des moyens indiqués à la section 1 en précisant votre demande et, si possible, la référence de votre rendez-vous ou de votre commande. Un justificatif d'identité peut être demandé en cas de doute raisonnable. Une réponse vous est apportée dans un délai d'un mois.</p>
      <p>Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL — 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">www.cnil.fr</a>.</p>

      <h2 id="securite">8. Sécurité</h2>
      <p>L'accès aux données est limité aux seules personnes qui en ont besoin pour traiter votre demande. Les formulaires ne demandent que les informations strictement nécessaires, et les prix comme les disponibilités sont toujours vérifiés par le serveur.</p>

      <h2 id="cookies">9. Cookies et contenus tiers</h2>
      <p>Le site n'utilise aucun cookie publicitaire ni de mesure d'audience. Le détail des éléments stockés sur votre appareil et le fonctionnement de la carte interactive sont présentés dans la <Link href="/politique-cookies">politique de cookies</Link>.</p>

      <h2 id="evolution">10. Évolution de la politique</h2>
      <p>Cette politique peut être mise à jour pour tenir compte d'une évolution du site ou de la réglementation. La date de dernière mise à jour figure en marge de cette page : {legal.lastUpdated}.</p>
    </LegalPage>
  );
}
