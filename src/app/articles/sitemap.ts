import { Article } from "@/lib/models";
import type { MetadataRoute } from "next";

export async function generateSitemaps() {
  // Get Total Number of articles and divide by 50000
  return [{ id: `sitemap_${0}` }];
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const res = await fetch(
    `${process.env.BASE_URL}/api/articles?isPublished=${true}&skip=${id}&take=${
      id + 50000
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) {
    const { articles, message }: { articles: Article[]; message: string } =
      await res.json();
    return articles.map((article) => ({
      url: `${process.env.BASE_URL}/articles/${article.id}/${article.slug}`,
      lastModified: new Date(),
    }));
  } else {
    return [];
  }
}
