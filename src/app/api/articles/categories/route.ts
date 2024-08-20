import {
  deleteCategoryById,
  getAllCategories,
  insertCategoryByUserId,
} from "@/lib/query/Category/query";
import { createResponse } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Create response
  const response = new Response();
  const { categories, message } = await getAllCategories();

  return createResponse(
    response,
    JSON.stringify({
      categories: categories,
      message: message,
    }),
    {
      status: 200,
    }
  );
}

export async function POST(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser } = await isAuth(request, response);
  if (currentUser?.role === "ADMIN" && currentUser.verified) {
    const { categoryName }: { categoryName: string } = await request.json();
    // Query
    const { category, message } = await insertCategoryByUserId(
      currentUser.id,
      categoryName
    );
    return createResponse(
      response,
      JSON.stringify({
        category: category,
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
        message: "Forbidden Request.",
      }),
      {
        status: 403,
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
    const { categoryId }: { categoryId: string } = await request.json();
    const { category, message } = await deleteCategoryById(categoryId);
    return createResponse(
      response,
      JSON.stringify({
        category: category,
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
        success: false,
        message: "Access to the requested resource is forbidden.",
      }),
      {
        status: 403,
      }
    );
  }
}
