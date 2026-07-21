"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WORDS = ["Curated", "Signature", "Timeless"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [word, setWord] = useState(0);

  // Cycle the headline word.
  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // The signature move: the image plane tilts back in 3D + lifts away as you scroll.
      gsap.fromTo(
        plane.current,
        { rotateX: 0, scale: 1, y: 0 },
        {
          rotateX: 34,
          scale: 1.18,
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
      // Headline drifts up and fades slightly faster than the scroll.
      gsap.to(content.current, {
        y: -120,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);

    // Cursor parallax on the background image.
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      gsap.to(parallax.current, {
        x: nx * -40,
        y: ny * -28,
        duration: 0.8,
        ease: "power3.out",
      });
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section id="top" ref={root} className="hero">
      <div className="hero__perspective">
        <div ref={plane} className="hero__plane">
          <div ref={parallax} className="hero__parallax">
            <video
              className="hero__video"
              src="/video/hero.mp4"
              poster="/video/hero-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
          <div className="hero__scrim" />
        </div>
      </div>

      <div className="hero__content container" ref={content}>
        <p className="eyebrow">Kavya Estates — Curated Residences</p>
        <h1 className="display hero__title">
          <span className="hero__cycler" key={word}>
            {WORDS[word]}
          </span>
          <span className="hero__static">Estates</span>
        </h1>
        <p className="hero__sub">
          A private portfolio of design-led homes — architecture, atmosphere and
          address, held in perfect proportion.
        </p>
      </div>

      <div className="hero__cue">
        <span>Scroll</span>
        <span className="hero__cueLine" />
      </div>

      <style jsx>{`
        .hero {
          height: 100vh;
          min-height: 640px;
          position: relative;
          overflow: hidden;
        }
        .hero__perspective {
          position: absolute;
          inset: 0;
          perspective: 1400px;
          perspective-origin: 50% 30%;
        }
        .hero__plane {
          position: absolute;
          inset: -8% -4%;
          transform-style: preserve-3d;
          transform-origin: 50% 78%;
          will-change: transform;
        }
        .hero__parallax {
          position: absolute;
          inset: -6%;
        }
        .hero__parallax :global(video),
        .hero__parallax :global(img) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(1.03) contrast(1.02);
        }
        .hero__scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
              180deg,
              rgba(11, 11, 12, 0.55) 0%,
              rgba(11, 11, 12, 0.05) 30%,
              rgba(11, 11, 12, 0.15) 60%,
              rgba(11, 11, 12, 0.85) 100%
            ),
            radial-gradient(
              120% 80% at 20% 90%,
              rgba(11, 11, 12, 0.7),
              transparent 60%
            );
        }
        .hero__content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: clamp(48px, 9vh, 120px);
          z-index: 3;
          will-change: transform;
        }
        .hero__title {
          font-size: clamp(60px, 13vw, 220px);
          margin-top: 14px;
          display: flex;
          flex-direction: column;
        }
        .hero__cycler {
          display: inline-block;
          animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero__static {
          color: var(--fg);
        }
        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(0.28em);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        .hero__sub {
          margin-top: 22px;
          max-width: 460px;
          color: var(--fg-dim);
          font-size: clamp(15px, 1.4vw, 18px);
          line-height: 1.5;
        }
        .hero__cue {
          position: absolute;
          right: var(--pad);
          bottom: clamp(48px, 9vh, 120px);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--fg-dim);
        }
        .hero__cueLine {
          width: 1px;
          height: 56px;
          background: linear-gradient(var(--fg-dim), transparent);
          animation: cue 1.8s ease-in-out infinite;
          transform-origin: top;
        }
        @keyframes cue {
          0%,
          100% {
            transform: scaleY(0.4);
            opacity: 0.4;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        @media (max-width: 700px) {
          .hero__cue {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
