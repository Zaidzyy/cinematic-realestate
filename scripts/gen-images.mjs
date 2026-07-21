// Generates self-contained SVG placeholder artwork into /public/img.
// Interior panels use a vanishing-point perspective so the fly-through reads as
// a camera dollying forward through distinct rooms. Swap for real photos later.
import { mkdirSync, writeFileSync } from "fs";

const OUT = new URL("../public/img/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const W = 1600;
const H = 1200;

function grain(id) {
  return `
    <filter id="grain-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer>
      <feComposite operator="over" in2="SourceGraphic"/>
    </filter>`;
}

// Interior room, warm light, doorway at vanishing point.
function room({ id, wallTop, wallBot, floor, glow, light, vpx = 0.5, furniture = true }) {
  const vx = W * vpx;
  const vy = H * 0.46;
  const inL = W * (0.5 - 0.11);
  const inR = W * (0.5 + 0.11);
  const dY = H * 0.5;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="wall-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${wallTop}"/><stop offset="1" stop-color="${wallBot}"/>
    </linearGradient>
    <linearGradient id="floor-${id}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="${floor}"/><stop offset="1" stop-color="${wallBot}"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="${(vx / W) * 100}%" cy="46%" r="60%">
      <stop offset="0" stop-color="${light}" stop-opacity="0.9"/>
      <stop offset="0.5" stop-color="${glow}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig-${id}" cx="50%" cy="44%" r="75%">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </radialGradient>
    ${grain(id)}
  </defs>
  <g filter="url(#grain-${id})">
    <rect width="${W}" height="${H}" fill="url(#wall-${id})"/>
    <!-- ceiling -->
    <polygon points="0,0 ${W},0 ${inR},${vy} ${inL},${vy}" fill="${wallTop}" opacity="0.55"/>
    <!-- floor -->
    <polygon points="0,${H} ${W},${H} ${inR},${vy + dY} ${inL},${vy + dY}" fill="url(#floor-${id})"/>
    <!-- left wall -->
    <polygon points="0,0 ${inL},${vy} ${inL},${vy + dY} 0,${H}" fill="${wallBot}" opacity="0.7"/>
    <!-- right wall -->
    <polygon points="${W},0 ${inR},${vy} ${inR},${vy + dY} ${W},${H}" fill="${wallBot}" opacity="0.85"/>
    <!-- back wall / doorway -->
    <rect x="${inL}" y="${vy}" width="${inR - inL}" height="${dY}" fill="url(#glow-${id})"/>
    <rect x="${inL}" y="${vy}" width="${inR - inL}" height="${dY}" fill="${light}" opacity="0.14"/>
    <!-- pilasters -->
    <line x1="${inL}" y1="${vy}" x2="${inL}" y2="${vy + dY}" stroke="#000" stroke-opacity="0.25" stroke-width="2"/>
    <line x1="${inR}" y1="${vy}" x2="${inR}" y2="${vy + dY}" stroke="#000" stroke-opacity="0.25" stroke-width="2"/>
    ${
      furniture
        ? `<rect x="${W * 0.34}" y="${H * 0.68}" width="${W * 0.16}" height="${H * 0.14}" rx="14" fill="#000" opacity="0.28"/>
           <ellipse cx="${W * 0.63}" cy="${H * 0.82}" rx="70" ry="18" fill="#000" opacity="0.22"/>`
        : ""
    }
    <rect width="${W}" height="${H}" fill="url(#vig-${id})"/>
    <rect width="${W}" height="${H}" fill="url(#glow-${id})" opacity="0.5"/>
  </g>
</svg>`;
}

// Exterior / landscape panel with mountains + structure.
function exterior({ id, sky1, sky2, ridge, mid, fg, warm }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky1}"/><stop offset="0.6" stop-color="${sky2}"/><stop offset="1" stop-color="${mid}"/>
    </linearGradient>
    <radialGradient id="sun-${id}" cx="62%" cy="34%" r="40%">
      <stop offset="0" stop-color="${warm}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${warm}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig2-${id}" cx="50%" cy="46%" r="80%">
      <stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/>
    </radialGradient>
    ${grain(id)}
  </defs>
  <g filter="url(#grain-${id})">
    <rect width="${W}" height="${H}" fill="url(#sky-${id})"/>
    <rect width="${W}" height="${H}" fill="url(#sun-${id})"/>
    <polygon points="0,${H * 0.5} ${W * 0.3},${H * 0.24} ${W * 0.52},${H * 0.46} ${W * 0.72},${H * 0.2} ${W},${H * 0.5} ${W},${H} 0,${H}" fill="${ridge}" opacity="0.9"/>
    <polygon points="0,${H * 0.64} ${W * 0.42},${H * 0.44} ${W * 0.68},${H * 0.6} ${W},${H * 0.5} ${W},${H} 0,${H}" fill="${mid}"/>
    <polygon points="0,${H * 0.78} ${W},${H * 0.72} ${W},${H} 0,${H}" fill="${fg}"/>
    <rect x="${W * 0.4}" y="${H * 0.66}" width="${W * 0.2}" height="${H * 0.2}" fill="#000" opacity="0.35"/>
    <rect x="${W * 0.43}" y="${H * 0.7}" width="${W * 0.05}" height="${H * 0.08}" fill="${warm}" opacity="0.55"/>
    <rect width="${W}" height="${H}" fill="url(#vig2-${id})"/>
  </g>
</svg>`;
}

const interiors = [
  { id: "f1", wallTop: "#3a2c23", wallBot: "#241a14", floor: "#4a3628", glow: "#0b0b0c", light: "#e9c79a", vpx: 0.52 },
  { id: "f2", wallTop: "#4a3b30", wallBot: "#2c221b", floor: "#5a4436", glow: "#0b0b0c", light: "#f0d3a6", vpx: 0.44 },
  { id: "f3", wallTop: "#5b4638", wallBot: "#31251d", floor: "#6b5140", glow: "#0b0b0c", light: "#f4dcb0", vpx: 0.57 },
  { id: "f4", wallTop: "#453931", wallBot: "#282019", floor: "#574438", glow: "#0b0b0c", light: "#eccf9f", vpx: 0.48 },
  { id: "f5", wallTop: "#6a5647", wallBot: "#3a2d24", floor: "#7c6250", glow: "#0b0b0c", light: "#f6e2bd", vpx: 0.5 },
  { id: "f6", wallTop: "#3f322a", wallBot: "#241b16", floor: "#503d31", glow: "#0b0b0c", light: "#eccf9c", vpx: 0.55 },
];

const galleries = [
  { fn: "g1", type: "room", p: { id: "g1", wallTop: "#4a3b30", wallBot: "#241a14", floor: "#5a4436", glow: "#0b0b0c", light: "#f0d3a6", vpx: 0.5 } },
  { fn: "g2", type: "ext", p: { id: "g2", sky1: "#20303a", sky2: "#3f4b4a", ridge: "#2b3a3c", mid: "#26312f", fg: "#161d1b", warm: "#e6b784" } },
  { fn: "g3", type: "room", p: { id: "g3", wallTop: "#5b4638", wallBot: "#2c221b", floor: "#6b5140", glow: "#0b0b0c", light: "#f4dcb0", vpx: 0.45 } },
  { fn: "g4", type: "ext", p: { id: "g4", sky1: "#2a3830", sky2: "#4d5b46", ridge: "#33402f", mid: "#2b3626", fg: "#171d15", warm: "#dfcf8f" } },
  { fn: "g5", type: "room", p: { id: "g5", wallTop: "#463a32", wallBot: "#282019", floor: "#5a473a", glow: "#0b0b0c", light: "#eccf9f", vpx: 0.56 } },
  { fn: "g6", type: "ext", p: { id: "g6", sky1: "#2d2622", sky2: "#5a4a3c", ridge: "#3a2f27", mid: "#2c231d", fg: "#181310", warm: "#f0c489" } },
];

const heroP = { id: "hero", sky1: "#243027", sky2: "#5c6b4a", ridge: "#3a4a34", mid: "#2c3826", fg: "#141a12", warm: "#f2d79a" };
const gardenP = { id: "garden", sky1: "#2a2620", sky2: "#5b4d3a", ridge: "#3b3025", mid: "#2b241c", fg: "#15110d", warm: "#f0c489" };

writeFileSync(new URL("hero.svg", OUT), exterior(heroP));
writeFileSync(new URL("garden.svg", OUT), exterior(gardenP));
interiors.forEach((p) => writeFileSync(new URL(`${p.id}.svg`, OUT), room(p)));
galleries.forEach((g) =>
  writeFileSync(new URL(`${g.fn}.svg`, OUT), g.type === "room" ? room(g.p) : exterior(g.p))
);

console.log("Generated:", ["hero", "garden", ...interiors.map((i) => i.id), ...galleries.map((g) => g.fn)].join(", "));
