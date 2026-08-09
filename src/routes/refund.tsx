import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Payment & Refunds — 2G SHOP" },
      {
        name: "description",
        content:
          "How payment, warranty and refunds work for digital subscriptions bought at 2G SHOP.",
      },
      { property: "og:title", content: "Payment & Refunds — 2G SHOP" },
      {
        property: "og:description",
        content: "Payment methods, warranty period and when a refund is possible at 2G SHOP.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LegalPage slug="refund" />,
});
