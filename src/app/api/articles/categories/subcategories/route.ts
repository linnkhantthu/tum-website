import { insertSubcategoryByUserId } from "@/lib/query/subcategory/query";
import { createResponse } from "@/lib/session";
import { isAuth } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser } = await isAuth(request, response);
  if (currentUser?.role === "ADMIN" && currentUser.verified) {
    const {
      subcategoryName,
      categoryId,
    }: { subcategoryName: string; categoryId: string } = await request.json();
    // Query
    const { subcategory, message } = await insertSubcategoryByUserId(
      currentUser.id,
      subcategoryName,
      categoryId
    );
    return createResponse(
      response,
      JSON.stringify({
        subcategory: subcategory,
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

// export async function DELETE(request: NextRequest) {
//   // Create response
//   const response = new Response();
//   // Create session
//   const { currentUser } = await isAuth(request, response);
//   if (currentUser?.role === "ADMIN" && currentUser.verified) {
//     return createResponse(
//       response,
//       JSON.stringify(
//         JSON.stringify({
//           success: true,
//           message: "Deleted image successfully.",
//         })
//       ),
//       {
//         status: 200,
//       }
//     );
//   } else {
//     return createResponse(
//       response,
//       JSON.stringify(
//         JSON.stringify({
//           success: false,
//           message: "Access to the requested resource is forbidden.",
//         })
//       ),
//       {
//         status: 403,
//       }
//     );
//   }
// }
