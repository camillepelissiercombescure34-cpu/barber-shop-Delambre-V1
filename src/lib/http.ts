/** Lit un corps JSON et garantit un objet simple ; renvoie `null` si la requête est mal formée. */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    return typeof body === "object" && body !== null && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

/** Normalise un champ texte reçu du navigateur. */
export const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
