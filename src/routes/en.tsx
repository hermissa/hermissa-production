import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home-page";

export const Route = createFileRoute("/en")({
  component: () => <HomePage lang="en" />,
  head: () => ({
    meta: [
      { title: "HERMISSA — Pro Makeup Artist for Editorial & Fashion" },
      {
        name: "description",
        content:
          "Melissa — pro makeup artist based in Switzerland. Beauty, commercial & editorial for fashion shows, shoots and campaigns. Get in touch for bookings.",
      },
      { property: "og:title", content: "HERMISSA — Pro Makeup Artist for Editorial & Fashion" },
      {
        property: "og:description",
        content: "Beauty, commercial & editorial — based in Switzerland. Get in touch for bookings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
