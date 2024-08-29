import { createResponse } from "@/lib/session";
import {
  generateToken,
  isAuth,
  signInFirebase,
  signOutFirebase,
} from "@/lib/utils";
import { NextRequest } from "next/server";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
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
    const listRef = ref(storage, "images");

    // Find all the prefixes and items.
    const { items } = await listAll(listRef);

    await Promise.all(
      items.map(async (item) => {
        const url = await getDownloadURL(item);
        urlList.push(url);
      })
    );
    console.log("List: ", urlList);
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
