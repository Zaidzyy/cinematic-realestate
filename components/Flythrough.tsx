"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Caption segments mapped to the stitched walkthrough video's progress (0–1).
const SEGMENTS = [
  { p: 0.0, label: "Entrance Hall" },
  { p: 0.3, label: "The Living Volume" },
  { p: 0.62, label: "Kitchen & Dining" },
  { p: 0.85, label: "Principal Suite" },
];

function labelFor(p: number) {
  let l = SEGMENTS[0].label;
  for (const s of SEGMENTS) if (p >= s.p) l = s.label;
  return l;
}

export default function Flythrough() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const barFill = useRef<HTMLDivElement>(null);
  const [caption, setCaption] = useState(SEGMENTS[0].label);
  const [scrubMode, setScrubMode] = useState(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const v = video.current!;

    // Touch devices can't reliably seek a <video> on scroll — loop-play instead.
    const canScrub = window.matchMedia("(pointer: fine)").matches;
    setScrubMode(canScrub);

    if (!canScrub) {
      v.loop = true;
      v.muted = true;
      v.play().catch(() => {});
      return;
    }

    // Prime the decoder/buffer up front (muted) so the very first scrub frame is
    // ready the instant you scroll into the section — no poster-to-video pop.
    v.play()
      .then(() => {
        v.pause();
        v.currentTime = 0;
      })
      .catch(() => {});

    let duration = 0;
    let targetTime = 0;
    const onMeta = () => {
      duration = v.duration || 14.5;
    };
    v.addEventListener("loadedmetadata", onMeta);
    if (v.readyState >= 1) onMeta();

    // Smoothly ease the video's playhead toward the scroll-driven target.
    let raf = 0;
    const loop = () => {
      if (duration) {
        const cur = v.currentTime;
        const next = cur + (targetTime - cur) * 0.2;
        if (Math.abs(next - cur) > 0.001) {
          try {
            v.currentTime = next;
          } catch {}
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        targetTime = p * (duration || 14.5);
        setCaption(labelFor(p));
        if (barFill.current) barFill.current.style.transform = `scaleX(${p})`;
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("loadedmetadata", onMeta);
      st.kill();
    };
  }, []);

  return (
    <section id="approach" ref={root} className={`fly ${scrubMode ? "" : "fly--loop"}`}>
      <div className="fly__sticky">
        <div className="fly__stage">
          <video
            ref={video}
            className="fly__video"
            src="/video/walk.mp4"
            poster="/video/walk-poster.jpg"
            muted
            playsInline
            preload="auto"
          />
          <div className="fly__vignette" />
        </div>

        <div className="fly__ui container">
          <div className="fly__top">
            <span className="eyebrow">A Scrollable Experience</span>
            <span className="fly__tag">Walkthrough</span>
          </div>
          <div className="fly__bottom">
            <h2 className="display fly__caption">{caption}</h2>
            <p className="fly__hint">
              {scrubMode
                ? "Keep scrolling — the camera moves through the home."
                : "A cinematic pass through the home."}
            </p>
            <div className="fly__bar">
              <div ref={barFill} className="fly__barFill" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fly {
          height: 500vh;
          position: relative;
          background: #000;
        }
        .fly--loop {
          height: 100vh;
        }
        .fly__sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        .fly--loop .fly__sticky {
          position: relative;
        }
        .fly__stage {
          position: absolute;
          inset: 0;
        }
        .fly__video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.94) saturate(1.03);
        }
        .fly__vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
              120% 90% at 50% 40%,
              transparent 55%,
              rgba(0, 0, 0, 0.5) 100%
            ),
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.5) 0%,
              transparent 22%,
              transparent 55%,
              rgba(0, 0, 0, 0.82) 100%
            );
        }
        .fly__ui {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-top: 120px;
          padding-bottom: clamp(40px, 8vh, 90px);
          pointer-events: none;
        }
        .fly__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .fly__tag {
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--fg);
        }
        .fly__caption {
          font-size: clamp(40px, 8vw, 120px);
        }
        .fly__hint {
          margin-top: 16px;
          color: var(--fg-dim);
          font-size: 14px;
        }
        .fly__bar {
          margin-top: 22px;
          width: min(320px, 60vw);
          height: 2px;
          background: rgba(242, 240, 234, 0.18);
          overflow: hidden;
        }
        .fly__barFill {
          height: 100%;
          width: 100%;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
        }
      `}</style>
    </section>
  );
}
