"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    n: "01",
    title: "The Brief",
    body: "We map how you want to live — light, rhythm, address — before a single door is opened.",
  },
  {
    n: "02",
    title: "Curation",
    body: "On- and off-market residences are shortlisted against your brief, not against a portal.",
  },
  {
    n: "03",
    title: "The Viewing",
    body: "Private, unhurried tours — often rendered in 3D first, so you arrive already knowing the home.",
  },
  {
    n: "04",
    title: "Acquisition",
    body: "Negotiation, diligence and handover, styled and documented — keys, and the story you'll write in it.",
  },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".proc__row", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".proc__list", start: "top 75%" },
      });
      gsap.from(".proc__line", {
        scaleX: 0,
        duration: 1.1,
        ease: "power2.out",
        stagger: 0.12,
        transformOrigin: "left",
        scrollTrigger: { trigger: ".proc__list", start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="method" ref={root} className="proc">
      <div className="proc__grid" aria-hidden />
      <div className="container">
        <div className="proc__head">
          <span className="eyebrow">The Method</span>
          <h2 className="display proc__title">Process, drawn to scale</h2>
          <p className="proc__intro">
            Four movements from first brief to keys in hand. Every acquisition
            runs the same disciplined arc.
          </p>
        </div>

        <div className="proc__list">
          {steps.map((s) => (
            <div className="proc__row" key={s.n}>
              <span className="proc__n">{s.n}</span>
              <h3 className="proc__rowTitle">{s.title}</h3>
              <p className="proc__body">{s.body}</p>
              <span className="proc__line" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .proc {
          background: var(--bg-soft);
          padding: clamp(90px, 14vh, 180px) 0;
          overflow: hidden;
        }
        .proc__grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(
            120% 90% at 80% 0%,
            #000 0%,
            transparent 65%
          );
          opacity: 0.5;
        }
        .proc__head {
          max-width: 620px;
          position: relative;
          z-index: 2;
        }
        .proc__title {
          font-size: clamp(40px, 6vw, 92px);
          margin: 16px 0 20px;
        }
        .proc__intro {
          color: var(--fg-dim);
          font-size: 17px;
          line-height: 1.55;
        }
        .proc__list {
          margin-top: clamp(48px, 8vh, 96px);
          position: relative;
          z-index: 2;
        }
        .proc__row {
          position: relative;
          display: grid;
          grid-template-columns: 90px 1fr 1.4fr;
          gap: 28px;
          align-items: baseline;
          padding: 34px 0;
        }
        .proc__n {
          font-family: var(--font-archivo), sans-serif;
          font-weight: 800;
          font-size: 20px;
          color: var(--accent);
        }
        .proc__rowTitle {
          font-family: var(--font-archivo), sans-serif;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          font-size: clamp(24px, 3vw, 40px);
        }
        .proc__body {
          color: var(--fg-dim);
          font-size: 16px;
          line-height: 1.55;
          max-width: 46ch;
        }
        .proc__line {
          position: absolute;
          left: 0;
          bottom: 0;
          height: 1px;
          width: 100%;
          background: var(--line);
        }
        @media (max-width: 820px) {
          .proc__row {
            grid-template-columns: 60px 1fr;
          }
          .proc__body {
            grid-column: 2;
          }
        }
      `}</style>
    </section>
  );
}
