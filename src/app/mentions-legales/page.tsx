import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Todo, Value } from "@/components/legal";
import { brand } from "@/lib/data";
import { legal } from "@/lib/legal";

export const metadata: Metadata = { title: "Mentions légales", description: `Mentions légales du site de ${brand.name}, ${brand.address}.` };

const sections = [
  { id: "editeur", label: "Éditeur du site" },
  { id: "publication", label: "Directeur de la publication" },
  { id: "hebergeur", label: "Hébergeur" },
  { id: "informations", label: "Informations, tarifs et horaires" },
  { id: "demandes", label: "Demandes en ligne" },
  { id: "propriete", label: "Propriété intellectuelle" },
  { id: "liens", label: "Liens externes" },
  { id: "donnees", label: "Données personnelles et cookies" },
  { id: "mediation", label: "Médiation de la consommation" },
  { id: "droit", label: "Droit applicable" },
];

export default function MentionsLegalesPage() {
  const { publisher, host } = legal;
  const incomplete = [publisher.legalName, publisher.legalForm, publisher.registration, publisher.publicationDirector, publisher.email, host.name, host.address, legal.mediator].some((value) => !value);

  return (
    <LegalPage eyebrow="Informations légales" title="Mentions légales" intro="Informations relatives à l'éditeur et à l'hébergeur de ce site, conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique." current="/mentions-legales" sections={sections}>
      {incomplete && (
        <div className="legal-callout">
          <p><strong>Page en cours de finalisation.</strong> Les informations signalées par la mention <Todo /> doivent être renseignées par l'exploitant du salon, à partir de ses documents officiels, avant la mise en ligne du site.</p>
        </div>
      )}

      <h2 id="editeur">1. Éditeur du site</h2>
      <dl className="legal-list">
        <div><dt>Nom commercial</dt><dd>{publisher.tradeName}</dd></div>
        <div><dt>Exploitant</dt><dd><Value value={publisher.legalName} hint="raison sociale ou nom de l'entrepreneur" /></dd></div>
        <div><dt>Forme juridique</dt><dd><Value value={publisher.legalForm} /></dd></div>
        <div><dt>Capital social</dt><dd><Value value={publisher.shareCapital} hint="uniquement pour une société" /></dd></div>
        <div><dt>Immatriculation</dt><dd><Value value={publisher.registration} hint="SIREN / SIRET, RCS ou RNE" /></dd></div>
        <div><dt>TVA intracommunautaire</dt><dd><Value value={publisher.vatNumber} hint="le cas échéant" /></dd></div>
        <div><dt>Adresse</dt><dd>{publisher.address}</dd></div>
        <div><dt>Téléphone</dt><dd><Value value={publisher.phone} /></dd></div>
        <div><dt>E-mail</dt><dd><Value value={publisher.email} /></dd></div>
      </dl>
      <p>{brand.name} exerce une activité de coiffure et de barbier pour hommes à l'adresse indiquée ci-dessus.</p>

      <h2 id="publication">2. Directeur de la publication</h2>
      <p><Value value={publisher.publicationDirector} hint="nom du représentant légal" /></p>

      <h2 id="hebergeur">3. Hébergeur</h2>
      <dl className="legal-list">
        <div><dt>Hébergeur</dt><dd><Value value={host.name} /></dd></div>
        <div><dt>Adresse</dt><dd><Value value={host.address} /></dd></div>
        <div><dt>Contact</dt><dd><Value value={host.contact} hint="téléphone ou page de contact" /></dd></div>
      </dl>

      <h2 id="informations">4. Informations, tarifs et horaires</h2>
      <p>Les informations publiées sur ce site — prestations, tarifs, horaires, produits — sont fournies à titre indicatif et peuvent être modifiées à tout moment. Les tarifs applicables sont ceux affichés au salon le jour de la prestation.</p>
      <p>Malgré le soin apporté à la mise à jour du site, une erreur ou une omission reste possible. N'hésitez pas à contacter le salon pour toute vérification.</p>

      <h2 id="demandes">5. Demandes en ligne</h2>
      <p>Le site permet d'adresser au salon des demandes de rendez-vous, de mise de côté de produits et de cartes cadeaux. <strong>Aucun paiement n'est effectué en ligne.</strong></p>
      <p>Une demande ne devient définitive qu'après confirmation par le salon ; le règlement s'effectue sur place.</p>

      <h2 id="propriete">6. Propriété intellectuelle</h2>
      <p>La structure du site, ses textes et ses éléments graphiques sont protégés par le droit de la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans autorisation préalable est interdite, sous réserve des exceptions prévues par la loi.</p>
      <p>Crédits photographiques : <Value value={legal.photoCredits} hint="auteurs et licences des photos" /></p>

      <h2 id="liens">7. Liens externes</h2>
      <p>Le site propose des liens vers des services tiers, notamment Google Maps et OpenStreetMap. {brand.name} n'exerce aucun contrôle sur ces services et ne saurait être tenu responsable de leur contenu ni de leurs pratiques en matière de données personnelles.</p>

      <h2 id="donnees">8. Données personnelles et cookies</h2>
      <p>Le traitement des informations saisies dans les formulaires est décrit dans la <Link href="/politique-de-confidentialite">politique de confidentialité</Link>. Les éléments stockés sur votre appareil et les contenus tiers sont détaillés dans la <Link href="/politique-cookies">politique de cookies</Link>.</p>

      <h2 id="mediation">9. Médiation de la consommation</h2>
      <p>Conformément aux articles L. 612-1 et suivants du Code de la consommation, tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige l'opposant à un professionnel, après une première réclamation écrite restée sans réponse satisfaisante.</p>
      <p>Médiateur compétent : <Value value={legal.mediator} hint="nom et coordonnées du médiateur" /></p>

      <h2 id="droit">10. Droit applicable</h2>
      <p>Le présent site et ses mentions légales sont soumis au droit français.</p>
      <p>Pour toute question relative au site, vous pouvez utiliser le <Link href="/contact">formulaire de contact</Link>{publisher.phone ? ` ou appeler le salon au ${publisher.phone}` : ""}.</p>
    </LegalPage>
  );
}
