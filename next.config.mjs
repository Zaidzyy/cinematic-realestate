/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fonts are loaded via a <link> in app/layout.tsx; skip Next's build-time
  // stylesheet inlining so builds don't depend on fetching Google Fonts.
  optimizeFonts: false,
  images: {
    // Placeholder art is local SVG; serve as-is. Set to false when you switch
    // to real raster photos to re-enable Next's image optimization.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
