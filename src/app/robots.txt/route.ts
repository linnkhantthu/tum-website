import { NextResponse } from "next/server";

export async function GET() {
  let numberOfSitemaps = 0;
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
      numberOfSitemaps = Math.ceil(count / 50000); // 50,000 URLs per sitemap
    } else {
      console.error("Failed to fetch article count");
    }
  } catch (error) {
    console.error("Error generating sitemaps count:", error);
  }
  // Dynamically generate the sitemap entries for robots.txt
  let sitemaps = `Sitemap: ${process.env.BASE_URL}/sitemap.xml\n`;
  for (let i = 0; i < numberOfSitemaps; i++) {
    sitemaps += `Sitemap: ${process.env.BASE_URL}/articles/sitemap/sitemap_${i}.xml\n`;
  }
  const robotsTxt = `
User-agent: *
Allow: /    
${sitemaps}
  `;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
