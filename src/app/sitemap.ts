import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.BASE_URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.BASE_URL}/users/auth`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.BASE_URL}/users/auth/forgotPassword`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.BASE_URL}/articles`,
      lastModified: new Date(),
    },
  ];
}
