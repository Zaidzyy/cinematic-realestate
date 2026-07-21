// The residences corpus — the concierge retrieves and reasons over this.
// Rich descriptions matter: they are what gets embedded for semantic search.

export type Residence = {
  id: string;
  name: string;
  city: string;
  country: string;
  price: number; // USD
  beds: number;
  baths: number;
  sqft: number;
  type: "Villa" | "Penthouse" | "Chalet" | "Estate" | "Apartment";
  view: ("Mountain" | "Lake" | "Ocean" | "City" | "Garden" | "Ski")[];
  features: string[];
  image: string;
  description: string;
};

export const residences: Residence[] = [
  {
    id: "ridgeline-gstaad",
    name: "Ridgeline House",
    city: "Gstaad",
    country: "Switzerland",
    price: 24500000,
    beds: 6,
    baths: 7,
    sqft: 9800,
    type: "Chalet",
    view: ["Mountain", "Ski"],
    features: ["Ski-in / ski-out", "Indoor pool", "Spa", "Wine cellar", "Staff quarters", "Cinema"],
    image: "/images/statement.jpg",
    description:
      "A cantilevered concrete-and-timber chalet above Gstaad with uninterrupted alpine views. Ski-in/ski-out access, a 20-metre indoor pool, spa, and a glass-walled living volume that opens to the ridgeline. Quiet, private, and built for winters with a full staff wing.",
  },
  {
    id: "atrium-como",
    name: "The Atrium",
    city: "Lake Como",
    country: "Italy",
    price: 18900000,
    beds: 5,
    baths: 6,
    sqft: 8200,
    type: "Villa",
    view: ["Lake", "Garden"],
    features: ["Private dock", "Boathouse", "Terraced gardens", "Pool", "Wine cellar"],
    image: "/img/g2.svg",
    description:
      "A restored lakeside villa on Como's quiet western shore with a private dock and boathouse. Terraced gardens step down to the water, and a double-height atrium frames the lake. Calm, classical, and made for slow summers on the water.",
  },
  {
    id: "stonewater-aspen",
    name: "Stonewater",
    city: "Aspen",
    country: "United States",
    price: 32000000,
    beds: 7,
    baths: 9,
    sqft: 12400,
    type: "Estate",
    view: ["Mountain", "Ski"],
    features: ["Ski access", "Heated driveway", "Cinema", "Gym", "Wine room", "Guest house"],
    image: "/img/g3.svg",
    description:
      "A stone-and-glass mountain estate minutes from Aspen's slopes. Raked light across travertine walls, a private cinema, gym, and a separate guest house. Big, warm, and engineered for altitude and entertaining at scale.",
  },
  {
    id: "garden-wing-provence",
    name: "Garden Wing",
    city: "Provence",
    country: "France",
    price: 6400000,
    beds: 4,
    baths: 4,
    sqft: 5200,
    type: "Estate",
    view: ["Garden", "Mountain"],
    features: ["Olive grove", "Pool", "Guest cottage", "Outdoor kitchen"],
    image: "/img/g4.svg",
    description:
      "A honey-stone farmhouse set in an olive grove with a walled garden and a long lavender-lined approach. Relaxed, sun-worn, and unpretentious — a pool, a guest cottage, and an outdoor kitchen for long lunches. The quiet-luxury option under ten million.",
  },
  {
    id: "reading-house-kyoto",
    name: "The Reading House",
    city: "Kyoto",
    country: "Japan",
    price: 4900000,
    beds: 3,
    baths: 3,
    sqft: 3600,
    type: "Villa",
    view: ["Garden"],
    features: ["Zen garden", "Tea house", "Cedar bath", "Courtyard"],
    image: "/img/g5.svg",
    description:
      "A contemporary machiya reworked around a moss courtyard and a private tea house. Cedar, paper, and stone; a deep soaking bath and a reading room that opens to a zen garden. Small, serene, and deeply private in the eastern hills.",
  },
  {
    id: "cliff-residence-amalfi",
    name: "Cliff Residence",
    city: "Amalfi",
    country: "Italy",
    price: 11800000,
    beds: 5,
    baths: 5,
    sqft: 6100,
    type: "Villa",
    view: ["Ocean", "Garden"],
    features: ["Infinity pool", "Cliff elevator", "Terraces", "Sea access"],
    image: "/img/g6.svg",
    description:
      "Carved into the Amalfi cliffs with an infinity pool that reads straight into the Tyrrhenian. A private elevator drops to sea access; stacked terraces catch the afternoon light. Dramatic, coastal, and unmistakably Mediterranean.",
  },
  {
    id: "skyline-penthouse-nyc",
    name: "Skyline Penthouse",
    city: "New York",
    country: "United States",
    price: 28500000,
    beds: 4,
    baths: 5,
    sqft: 5400,
    type: "Penthouse",
    view: ["City"],
    features: ["Private elevator", "Wraparound terrace", "Cellar", "Concierge", "Smart home"],
    image: "/img/f2.svg",
    description:
      "A full-floor penthouse above Central Park with a wraparound terrace and 360-degree city views. Private elevator, wine cellar, and full building concierge. Turn-key, urban, and about as high as Manhattan gets.",
  },
  {
    id: "dune-house-hamptons",
    name: "Dune House",
    city: "The Hamptons",
    country: "United States",
    price: 15200000,
    beds: 6,
    baths: 7,
    sqft: 8800,
    type: "Estate",
    view: ["Ocean", "Garden"],
    features: ["Oceanfront", "Pool", "Tennis court", "Pool house", "Beach access"],
    image: "/img/f4.svg",
    description:
      "An oceanfront shingle-style estate on the dunes with direct beach access, a tennis court, and a pool house. Bright, breezy, and built for summers by the Atlantic with room for a large family and guests.",
  },
  {
    id: "vineyard-estate-napa",
    name: "Vineyard Estate",
    city: "Napa Valley",
    country: "United States",
    price: 9700000,
    beds: 5,
    baths: 5,
    sqft: 6900,
    type: "Estate",
    view: ["Garden", "Mountain"],
    features: ["Working vineyard", "Wine cave", "Pool", "Olive trees"],
    image: "/img/g1.svg",
    description:
      "A working-vineyard estate on a Napa hillside with its own wine cave and tasting room. Rows of cabernet run to the tree line; the house is warm oak and board-formed concrete. For someone who wants the land to do something.",
  },
  {
    id: "harbour-loft-sydney",
    name: "Harbour Loft",
    city: "Sydney",
    country: "Australia",
    price: 7300000,
    beds: 3,
    baths: 3,
    sqft: 3100,
    type: "Apartment",
    view: ["Ocean", "City"],
    features: ["Harbour frontage", "Boat mooring", "Terrace", "Concierge"],
    image: "/img/f5.svg",
    description:
      "A harbourfront residence with a private mooring and a terrace over the water, walking distance to the city. Light, low, and open to the harbour — the easy-living option with a boat at the door.",
  },
  {
    id: "desert-court-marrakech",
    name: "Desert Court",
    city: "Marrakech",
    country: "Morocco",
    price: 3800000,
    beds: 5,
    baths: 5,
    sqft: 7200,
    type: "Villa",
    view: ["Garden", "Mountain"],
    features: ["Courtyard pool", "Hammam", "Palm grove", "Staff quarters"],
    image: "/img/f3.svg",
    description:
      "A modern riad in the Palmeraie built around a still courtyard pool, with a private hammam and views to the Atlas Mountains. Cool stone, deep shade, and total privacy behind high walls. Remarkable value for the scale.",
  },
  {
    id: "fjord-cabin-norway",
    name: "Fjord Cabin",
    city: "Bergen",
    country: "Norway",
    price: 2600000,
    beds: 3,
    baths: 2,
    sqft: 2400,
    type: "Chalet",
    view: ["Mountain", "Lake"],
    features: ["Fjord frontage", "Sauna", "Dock", "Floor-to-ceiling glass"],
    image: "/img/hero.svg",
    description:
      "A blackened-timber cabin on a Norwegian fjord with a wood sauna and a small dock. All glass toward the water and the mountains behind it. Minimal, remote, and the most affordable way into the collection — for someone who wants stillness over square footage.",
  },
];
