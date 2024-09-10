// /app/api/revalidate-sitemap/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Revalidate the sitemap route
    await fetch(`${process.env.BASE_URL}/sitemap.xml`);

    // If you have chunked sitemaps (e.g., sitemap_0.xml, sitemap_1.xml), revalidate those too
    await fetch(`${process.env.BASE_URL}/articles/sitemap/sitemap_0.xml`);
    // await fetch(`${process.env.BASE_URL}/sitemap_1.xml`);
    // Add more as needed

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating sitemap", error: err },
      { status: 500 }
    );
  }
}
