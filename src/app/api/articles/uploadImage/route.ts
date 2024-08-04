import { createResponse, getSession } from "@/lib/session";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  let { user: currentUser } = session;
  console.log("Server Side");
  const image = await request.formData();
  console.log(image);

  return createResponse(
    response,
    JSON.stringify({
      success: 1,
      file: {
        url: "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
        // ... and any additional fields you want to store, such as width, height, color, extension, etc
      },
    }),
    {
      status: 200,
    }
  );
}
