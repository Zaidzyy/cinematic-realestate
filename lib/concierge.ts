// Server-side retrieval for the concierge: embeds the residence corpus once,
// caches it in memory, and does cosine-similarity semantic search per query.
import { embed, embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { residences, type Residence } from "./residences";

const embeddingModel = google.embedding("gemini-embedding-001");

// A rich, embeddable string per residence — this is what similarity matches on.
function toEmbeddingText(r: Residence): string {
  return [
    `${r.name} in ${r.city}, ${r.country}.`,
    `${r.type}, ${r.beds} bedrooms, ${r.baths} bathrooms, ${r.sqft} sqft.`,
    `Price: $${r.price.toLocaleString()}.`,
    `Views: ${r.view.join(", ")}.`,
    `Features: ${r.features.join(", ")}.`,
    r.description,
  ].join(" ");
}

let cache: { id: string; vec: number[] }[] | null = null;

async function ensureEmbeddings() {
  if (cache) return cache;
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: residences.map(toEmbeddingText),
  });
  cache = residences.map((r, i) => ({ id: r.id, vec: embeddings[i] }));
  return cache;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

export async function retrieve(query: string, k = 5): Promise<Residence[]> {
  const store = await ensureEmbeddings();
  const { embedding } = await embed({ model: embeddingModel, value: query });
  const ranked = store
    .map((s) => ({ id: s.id, score: cosine(embedding, s.vec) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, k);
  return ranked
    .map((r) => residences.find((res) => res.id === r.id)!)
    .filter(Boolean);
}

// Structured filter — used by the model's tool call for hard constraints.
export function filterResidences(args: {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  country?: string;
  view?: string;
  type?: string;
}): Residence[] {
  return residences.filter((r) => {
    if (args.minPrice != null && r.price < args.minPrice) return false;
    if (args.maxPrice != null && r.price > args.maxPrice) return false;
    if (args.minBeds != null && r.beds < args.minBeds) return false;
    if (args.country && r.country.toLowerCase() !== args.country.toLowerCase())
      return false;
    if (args.view && !r.view.some((v) => v.toLowerCase() === args.view!.toLowerCase()))
      return false;
    if (args.type && r.type.toLowerCase() !== args.type.toLowerCase())
      return false;
    return true;
  });
}

export function liteResidence(r: Residence) {
  return {
    id: r.id,
    name: r.name,
    city: r.city,
    country: r.country,
    price: r.price,
    beds: r.beds,
    type: r.type,
    image: r.image,
  };
}
