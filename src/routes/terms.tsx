import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — 2G SHOP" },
      {
        name: "description",
        content:
          "Rules for ordering, delivery and using digital subscriptions purchased from 2G SHOP.",
      },
      { property: "og:title", content: "Terms of Service — 2G SHOP" },
      {
        property: "og:description",
        content: "Ordering, delivery, buyer responsibilities and liability for 2G SHOP purchases.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LegalPage slug="terms" />,
});
