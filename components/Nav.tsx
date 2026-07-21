"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const links = [
  { label: "About", href: "#about" },
  { label: "Residences", href: "#clients" },
  { label: "Experience", href: "#approach" },
  { label: "Process", href: "#method" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner container">
        <a href="#top" className="nav__brand" aria-label="Kavya Estates home">
          <Logo size={28} />
        </a>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__cta">
          <a href="#contact" className="pill">
            Enquire <span aria-hidden>↗</span>
          </a>
          <a href="#contact" className="pill pill--solid">
            Book a Viewing <span aria-hidden>↗</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 18px 0;
          transition: padding 0.4s ease, background 0.4s ease,
            border-color 0.4s ease;
          border-bottom: 1px solid transparent;
        }
        .nav--scrolled {
          padding: 12px 0;
          background: rgba(11, 11, 12, 0.72);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--line);
        }
        .nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .nav__links {
          display: flex;
          gap: 26px;
          font-size: 14px;
          color: var(--fg-dim);
        }
        .nav__links a {
          transition: color 0.25s ease;
        }
        .nav__links a:hover {
          color: var(--fg);
        }
        .nav__cta {
          display: flex;
          gap: 10px;
        }
        @media (max-width: 900px) {
          .nav__links {
            display: none;
          }
          .nav__cta .pill:first-child {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
