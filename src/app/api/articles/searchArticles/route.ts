import {
  updateArticleById,
  insertArticleByUsername,
  searchArticlesByTitle,
} from "@/lib/query/article/query";
import { isAuth } from "@/lib/utils";
import { ArticleType, Category, Subcategory } from "@prisma/client";
import { createResponse } from "iron-session";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser } = await isAuth(request, response);

  const { title }: { title: string } = await request.json();
  // Create new article
  const { articles, message } = await searchArticlesByTitle(
    title,
    currentUser?.role === "ADMIN" && currentUser.verified
  );
  return createResponse(
    response,
    JSON.stringify({
      articles: articles,
      message: message,
    }),
    {
      status: 200,
    }
  );
}
