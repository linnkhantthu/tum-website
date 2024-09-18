import { createResponse } from "@/lib/session";
import {
  generateToken,
  isAuth,
  signInFirebase,
  signOutFirebase,
} from "@/lib/utils";
import { NextRequest } from "next/server";
import {
  deleteObject,
  getDownloadURL,
  list,
  ref,
  uploadBytes,
} from "firebase/storage";
import { app, storage } from "@/lib/firebase";
import { getAuth } from "firebase/auth";

export async function GET(request: NextRequest) {
  // Create response
  const response = new Response();
  let urlList: string[] = [];
  const auth = getAuth(app);
  const userId = await signInFirebase(auth);

  if (userId) {
    // Create a reference under which you want to list
    const listRef = ref(storage, "showcase");

    // Find all the prefixes and items.
    const { items } = await list(listRef, { maxResults: 10 });

    await Promise.all(
      items.map(async (item) => {
        const url = await getDownloadURL(item);
        urlList.push(url);
      })
    );
    const isSignedOut = await signOutFirebase(auth);
    return createResponse(
      response,
      JSON.stringify({
        message: "Fetched links successfully.",
        urlList: urlList,
      }),
      {
        status: 200,
      }
    );
  } else {
    return createResponse(
      response,
      JSON.stringify({
        message: "Failed to fetch links.",
      }),
      {
        status: 403,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser } = await isAuth(request, response);
  if (currentUser?.role === "ADMIN" && currentUser.verified) {
    const formData = await request.formData();
    //@ts-ignores
    const image: File = formData.get("image")!;
    const auth = getAuth(app);
    const userId = await signInFirebase(auth);

    if (userId) {
      // Create a reference under which you want to list
      const ext = image.type.split("/")[1];
      const filename = generateToken() + `.${ext}`;
      const storageRef = ref(storage, `showcase/${filename}`);
      const { metadata, ref: ubRef } = await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      await signOutFirebase(auth);
      const isSignedOut = await signOutFirebase(auth);
      return createResponse(
        response,
        JSON.stringify({
          message: "Uploaded image successfully.",
          url: url,
        }),
        {
          status: 200,
        }
      );
    } else {
      return createResponse(
        response,
        JSON.stringify({
          message: "Failed to upload image",
        }),
        {
          status: 403,
        }
      );
    }
  } else {
    return createResponse(
      response,
      JSON.stringify({
        message: "Unthorized Access.",
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
    const auth = getAuth(app);
    const userId = await signInFirebase(auth);
    if (userId) {
      const { filename } = await request.json();
      // Delete image from firebase
      const storageRef = ref(storage, `showcase/${filename}`);
      await deleteObject(storageRef);
      await signOutFirebase(auth);
      return createResponse(
        response,
        JSON.stringify({
          success: true,
          message: "Deleted image successfully.",
        }),
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
            message: "SystemError: Failed to delete.",
          })
        ),
        {
          status: 500,
        }
      );
    }
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

export async function PUT(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser } = await isAuth(request, response);
  if (currentUser?.role === "ADMIN" && currentUser.verified) {
    const formData = await request.formData();
    //@ts-ignores
    const image: File = formData.get("image")!;
    const filename = formData.get("filename")!;
    console.log(filename);
    const auth = getAuth(app);
    const userId = await signInFirebase(auth);
    if (userId) {
      // Delete image from firebase
      const storageRef = ref(storage, `showcase/${filename}`);
      // Delete the old image
      await deleteObject(storageRef);

      // Upload new image
      const { metadata, ref: ubRef } = await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);

      await signOutFirebase(auth);
      return createResponse(
        response,
        JSON.stringify({
          success: true,
          url: url,
          message: "Deleted image successfully.",
        }),
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
            message: "SystemError: Failed to delete.",
          })
        ),
        {
          status: 500,
        }
      );
    }
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
