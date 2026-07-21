"use client";

import { useState } from "react";

/**
 * Fills its positioned parent with a cover image. If the primary `src` fails to
 * load (offline, expired CDN, blocked host), it swaps to a local `fallback`
 * SVG so the layout is never broken.
 */
export default function SmartImage({
  src,
  fallback,
  alt = "",
  priority = false,
  className = "",
  style,
}: {
  src: string;
  fallback: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [current, setCurrent] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        ...style,
      }}
    />
  );
}
