import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Concierge from "@/components/Concierge";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Statement from "@/components/Statement";
import Flythrough from "@/components/Flythrough";
import Process from "@/components/Process";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <Concierge />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Statement />
        <Flythrough />
        <Process />
        <Gallery />
        <Contact />
      </main>
    </>
  );
}
