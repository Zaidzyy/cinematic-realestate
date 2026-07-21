# Kavya Estates — Cinematic Real-Estate Experience

An immersive, scroll-driven landing experience for a fictional luxury property house. Built to explore **motion engineering on the web** and an **AI-native asset pipeline** — every image and video was generated and composited, and the front end is a hand-tuned GSAP + Lenis system.

**Live demo:** _add your Vercel URL_ · **Walkthrough video:** _add `docs/demo.mp4`_

<!-- Replace the screenshots below with captures from a real browser (the CI/headless
     renderer can't load web fonts, the image CDN, or decode the hero/walkthrough video). -->

![Hero](docs/screenshots/02-hero.png)

---

## Overview

Kavya Estates is an original concept — a design-led property brand whose website is the product. The goal wasn't a template; it was to see how close the browser can get to a film-grade, scroll-controlled experience while staying fast and accessible.

Two ideas drive it:

- **Scroll is the camera.** The hero tilts in 3D and the "walkthrough" section is a real video whose playhead is driven by scroll position — you move *through* the home as you scroll.
- **AI-native production.** The photography, the interior stills, and the cinematic fly-through were all generated (see [Asset pipeline](#asset-pipeline)). The site is a front end wrapped around a fully synthetic media set.

## Highlights

- **Intro sequence** — an animated monogram that draws on, a load counter, and a click-to-enter gate that splits open into the site. No flash of unstyled/mid-scroll content (a plain-CSS boot cover paints on the first frame, before JS).
- **3D tilt hero** — a looping generated video plane that rotates in perspective and parallaxes to the cursor as you scroll.
- **Scroll-scrubbed walkthrough** — a stitched, all-intra-encoded video seeked frame-accurately from scroll progress, with a poster that is the video's own first frame (zero pop-in) and a touch-device loop fallback.
- **Interactive services** — a hover-driven list where a live description panel and stats track the active item.
- **Editorial motion throughout** — word-by-word reveals, parallax gallery, masked headline reveals, all on GSAP ScrollTrigger over Lenis smooth scroll.
- **Custom cursor**, reduced-motion aware, layered above the intro.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router), TypeScript |
| Animation | GSAP + ScrollTrigger |
| Smooth scroll | Lenis (wired into the GSAP ticker) |
| Styling | styled-jsx + CSS custom properties (no UI kit) |
| Media | Local `mp4` (H.264) + generated stills |
| Deploy | Vercel |

## Architecture notes (the interesting bits)

A few problems worth calling out, because the fixes are the engineering:

- **Scroll-driving a video.** The walkthrough re-encodes the clip **all-intra (`-g 1`)** so `currentTime` seeks are smooth, then eases the playhead toward a scroll-derived target in a `requestAnimationFrame` loop rather than seeking on every scroll tick.
- **`position: sticky` + `overflow`.** The pinned walkthrough silently broke until horizontal-overflow control was switched from `overflow-x: hidden` to `overflow-x: clip` — `hidden` creates a scroll container that disables sticky.
- **First-paint correctness.** Scroll restoration is disabled before paint and a plain-CSS boot cover guarantees the intro is opaque from frame one, independent of when styled-jsx injects its styles.
- **No poster pop.** Video posters are extracted from each clip's own first frame, so the still→video handoff is invisible.
- **Accessibility.** Honors `prefers-reduced-motion`, keyboard-focusable intro, semantic landmarks.

## AI Concierge (RAG)

A retrieval-augmented concierge is built into the site (floating "Ask the concierge" widget). Ask it in natural language — _"a quiet place with mountain views under $5M"_ — and it recommends from a real residences dataset.

How it works:

- **Embeddings + semantic search** — the residence corpus (`lib/residences.ts`) is embedded with Gemini (`gemini-embedding-001`) and cached in memory; each query is embedded and ranked by cosine similarity (`lib/concierge.ts`).
- **Grounded streaming generation** — the top matches are injected as context and the answer is streamed token-by-token from `gemini-2.5-flash` via the Vercel AI SDK (`app/api/concierge/route.ts`).
- **Tool-calling** — a `filter_residences` tool lets the model apply hard constraints (budget, bedrooms, country, view) instead of guessing.
- Matched residences render as cards in the chat.

Stack: **Vercel AI SDK (v7) + `@ai-sdk/google` (Gemini)**, in-memory cosine similarity (no external vector DB).

## Running locally

```bash
npm install
cp .env.local.example .env.local   # then add your Google AI Studio key
npm run dev      # http://localhost:3000
npm run build    # production build
```

Node 18+. The concierge needs `GOOGLE_GENERATIVE_AI_API_KEY` (from [Google AI Studio](https://aistudio.google.com/apikey)) in `.env.local` locally and in your Vercel project's Environment Variables in production. The rest of the site runs without it.

## Asset pipeline

This project is also an experiment in AI-native production. The full media set is synthetic:

- **Interior & exterior stills** — generated with an image model (Higgsfield / nano-banana), used for the hero poster, statement, and gallery.
- **Cinematic fly-through & hero clips** — generated with Kling (text-to-video), then cropped, colour-matched, and crossfade-stitched with `ffmpeg`.
- **Front-end** — built in an AI-assisted workflow, with the motion system and encoding decisions hand-verified.

Swap in your own media by dropping files into `/public` and updating `lib/images.ts`.

## Roadmap

- **Dynamic residence routes** (`/residences/[slug]`) driven by the data model.
- Persisted inquiry flow (server action → email/DB).

## License

MIT — see [LICENSE](LICENSE).
