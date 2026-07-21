// Real photoreal imagery generated for Kavya Estates (Higgsfield / nano-banana),
// hosted on the generation CDN. Each asset carries a local SVG `fallback` so the
// site never renders a broken image if a URL is unreachable.
//
// To use your OWN photos: drop files in /public/images and replace `src` with
// the local path (e.g. "/images/hero.jpg"). Fallbacks can then be removed.

const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3F598jaVxX94WUBjX4VOUevCJNC";

export type Img = { src: string; fallback: string; label?: string };

const gen = {
  exterior: `${CDN}/hf_20260720_214217_080335bf-4d48-4898-a5e3-517137a32c37.png`,
  entrance: `${CDN}/hf_20260720_214245_8e4c6560-e372-4b62-a43d-b8146976a6d0.png`,
  living: `${CDN}/hf_20260720_214245_877ea4a9-6195-47b7-8c7b-c9b8485999c2.png`,
  kitchen: `${CDN}/hf_20260720_214247_085c873a-3fbc-4c70-888a-24ffab366f24.png`,
  bedroom: `${CDN}/hf_20260720_214248_811ab9bd-610f-402e-a75a-ccadd88d3cce.png`,
};

export const heroImage: Img = { src: gen.exterior, fallback: "/img/hero.svg" };

// Walkthrough sequence — an arrival that moves INTO and THROUGH the home.
export const flythroughImages: Img[] = [
  { src: gen.exterior, fallback: "/img/hero.svg", label: "The Approach" },
  { src: gen.entrance, fallback: "/img/f1.svg", label: "Entrance Hall" },
  { src: gen.living, fallback: "/img/f2.svg", label: "The Living Volume" },
  { src: gen.kitchen, fallback: "/img/f3.svg", label: "Kitchen & Dining" },
  { src: gen.bedroom, fallback: "/img/f4.svg", label: "Principal Suite" },
];

export const galleryImages: Img[] = [
  { src: gen.exterior, fallback: "/img/g2.svg", label: "Ridgeline Villa — Gstaad" },
  { src: gen.living, fallback: "/img/g1.svg", label: "The Living Volume — Como" },
  { src: gen.entrance, fallback: "/img/g3.svg", label: "Marble Hall — Aspen" },
  { src: gen.bedroom, fallback: "/img/g5.svg", label: "Principal Suite — Provence" },
  { src: gen.kitchen, fallback: "/img/g4.svg", label: "Stone Kitchen — Kyoto" },
  { src: gen.exterior, fallback: "/img/g6.svg", label: "Dusk Facade — Amalfi" },
];

export const gardenImage: Img = { src: gen.living, fallback: "/img/garden.svg" };
