import { Article } from "@/lib/models";
import type { MetadataRoute } from "next";

export async function generateSitemaps() {
  return [{ id: 0 }];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const res = await fetch(
    `${
      process.env.BASE_URL
    }/api/articles?isPublished=${true}&skip=${0}&take=50000`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const { articles, message }: { articles: Article[]; message: string } =
    await res.json();
  return articles.map((article) => ({
    url: `${process.env.BASE_URL}/articles/${article.id}/${article.slug}`,
    lastModified: new Date(),
  }));
}
