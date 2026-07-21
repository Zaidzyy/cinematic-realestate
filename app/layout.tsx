import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Kavya Estates — Curated Residences",
  description:
    "A private portfolio of design-led homes. An immersive, scroll-driven residence experience by Kavya Estates.",
  openGraph: {
    title: "Kavya Estates — Curated Residences",
    description:
      "A private portfolio of design-led homes. An immersive, scroll-driven residence experience by Kavya Estates.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="booting">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;800;900&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Plain-CSS boot cover: paints on the very first frame (before JS or
            styled-jsx load), so no unstyled / mid-scroll content can flash.
            The intro loader removes the `booting` class once it's mounted. */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html.booting{overflow:hidden}html.booting body{overflow:hidden}html.booting::before{content:'';position:fixed;inset:0;background:#0b0b0c;z-index:1500}",
          }}
        />
        {/* Stop scroll restoration (the mid-page flash) + failsafe uncover. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);setTimeout(function(){document.documentElement.classList.remove('booting')},4000);",
          }}
        />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
