"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmartImage from "./SmartImage";
import { galleryImages } from "@/lib/images";

export default function Gallery() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gal__card").forEach((card) => {
        const img = card.querySelector("img");
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="clients" ref={root} className="gal">
      <div className="container">
        <div className="gal__head">
          <span className="eyebrow">The Portfolio</span>
          <h2 className="display gal__title">Residences, one address at a time</h2>
        </div>
        <div className="gal__grid">
          {galleryImages.map((g, i) => (
            <a
              className={`gal__card ${i % 3 === 1 ? "gal__card--tall" : ""}`}
              key={g.label}
              href="#contact"
            >
              <div className="gal__media">
                <SmartImage src={g.src} fallback={g.fallback} alt={g.label ?? ""} />
              </div>
              <div className="gal__meta">
                <span>{g.label}</span>
                <span aria-hidden>↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .gal {
          padding: clamp(90px, 14vh, 180px) 0;
          background: var(--bg);
        }
        .gal__title {
          font-size: clamp(36px, 5.5vw, 84px);
          margin-top: 14px;
        }
        .gal__grid {
          margin-top: clamp(40px, 7vh, 80px);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .gal__card {
          display: block;
        }
        .gal__media {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: 4px;
          background: var(--bg-soft);
        }
        .gal__card--tall .gal__media {
          aspect-ratio: 4 / 6.4;
        }
        .gal__media :global(img) {
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
          transform: scale(1.06);
        }
        .gal__card:hover .gal__media :global(img) {
          transform: scale(1.12);
        }
        .gal__meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 2px 0;
          font-size: 14px;
          color: var(--fg-dim);
          transition: color 0.3s ease;
        }
        .gal__card:hover .gal__meta {
          color: var(--fg);
        }
        @media (max-width: 800px) {
          .gal__grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 520px) {
          .gal__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
