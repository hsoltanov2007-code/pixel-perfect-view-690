import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import SplineBackground from "@/components/SplineBackground";
import Hero from "@/components/Hero";
import Why from "@/components/Why";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "2G SHOP — Premium Subscriptions & Digital Goods Online" },
      {
        name: "description",
        content:
          "Buy premium subscriptions online at 2G SHOP: streaming, music, gaming, AI and VPN plans with instant delivery, warranty and 24/7 support.",
      },
      { property: "og:title", content: "2G SHOP — Premium Subscriptions Online" },
      {
        property: "og:description",
        content:
          "Streaming, music, gaming, AI and VPN subscriptions delivered instantly, with warranty and 24/7 support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  // Always start from the top on reload — restoring a mid-page offset before
  // the sticky hero / 3D scene are ready caused the visual jank.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // The clean robot intro is shown only once. After it has been passed, keep
    // a small floor inside the text reveal, while leaving the rest of the page
    // free to scroll in either direction.
    let introPassed = false;
    let frame = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const trigger = window.innerHeight * 0.55;
      const floor = window.innerHeight * 0.35;

      if (y >= trigger) introPassed = true;
      if (introPassed && y < floor - 1 && !frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          window.scrollTo(0, floor);
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);


  return (
    <main className="pointer-events-none relative animate-fade-in">

      <SplineBackground />
      <Navbar />
      <Hero ready />
      <div className="pointer-events-auto relative z-10">
        <div className="pointer-events-auto relative bg-background">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent to-background" />
          <Why />
          <Contact />
          <Footer />
        </div>
      </div>
    </main>
  );
}
