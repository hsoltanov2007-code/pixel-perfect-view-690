import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Milad — Web Developer & Motion-First Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Milad, a web developer building immersive 3D, GSAP-animated and high-performance web experiences.",
      },
      { property: "og:title", content: "Milad — Web Developer & Motion-First Portfolio" },
      {
        property: "og:description",
        content:
          "Immersive 3D and GSAP-powered web experiences by Milad, front-end developer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);

  return (
    <main className="relative">
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <div
        className="transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0 }}
      >
        <Navbar />
        <Hero ready={ready} />
        <About />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
