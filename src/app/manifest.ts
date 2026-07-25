import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: "KKTC genelinde taksi bulma platformu.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf4f0",
    theme_color: "#c2410c",
    lang: "tr",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
