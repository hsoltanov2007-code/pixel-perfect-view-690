import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Why from "@/components/Why";
import Plans from "@/components/Plans";
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
  return (
    <main className="relative animate-fade-in">
      <Navbar />
      <Hero ready />
      <Plans />
      <Why />
      <Contact />
      <Footer />
    </main>
  );
}
