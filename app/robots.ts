import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://lawpilot-ai.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/settings/", "/dashboard/", "/assistant/", "/vault/", "/docs/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
