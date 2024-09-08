import ArticlePage from "@/app/components/ArticlePage";
import { Article } from "@/lib/models";
import { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

// Generate Metadata
export async function generateMetadata(
  { params }: { params: { id: string; slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;
  let article: Article | undefined;
  let imageUrl: string | undefined;
  let title: string | undefined;
  const headerList = headers();
  const protocol = headerList.get("x-forwarded-proto");
  const host = headerList.get("host");
  // fetch data
  const res = await fetch(`${protocol}://${host}/api/articles?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const { articles, message }: { articles: Article; message: string } =
      await res.json();
    if (articles && articles.slug === params.slug) {
      article = articles;
      const blocks =
        article.content === null ? undefined : article.content.blocks;
      imageUrl = blocks?.filter((value) => value.type === "image")[0]?.data.file
        .url;
      const header = blocks?.filter((value) => value.type === "header")[0];
      title = header ? header.data.text : "Title";
      // optionally access and extend (rather than replace) parent metadata
      const previousImages = (await parent).openGraph?.images || [];
      return {
        title: `TUM: ${title}`,
        openGraph: {
          images: [imageUrl!, ...previousImages],
        },
      };
    }
  } else {
    const { message } = await res.json();
    console.log(message);
  }
  return {
    title: `TUM: 404 not found.`,
  };
}

function ArticleById({ params }: { params: { id: string; slug: string } }) {
  return <ArticlePage id={params.id} slug={params.slug} />;
}

export default ArticleById;
