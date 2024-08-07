import prisma from "@/db";
import {
  getArticleById,
  getArticles,
  insertArticleByUsername,
  updateArticleById,
} from "@/lib/query/article/query";
import { createResponse, getSession } from "@/lib/session";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  let { user: currentUser } = session;
  const {
    data,
    isPublished,
    articleId,
  }: { data: object; isPublished: boolean; articleId: number | undefined } =
    await request.json();

  // Create new article
  const article = articleId
    ? await updateArticleById(articleId, data, isPublished)
    : await insertArticleByUsername(isPublished, currentUser?.username, data);
  if (article) {
    return createResponse(
      response,
      JSON.stringify({
        article: article,
        message: "Uploaded the article successfully.",
      }),
      {
        status: 200,
      }
    );
  } else {
    return createResponse(
      response,
      JSON.stringify({
        message: "Failed to upload the article, please try again",
      }),
      {
        status: 403,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  let { user: currentUser } = session;
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("id");
  const articles =
    articleId !== null
      ? await getArticleById(parseInt(articleId))
      : await getArticles();
  if (articles) {
    return createResponse(
      response,
      JSON.stringify({
        articles: articles,
        message: "Fetched articles successfully.",
      }),
      {
        status: 200,
      }
    );
  } else {
    return createResponse(
      response,
      JSON.stringify({
        message: "Failed to fetch the article, please try again",
      }),
      {
        status: 403,
      }
    );
  }
}

insertArticleByUsername()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
