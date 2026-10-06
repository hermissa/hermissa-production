import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/")({
  component: () => <HomePage lang="de" />,
  head: () => ({
    meta: [
      { title: "HERMISSA – Fashion & Bridal Make Up" },
      {
        name: "description",
        content:
          "Melissa — Pro Makeup Artist in der Schweiz. Beauty, Commercial & Editorial für Fashion Shows, Shootings und Campaigns. Kontakt für Bookings.",
      },
      { property: "og:title", content: "HERMISSA – Fashion & Bridal Make Up" },
      {
        property: "og:description",
        content: "Beauty, Commercial & Editorial — based in Switzerland. Kontakt für Bookings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
