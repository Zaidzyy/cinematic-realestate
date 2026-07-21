"use client";

const items = [
  "Curated Residences",
  "Signature Estates",
  "Design-Led Living",
  "Private Acquisitions",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <section className="marquee" aria-hidden>
      <div className="marquee__track">
        {row.map((t, i) => (
          <span key={i} className="marquee__item display">
            {t}
            <span className="marquee__dot">✦</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .marquee {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          padding: 26px 0;
          overflow: hidden;
          background: var(--bg);
        }
        .marquee__track {
          display: flex;
          width: max-content;
          gap: 0;
          animation: slide 34s linear infinite;
        }
        .marquee__item {
          display: inline-flex;
          align-items: center;
          gap: 44px;
          font-size: clamp(28px, 4vw, 56px);
          padding-right: 44px;
          color: var(--fg);
          opacity: 0.9;
        }
        .marquee__dot {
          color: var(--accent);
          font-size: 0.5em;
        }
        @keyframes slide {
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
