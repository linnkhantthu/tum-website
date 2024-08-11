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
    }: { data: object; isPublished: boolean; articleId: string | undefined } =
      await request.json();
    // Create new article
    const article = articleId
      ? await updateArticleById(articleId, data, isPublished)
      : await insertArticleByUsername(currentUser?.username);
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
          message: "System Error: faieled to upload data.",
        }),
        {
          status: 500,
        }
      );
    }
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

export async function GET(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser, isLoggedIn } = await isAuth(request, response);
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("id");
  const isPublished = searchParams.get("isPublished") === "true";
  const articles =
    articleId !== null
      ? await getArticleById(articleId, isLoggedIn, currentUser?.verified!)
      : isPublished
      ? await getArticles(-8, isPublished, isLoggedIn, currentUser?.verified!)
      : currentUser?.role === "ADMIN" && currentUser.verified
      ? await getArticles(-8, isPublished, isLoggedIn, currentUser?.verified!)
      : await getArticles(-8, true, isLoggedIn, currentUser?.verified!);
  console.log(articles);
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
        message: "System Error: Failed to fetch the article, please try again",
      }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser } = await isAuth(request, response);

  if (currentUser?.role === "ADMIN" && currentUser.verified) {
    const { articleId } = await request.json();
    const { article, message } = await deletedArticleById(articleId);
    if (article) {
      return createResponse(
        response,
        JSON.stringify({
          success: true,
          message: message,
        }),
        {
          status: 200,
        }
      );
    } else {
      console.log(message);
      return createResponse(
        response,
        JSON.stringify({
          success: false,
          message:
            "System Error: Failed to delete the article, please try again",
        }),
        {
          status: 500,
        }
      );
    }
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
