import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Why from "@/components/Why";
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

const INTRO_SEEN_KEY = "2g_intro_seen";

function Index() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const floorOf = () => window.innerHeight * 0.68;

    // The clean robot intro plays only once per session. When coming back to
    // the home page (logo / Home / back from catalog), open straight at the
    // point where the page unlocks instead of replaying the intro.
    let introPassed = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    let restore = 0;
    if (introPassed) {
      // The router may reset the offset right after mount, so re-apply the
      // landing position for a few frames until it sticks.
      let tries = 0;
      const settle = () => {
        window.scrollTo(0, floorOf());
        if (++tries < 20) restore = requestAnimationFrame(settle);
      };
      settle();
    } else {
      window.scrollTo(0, 0);
    }


    let frame = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const trigger = window.innerHeight * 0.8;
      const floor = floorOf();

      if (y >= trigger && !introPassed) {
        introPassed = true;
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      }
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

      <Navbar />

      <Hero ready />
      <Products />
      <div className="pointer-events-auto relative z-10">
        <div className="pointer-events-auto relative bg-background">

          <div className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent to-background" />
          <Why />
          <Footer />
        </div>
      </div>
    </main>
  );
}
