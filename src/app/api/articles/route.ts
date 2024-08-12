import prisma from "@/db";
import {
  deletedArticleById,
  getArticleById,
  getArticles,
  insertArticleByUsername,
  updateArticleById,
} from "@/lib/query/article/query";
import { createResponse, getSession } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { ArticleType } from "@prisma/client";
import { NextRequest } from "next/server";

/**
 * Insert & Update Articles/
 * Insert: No body required/
 * Update: articleId, data, isPublished are required
 * @param request
 * @returns article, message
 */
export async function POST(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser } = await isAuth(request, response);
  if (currentUser?.role === "ADMIN" && currentUser.verified) {
    const {
      data,
      isPublished,
      articleId,
      articleType,
    }: {
      data: object;
      isPublished: boolean;
      articleId: string | undefined;
      articleType: ArticleType;
    } = await request.json();
    // Create new article
    const { article, message } = articleId
      ? await updateArticleById(
          articleId,
          data,
          isPublished,
          articleType,
          currentUser?.id
        )
      : await insertArticleByUsername(currentUser?.username);
    return createResponse(
      response,
      JSON.stringify({
        article: article,
        message: message,
      }),
      {
        status: 200,
      }
    );
  } else {
    return createResponse(
      response,
      JSON.stringify({
        message: "Access to the requested resource is forbidden.",
      }),
      {
        status: 403,
      }
    );
  }
}

/**
 * Fetch article or articles
 * @param request
 * @returns article/articles, message
 */
export async function GET(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser, isLoggedIn } = await isAuth(request, response);
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("id");
  const isPublished = searchParams.get("isPublished") === "true";
  const { article, message } =
    articleId !== null
      ? await getArticleById(articleId, isLoggedIn, currentUser?.verified!)
      : isPublished
      ? await getArticles(-8, isPublished, isLoggedIn, currentUser?.verified!)
      : currentUser?.role === "ADMIN" && currentUser.verified
      ? await getArticles(-8, isPublished, isLoggedIn, currentUser?.verified!)
      : await getArticles(-8, true, isLoggedIn, currentUser?.verified!);
  return createResponse(
    response,
    JSON.stringify({
      articles: article === null ? undefined : article,
      message: message,
    }),
    {
      status: 200,
    }
  );
}

/**
 * Delete article
 * @param request
 * @returns success, message
 */
export async function DELETE(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser } = await isAuth(request, response);

  if (currentUser?.role === "ADMIN" && currentUser.verified) {
    const { articleId } = await request.json();
    const { article, message } = await deletedArticleById(
      articleId,
      currentUser.id
    );
    return createResponse(
      response,
      JSON.stringify({
        success: article ? true : false,
        message: message,
      }),
      {
        status: 200,
      }
    );
  }
  return createResponse(
    response,
    JSON.stringify({
      success: false,
      message: "Access to the requested resource is forbidden.",
    }),
    {
      status: 403,
    }
  );
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
