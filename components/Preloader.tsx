"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Stop the browser restoring an old scroll position (the pre-loader flash).
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    // Lift the plain-CSS boot cover now that this styled overlay is mounted.
    document.documentElement.classList.remove("booting");

    const start = performance.now();
    const DUR = 1900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setReady(true);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  // Focus the Enter button when it appears (so keyboard/Enter works).
  useEffect(() => {
    if (ready) btn.current?.focus();
  }, [ready]);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => {
      setGone(true);
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
    }, 1050);
  };

  if (gone) return null;

  return (
    <div className={`pre ${leaving ? "pre--leave" : ""} ${ready ? "pre--ready" : ""}`}>
      <div className="pre__panel pre__panel--a" />
      <div className="pre__panel pre__panel--b" />

      <div className="pre__inner">
        <div className="pre__brand">
          <div className="pre__logo">
            <Logo size={64} animate wordmark={false} />
          </div>
          <div className="pre__word">
            <span>Kavya</span>
            <span className="pre__est">Estates</span>
          </div>
        </div>

        <div className="pre__enterSlot">
          {ready && (
            <button ref={btn} className="pre__enter" onClick={enter} type="button">
              <span>Enter</span>
              <span aria-hidden>↗</span>
            </button>
          )}
        </div>
      </div>

      <div className="pre__count">
        <span>{String(count).padStart(3, "0")}</span>
        <span className="pre__tag">
          {ready ? "Experience ready" : "Composing the experience"}
        </span>
      </div>

      <style jsx>{`
        .pre {
          position: fixed;
          inset: 0;
          z-index: 1000;
          /* No background here: the two panels do the covering, so when they
             split apart on Enter the site is revealed behind them. */
          pointer-events: none;
        }
        .pre__panel {
          position: absolute;
          left: 0;
          right: 0;
          height: 50%;
          background: var(--bg);
          transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1);
          z-index: 1;
        }
        .pre__panel--a {
          top: 0;
        }
        .pre__panel--b {
          bottom: 0;
        }
        .pre--leave .pre__panel--a {
          transform: translateY(-100%);
        }
        .pre--leave .pre__panel--b {
          transform: translateY(100%);
        }
        .pre__inner {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 30px;
          transition: opacity 0.5s ease, transform 0.7s ease;
        }
        .pre--leave .pre__inner {
          opacity: 0;
          transform: scale(1.04);
        }
        .pre__brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
          /* Gentle eased rise when the Enter button becomes available. */
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pre--ready .pre__brand {
          transform: translateY(-12px);
        }
        /* Reserve the Enter button's space up front so it never reflows/jumps. */
        .pre__enterSlot {
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pre__word {
          display: flex;
          align-items: baseline;
          gap: 12px;
          font-family: var(--font-archivo), sans-serif;
          text-transform: uppercase;
          overflow: hidden;
        }
        .pre__word span {
          font-weight: 900;
          font-size: clamp(28px, 5vw, 52px);
          letter-spacing: 0.02em;
          animation: up 0.8s 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .pre__est {
          font-weight: 500 !important;
          letter-spacing: 0.22em !important;
          color: var(--fg-dim);
          font-size: clamp(20px, 3.4vw, 34px) !important;
          animation-delay: 1s !important;
        }
        @keyframes up {
          from {
            transform: translateY(120%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .pre__enter {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 30px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.02);
          color: var(--fg);
          font-family: var(--font-inter), sans-serif;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          pointer-events: auto;
          opacity: 0;
          animation: enterIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transition: background 0.35s ease, color 0.35s ease,
            border-color 0.35s ease;
        }
        @keyframes enterIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .pre__enter:hover {
          background: var(--fg);
          color: var(--bg);
          border-color: var(--fg);
        }
        .pre__count {
          position: absolute;
          z-index: 2;
          right: clamp(20px, 5vw, 64px);
          bottom: clamp(24px, 6vh, 60px);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          transition: opacity 0.4s ease;
        }
        .pre--leave .pre__count {
          opacity: 0;
        }
        .pre__count span:first-child {
          font-family: var(--font-archivo), sans-serif;
          font-weight: 900;
          font-size: clamp(40px, 8vw, 92px);
          line-height: 0.9;
          font-variant-numeric: tabular-nums;
        }
        .pre__tag {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--fg-dim);
        }
      `}</style>
    </div>
  );
}
