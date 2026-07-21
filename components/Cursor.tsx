"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only take over the cursor on fine (mouse) pointers.
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || !ring.current || !dot.current) return;
    document.documentElement.classList.add("has-cursor");

    const xTo = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    const dxTo = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dyTo = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });

    let revealed = false;
    const move = (e: PointerEvent) => {
      if (!revealed) {
        revealed = true;
        gsap.to([ring.current, dot.current], { opacity: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
      dxTo(e.clientX);
      dyTo(e.clientY);
    };

    const over = (e: Event) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]"))
        gsap.to(ring.current, { scale: 1.9, opacity: 0.6, duration: 0.3 });
    };
    const out = (e: Event) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]"))
        gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.3 });
    };

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cur cur__ring" />
      <div ref={dot} className="cur cur__dot" />
      <style jsx global>{`
        .has-cursor,
        .has-cursor a,
        .has-cursor button {
          cursor: none;
        }
        .cur {
          position: fixed;
          top: 0;
          left: 0;
          /* Above the intro overlay (1000) and boot cover (1500) so the cursor
             stays visible on the black intro screen. */
          z-index: 2000;
          pointer-events: none;
          border-radius: 50%;
          opacity: 0;
          will-change: transform;
        }
        .cur__ring {
          width: 32px;
          height: 32px;
          margin: -16px 0 0 -16px;
          border: 1.5px solid #fff;
          mix-blend-mode: difference;
        }
        .cur__dot {
          width: 7px;
          height: 7px;
          margin: -3.5px 0 0 -3.5px;
          background: var(--accent);
          box-shadow: 0 0 10px rgba(229, 86, 58, 0.65);
        }
      `}</style>
    </>
  );
}
