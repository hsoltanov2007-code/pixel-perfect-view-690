import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — 2G SHOP" },
      {
        name: "description",
        content:
          "How 2G SHOP collects, uses and protects your personal data when you buy digital subscriptions.",
      },
      { property: "og:title", content: "Privacy Policy — 2G SHOP" },
      {
        property: "og:description",
        content: "What data 2G SHOP collects, how it is used, stored and how to request deletion.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LegalPage slug="privacy" />,
});
