import { createResponse, getSession } from "@/lib/session";
import { generateToken } from "@/lib/utils";
import { writeFileSync } from "fs";
import { NextRequest } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  let { user: currentUser } = session;
  const formData = await request.formData();
  // @ts-ignore
  const image: File = formData.get("image")!;
  //   const dir = `${__dirname.split(".")[0]}public/images/`;
  const buffer = Buffer.from(await image.arrayBuffer());
  const filename = generateToken() + ".jpg";
  writeFileSync(path.join(process.cwd(), "public/images/" + filename), buffer);
  console.log(request.headers.get("host"));
  return createResponse(
    response,
    JSON.stringify({
      success: 1,
      file: {
        url: `http://${request.headers.get("host")}/images/${filename}`,
        // ... and any additional fields you want to store, such as width, height, color, extension, etc
      },
    }),
    {
      status: 200,
    }
  );
}
