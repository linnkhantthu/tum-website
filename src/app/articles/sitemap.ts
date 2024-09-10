import { Article } from "@/lib/models";
import type { MetadataRoute } from "next";

export async function generateSitemaps() {
  const sitemaps = [];
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/articles?isPublished=true&skip=0&take=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      const { count }: { count: number } = await res.json();
      const numberOfSitemaps = Math.ceil(count / 50000); // 50,000 URLs per sitemap

      for (let i = 0; i < numberOfSitemaps; i++) {
        sitemaps.push({ id: `sitemap_${i}` });
      }
    } else {
      console.error("Failed to fetch article count");
    }
  } catch (error) {
    console.error("Error generating sitemaps:", error);
  }
  return sitemaps;
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const _id = parseInt(id.split("_")[1], 10); // Extract numeric ID
  const skip = _id * 50000; // Calculate pagination based on the ID

  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/articles?isPublished=true&skip=${skip}&take=50000`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 * 60 * 12 }, // Revalidate every 12 hour
      }
    );

    if (res.ok) {
      const { articles }: { articles: Article[] } = await res.json();
      return articles.map((article) => ({
        url: `${process.env.BASE_URL}/articles/${article.id}/${article.slug}`,
        lastModified: new Date(article.date),
      }));
    } else {
      console.error("Failed to fetch articles");
      return [];
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
