import { createResponse } from "@/lib/session";
import { generateToken, isAuth } from "@/lib/utils";
import { NextRequest } from "next/server";
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
  const { currentUser } = await isAuth(request, response);
  if (currentUser?.role === "ADMIN" && currentUser.verified) {
    const formData = await request.formData();
    // @ts-ignore
    const image: File = formData.get("image")!;
    const filename = generateToken() + ".jpg";
    // Upload to firebase storage
    const storageRef = ref(storage, `images/${filename}`);
    const { metadata, ref: ubRef } = await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);

    return createResponse(
      response,
      JSON.stringify({
        success: 1,
        file: {
          url: url,
        },
      }),
      {
        status: 200,
      }
    );
  } else {
    return createResponse(
      response,
      JSON.stringify({
        success: 0,
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
    const { filename } = await request.json();
    // Delete image from firebase
    const storageRef = ref(storage, `images/${filename}`);
    await deleteObject(storageRef);
    return createResponse(
      response,
      JSON.stringify(
        JSON.stringify({
          success: true,
          message: "Deleted image successfully.",
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
