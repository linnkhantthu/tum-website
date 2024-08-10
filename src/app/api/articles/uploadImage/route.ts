import { createResponse, getSession } from "@/lib/session";
import { generateToken } from "@/lib/utils";
import { rmSync, writeFileSync } from "fs";
import { NextRequest } from "next/server";
import path from "path";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

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
  // Write to file system
  // writeFileSync(path.join(process.cwd(), "public/images/" + filename), buffer);
  // Upload to firebase storage
  const storageRef = ref(storage, `images/${filename}`);
  const { metadata, ref: ubRef } = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(storageRef);
  console.log("URL: ", url);

  return createResponse(
    response,
    JSON.stringify({
      success: 1,
      file: {
        // url: `http://${request.headers.get("host")}/images/${filename}`,
        // ... and any additional fields you want to store, such as width, height, color, extension, etc
        url: url,
      },
    }),
    {
      status: 200,
    }
  );
}

export async function DELETE(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  let { user: currentUser } = session;
  if (currentUser) {
    const { filename } = await request.json();
    // rmSync(path.join(process.cwd(), "public/images/" + filename), {
    //   force: true,
    // });
    // Delete image from firebase
    const storageRef = ref(storage, `images/${filename}`);
    await deleteObject(storageRef);
    return createResponse(
      response,
      JSON.stringify(
        JSON.stringify({
          success: true,
          message: "Uploaded image successfully.",
        })
      ),
      {
        status: 200,
      }
    );
  } else {
    return createResponse(
      response,
      JSON.stringify(
        JSON.stringify({
          success: false,
          message: "Access to the requested resource is forbidden.",
        })
      ),
      {
        status: 403,
      }
    );
  }
}
