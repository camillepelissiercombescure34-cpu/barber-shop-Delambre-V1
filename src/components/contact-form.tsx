"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { SuccessPanel } from "@/components/ui";

export const contactSubjects = ["Question générale", "Rendez-vous", "Produits & cartes cadeaux", "Mes données personnelles", "Autre demande"] as const;

/** Sujets présélectionnables par lien, par exemple `/contact?objet=rdv`. */
const subjectByTopic: Record<string, string> = {
  rdv: "Rendez-vous",
  boutique: "Produits & cartes cadeaux",
  donnees: "Mes données personnelles",
  autre: "Autre demande",
};

export default function ContactForm({ initialTopic = "" }: { initialTopic?: string }) {
  const initialSubject = subjectByTopic[initialTopic] ?? contactSubjects[0];
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.get("name"), email: data.get("email"), phone: data.get("phone"), subject: data.get("subject"), message: data.get("message") }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Une erreur est survenue.");
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return <SuccessPanel title="Message enregistré" message="Merci. Votre message a bien été enregistré et transmis au salon." action={<button type="button" onClick={() => setStatus("idle")} className="btn btn-outline">Écrire un autre message</button>} />;
  }

  return (
    <form onSubmit={submit} className="card-surface p-6 sm:p-9">
      <span className="eyebrow">Écrivez-nous</span>
      <h2 className="display mt-3 text-3xl sm:text-4xl">Un mot, une question</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div><label className="field-label" htmlFor="contact-name">Nom complet *</label><input id="contact-name" name="name" required minLength={2} maxLength={120} autoComplete="name" className="field" placeholder="Votre nom" /></div>
        <div><label className="field-label" htmlFor="contact-email">E-mail *</label><input id="contact-email" name="email" type="email" required maxLength={160} autoComplete="email" className="field" placeholder="vous@exemple.fr" /></div>
        <div><label className="field-label" htmlFor="contact-phone">Téléphone</label><input id="contact-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className="field" placeholder="Facultatif" /></div>
        <div><label className="field-label" htmlFor="contact-subject">Sujet *</label><select id="contact-subject" name="subject" defaultValue={initialSubject} className="field bg-coal-3">{contactSubjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select></div>
        <div className="sm:col-span-2"><label className="field-label" htmlFor="contact-message">Message *</label><textarea id="contact-message" name="message" required minLength={10} maxLength={3000} rows={6} className="field resize-none" placeholder="Votre message. Pour un rendez-vous existant, indiquez sa référence." /></div>
      </div>
      {status === "error" && <p className="mt-4 text-sm text-red-300" role="alert">{error}</p>}
      <p className="mt-5 text-xs leading-relaxed text-stone">Les informations saisies servent uniquement à répondre à votre demande. <Link href="/politique-de-confidentialite" className="text-brass underline underline-offset-4 hover:text-brass-light">Politique de confidentialité</Link></p>
      <button type="submit" disabled={status === "loading"} className="btn btn-primary mt-7 w-full sm:w-auto">{status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Envoi…</> : "Envoyer le message"}</button>
    </form>
  );
}
