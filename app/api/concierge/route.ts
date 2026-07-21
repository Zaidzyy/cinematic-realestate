import { google } from "@ai-sdk/google";
import { streamText, tool, stepCountIs, type ModelMessage } from "ai";
import { z } from "zod";
import { retrieve, filterResidences, liteResidence } from "@/lib/concierge";

// Allow up to 30s for streaming on Vercel.
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: ModelMessage[] } = await req.json();

  const lastUser = [...messages]
    .reverse()
    .find((m) => m.role === "user")?.content;
  const query = typeof lastUser === "string" ? lastUser : "";

  // Semantic retrieval — always grounds the answer in real listings.
  const matches = await retrieve(query, 5);
  const context = matches
    .map(
      (r) =>
        `- ${r.name} — ${r.city}, ${r.country}. $${r.price.toLocaleString()}, ${r.beds} bed / ${r.baths} bath, ${r.type}. Views: ${r.view.join(", ")}. Features: ${r.features.join(", ")}. ${r.description}`
    )
    .join("\n");

  const system = `You are the private concierge for Kavya Estates, a luxury real-estate house.
Speak warmly, precisely, and briefly — like a discreet advisor, never a salesperson. Keep replies to a few sentences.
Recommend residences by name from the shortlist below (and from the filter_residences tool when a buyer gives hard constraints like a budget or bedroom count). Reference concrete details — price, location, view, a standout feature. If nothing genuinely fits the brief, say so honestly rather than forcing a match. Never invent residences, prices, or features that are not provided.

Shortlisted residences (semantically matched to the buyer's request):
${context}`;

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system,
    messages,
    tools: {
      filter_residences: tool({
        description:
          "Filter the residence collection by hard constraints: price range, minimum bedrooms, country, view type (Mountain/Lake/Ocean/City/Garden/Ski), or property type (Villa/Penthouse/Chalet/Estate/Apartment). Use this when the buyer states a budget or specific requirements.",
        inputSchema: z.object({
          minPrice: z.number().optional().describe("Minimum price in USD"),
          maxPrice: z.number().optional().describe("Maximum price in USD"),
          minBeds: z.number().optional().describe("Minimum number of bedrooms"),
          country: z.string().optional(),
          view: z.string().optional(),
          type: z.string().optional(),
        }),
        execute: async (args) =>
          filterResidences(args).map((r) => ({
            name: r.name,
            city: r.city,
            country: r.country,
            price: r.price,
            beds: r.beds,
            type: r.type,
            view: r.view,
            features: r.features,
          })),
      }),
    },
    stopWhen: stepCountIs(4),
  });

  return result.toTextStreamResponse({
    headers: {
      // Matched listings for the client to render as cards (URI-encoded for header safety).
      "x-listings": encodeURIComponent(
        JSON.stringify(matches.map(liteResidence))
      ),
    },
  });
}
