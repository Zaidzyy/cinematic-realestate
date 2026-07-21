"use client";

/**
 * Kavya Estates motion logo.
 * A geometric "K" monogram: a stem plus two diagonals that draw on in sequence,
 * with an accent "plot" square that scales in. Pair with the wordmark.
 */
export default function Logo({
  size = 30,
  animate = false,
  wordmark = true,
  delay = 0,
}: {
  size?: number;
  animate?: boolean;
  wordmark?: boolean;
  delay?: number;
}) {
  return (
    <span className={`logo ${animate ? "logo--animate" : ""}`}>
      <svg
        className="logo__mark"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
      >
        <path className="logo__stem" d="M12 8 V40" />
        <path className="logo__up" d="M12 26 L34 8" />
        <path className="logo__down" d="M12 24 L36 41" />
        <rect className="logo__plot" x="35" y="20" width="8" height="8" rx="1.5" />
      </svg>
      {wordmark && (
        <span className="logo__word">
          <b>Kavya</b>
          <i>Estates</i>
        </span>
      )}

      <style jsx>{`
        .logo {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: var(--fg);
        }
        .logo__mark :global(path),
        .logo__mark :global(rect) {
          stroke: currentColor;
          stroke-width: 3.4;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .logo__plot {
          fill: var(--accent);
          stroke: none;
        }
        .logo__word {
          display: inline-flex;
          align-items: baseline;
          gap: 7px;
          font-family: var(--font-archivo), sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .logo__word b {
          font-weight: 900;
          font-size: 15px;
        }
        .logo__word i {
          font-style: normal;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.16em;
          color: var(--fg-dim);
        }

        /* Draw-on animation (used in preloader / on mount). */
        .logo--animate .logo__stem,
        .logo--animate .logo__up,
        .logo--animate .logo__down {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: draw 0.7s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        .logo--animate .logo__stem {
          animation-delay: ${delay}s;
        }
        .logo--animate .logo__up {
          animation-delay: ${delay + 0.28}s;
        }
        .logo--animate .logo__down {
          animation-delay: ${delay + 0.5}s;
        }
        .logo--animate .logo__plot {
          transform-box: fill-box;
          transform-origin: center;
          transform: scale(0);
          animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: ${delay + 0.85}s;
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes pop {
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </span>
  );
}
