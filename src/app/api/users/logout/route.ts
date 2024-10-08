import { Results } from "@/lib/models";
import { createResponse, getSession } from "@/lib/session";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  let message = Results.REQUIRED_LOGIN;
  let status = 403;
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  console.log("Session User: ", session.user);
  if (session?.user) {
    status = 200;
    message = Results.SUCCESS;
    await session.destroy();
  }
  console.log("Message: ", message);
  return createResponse(response, JSON.stringify({ message: message }), {
    status: status,
  });
}
