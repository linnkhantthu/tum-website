import { createResponse } from "@/lib/session";
import { signInFirebase, signOutFirebase } from "@/lib/utils";
import { NextRequest } from "next/server";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { app, storage } from "@/lib/firebase";
import { getAuth } from "firebase/auth";

export async function POST(request: NextRequest) {
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
