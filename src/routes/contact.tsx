import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — 2G SHOP" },
      {
        name: "description",
        content:
          "Get in touch with 2G SHOP. Send a message or start a live AI chat for instant support with your order.",
      },
      { property: "og:title", content: "Contact — 2G SHOP" },
      {
        property: "og:description",
        content:
          "Get in touch with 2G SHOP. Send a message or start a live AI chat for instant support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactLayout,
});

function ContactLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto min-h-screen max-w-7xl">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
