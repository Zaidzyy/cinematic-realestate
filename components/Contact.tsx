"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmartImage from "./SmartImage";
import { gardenImage } from "@/lib/images";
import Logo from "./Logo";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta__bg",
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.from(".cta__title span", {
        yPercent: 120,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".cta__title", start: "top 82%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={root} className="cta">
      <div className="cta__bg">
        <SmartImage
          src={gardenImage.src}
          fallback={gardenImage.fallback}
          alt="A warm luxury interior at dusk"
        />
      </div>
      <div className="cta__scrim" />

      <div className="container cta__inner">
        <span className="eyebrow">Book a Viewing</span>
        <h2 className="display cta__title">
          <span>Let&apos;s find</span>
          <span>your address</span>
        </h2>
        <p className="cta__sub">
          Tell us how you want to live. We&apos;ll bring the residences —
          privately, and on your schedule.
        </p>
        <div className="cta__actions">
          <a href="mailto:hello@kavyaestates.com" className="pill pill--solid">
            Enquire ↗
          </a>
          <a href="mailto:hello@kavyaestates.com" className="pill">
            hello@kavyaestates.com
          </a>
        </div>
      </div>

      <footer className="foot container">
        <div className="foot__brand">
          <Logo size={24} />
        </div>
        <div className="foot__cols">
          <a href="#about">About</a>
          <a href="#method">Process</a>
          <a href="#clients">Residences</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="foot__fine">
          © {new Date().getFullYear()} Kavya Estates — Curated residences.
        </div>
      </footer>

      <style jsx>{`
        .cta {
          position: relative;
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          padding: 120px 0 0;
        }
        .cta__bg {
          position: absolute;
          inset: -12% 0;
          z-index: 0;
        }
        .cta__bg :global(img) {
          filter: brightness(0.6);
        }
        .cta__scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(11, 11, 12, 0.75),
            rgba(11, 11, 12, 0.45) 40%,
            rgba(11, 11, 12, 0.9)
          );
        }
        .cta__inner {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .cta__title {
          font-size: clamp(44px, 9vw, 150px);
          margin: 16px 0 22px;
          display: flex;
          flex-direction: column;
        }
        .cta__title span {
          display: inline-block;
          overflow: hidden;
        }
        .cta__sub {
          max-width: 440px;
          color: var(--fg-dim);
          font-size: 17px;
          line-height: 1.5;
        }
        .cta__actions {
          margin-top: 34px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .foot {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          padding-top: 40px;
          padding-bottom: 40px;
          margin-top: 60px;
          border-top: 1px solid var(--line);
        }
        .foot__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
        }
        .foot__mark {
          display: grid;
          place-items: center;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: var(--accent);
          color: #fff;
          font-weight: 800;
        }
        .foot__cols {
          display: flex;
          gap: 22px;
          color: var(--fg-dim);
          font-size: 14px;
        }
        .foot__cols a:hover {
          color: var(--fg);
        }
        .foot__fine {
          color: var(--fg-dim);
          font-size: 13px;
        }
      `}</style>
    </section>
  );
}
