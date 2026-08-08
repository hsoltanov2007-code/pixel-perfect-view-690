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
  }, []);

  return (
    <main className="pointer-events-none relative animate-fade-in">

      <SplineBackground />
      <Navbar />
      <Hero ready />
      <div className="pointer-events-auto relative z-10">
        <Plans />
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
