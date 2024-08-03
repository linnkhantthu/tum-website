import prisma from "@/db";
import {
  getArticleById,
  insertArticleByUsername,
} from "@/lib/query/article/article";
import { createResponse, getSession } from "@/lib/session";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  let { user: currentUser } = session;
  const data = await request.json();
  //   console.log(typeof data);

  const article = await insertArticleByUsername(currentUser?.username, data);
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
  //   console.log(typeof data);
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("id");
  const article = await getArticleById(parseInt(articleId!));
  if (article) {
    return createResponse(
      response,
      JSON.stringify({
        article: article,
        message: "Fetched article successfully.",
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
