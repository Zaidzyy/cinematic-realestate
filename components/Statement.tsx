"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmartImage from "./SmartImage";

const services = [
  {
    name: "Private Sales",
    desc: "Discreet, off-market representation for buyers and sellers who value privacy above all.",
  },
  {
    name: "Off-Market Acquisitions",
    desc: "We source residences before they list — through relationships, not portals.",
  },
  {
    name: "Portfolio Advisory",
    desc: "Strategic guidance on building and holding a collection of exceptional homes.",
  },
  {
    name: "Architecture & Design",
    desc: "In-house direction on form, material and light — from first sketch to final finish.",
  },
  {
    name: "Styling & Handover",
    desc: "Every residence delivered styled, documented and ready to be lived in.",
  },
  {
    name: "Global Concierge",
    desc: "Ongoing care across borders — staff, maintenance and everything in between.",
  },
];

// Placeholder credibility stats — swap for real figures before production use.
const stats = [
  { k: "Est.", v: "2019" },
  { k: "Residences placed", v: "40+" },
  { k: "Countries", v: "9" },
];

export default function Statement() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".stmt__w");
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".stmt__lead",
            start: "top 82%",
            end: "bottom 62%",
            scrub: true,
          },
        }
      );
      // Parallax on the framed image.
      gsap.fromTo(
        ".stmt__imgInner",
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ".stmt__figure",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.from(".stmt__figure", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".stmt__figure", start: "top 85%" },
      });
      gsap.from(".stmt__svc li", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".stmt__svc", start: "top 82%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const lead =
    "We curate homes that feel inevitable — where light, material and address agree, and every residence earns its place in how you want to live.";

  return (
    <section id="about" ref={root} className="stmt">
      <div className="container">
        <span className="eyebrow">The House of Kavya</span>

        <div className="stmt__top">
          <div className="stmt__col-text">
            <p className="stmt__lead">
              {lead.split(" ").map((w, i) => (
                <span className="stmt__w" key={i}>
                  {w}{" "}
                </span>
              ))}
            </p>
            <div className="stmt__meta">
              <span className="stmt__metaNum">01 — Ethos</span>
              <p>
                A private house representing a handful of exceptional residences
                a year, so each one receives an obsessive amount of attention.
              </p>
            </div>
          </div>

          <figure className="stmt__figure">
            <div className="stmt__imgFrame">
              <div className="stmt__imgInner">
                <SmartImage
                  src="/images/statement.jpg"
                  fallback="/img/g1.svg"
                  alt="A sculptural lounge chair before a floor-to-ceiling window framing alpine mountains"
                />
              </div>
              <span className="stmt__imgLabel">
                Ridgeline House — the living volume
              </span>
            </div>
          </figure>
        </div>

        <div id="services" className="stmt__foot">
          <div className="stmt__col">
            <span className="eyebrow">What we do</span>
            <ul className="stmt__svc">
              {services.map((s, i) => (
                <li
                  key={s.name}
                  className={`stmt__svcRow ${i === active ? "is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={0}
                >
                  <span className="stmt__svcNum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="stmt__svcName">{s.name}</span>
                  <span className="stmt__svcArrow" aria-hidden>
                    →
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="stmt__col stmt__panel">
            <div className="stmt__panelTop">
              <span className="eyebrow">
                {String(active + 1).padStart(2, "0")} / 06
              </span>
              <p className="stmt__panelDesc" key={active}>
                {services[active].desc}
              </p>
            </div>
            <div className="stmt__panelBottom">
              <div className="stmt__stats">
                {stats.map((s) => (
                  <div className="stmt__stat" key={s.k}>
                    <span className="stmt__statV">{s.v}</span>
                    <span className="stmt__statK">{s.k}</span>
                  </div>
                ))}
              </div>
              <a href="#clients" className="pill">
                View residences ↓
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stmt {
          padding: clamp(90px, 16vh, 200px) 0;
          background: var(--bg);
        }
        .stmt__top {
          margin-top: 28px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: clamp(32px, 6vw, 88px);
          align-items: center;
        }
        .stmt__lead {
          font-family: var(--font-archivo), sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.12;
          font-size: clamp(24px, 3vw, 46px);
          max-width: 18ch;
        }
        .stmt__w {
          display: inline;
        }
        .stmt__meta {
          margin-top: 40px;
          display: grid;
          gap: 12px;
          max-width: 42ch;
        }
        .stmt__metaNum {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .stmt__meta p {
          color: var(--fg-dim);
          font-size: 16px;
          line-height: 1.55;
        }
        .stmt__figure {
          margin: 0;
        }
        .stmt__imgFrame {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: 5px;
          background: var(--bg-soft);
        }
        .stmt__imgInner {
          position: absolute;
          inset: -12% 0;
          will-change: transform;
        }
        .stmt__imgLabel {
          position: absolute;
          left: 18px;
          bottom: 16px;
          z-index: 2;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--fg);
          text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6);
        }
        .stmt__imgFrame::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 55%,
            rgba(11, 11, 12, 0.6) 100%
          );
          z-index: 1;
        }
        .stmt__foot {
          margin-top: clamp(56px, 9vh, 110px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 5vw, 72px);
          border-top: 1px solid var(--line);
          padding-top: 40px;
          align-items: stretch;
        }
        .stmt__svc {
          list-style: none;
          margin-top: 18px;
        }
        .stmt__svcRow {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 6px;
          border-bottom: 1px solid var(--line);
          cursor: pointer;
          color: var(--fg-dim);
          outline: none;
          transition: color 0.3s ease,
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stmt__svcRow.is-active,
        .stmt__svcRow:focus-visible {
          color: var(--fg);
          transform: translateX(10px);
        }
        .stmt__svcNum {
          font-family: var(--font-archivo), sans-serif;
          font-weight: 800;
          font-size: 12px;
          color: var(--accent);
          width: 22px;
          flex: none;
        }
        .stmt__svcName {
          font-size: clamp(18px, 2vw, 26px);
          font-weight: 500;
          flex: 1;
        }
        .stmt__svcArrow {
          color: var(--accent);
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .stmt__svcRow.is-active .stmt__svcArrow {
          opacity: 1;
          transform: translateX(0);
        }
        .stmt__panel {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 32px;
          margin-top: 18px;
        }
        .stmt__panelDesc {
          margin-top: 14px;
          font-family: var(--font-archivo), sans-serif;
          font-weight: 500;
          font-size: clamp(22px, 2.4vw, 34px);
          line-height: 1.25;
          letter-spacing: -0.01em;
          color: var(--fg);
          max-width: 22ch;
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .stmt__panelBottom {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: flex-start;
        }
        .stmt__stats {
          display: flex;
          gap: clamp(22px, 4vw, 52px);
        }
        .stmt__stat {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .stmt__statV {
          font-family: var(--font-archivo), sans-serif;
          font-weight: 800;
          font-size: clamp(24px, 3vw, 40px);
          line-height: 1;
        }
        .stmt__statK {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--fg-dim);
        }
        @media (max-width: 860px) {
          .stmt__top {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .stmt__figure {
            order: -1;
          }
        }
        @media (max-width: 760px) {
          .stmt__foot {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
