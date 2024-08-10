"use client";

import Loading from "@/app/components/Loading";
import Warning from "@/app/components/Warning";
import { Article } from "@/lib/models";
import useUser from "@/lib/useUser";
//index.tsx
import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// important that we use dynamic loading here
// editorjs should only be rendered on the client side.
const EditorBlock = dynamic(() => import("../../../components/editor/Editor"), {
  ssr: false,
});

function EditorPage({ params }: { params: { id: string } }) {
  //state to hold output data. we'll use this for rendering later
  const [currentArticle, setCurrentArticle] = useState<Article>();
  const [data, setData] = useState<OutputData>(currentArticle?.content!);
  const [isLoading, setIsLoading] = useState(true);
  const { data: userData, isLoading: isUserLoading, isError } = useUser();
  const { push } = useRouter();

  /**
   * Fetch existing data
   */
  const fetchData = async () => {
    const res = await fetch(`/api/articles?id=${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ articleId: params.id }),
    });
    const { articles, message }: { articles: Article; message: string } =
      await res.json();
    if (articles) {
      setCurrentArticle(articles);
    } else {
      console.log(message);
    }
    return true;
  };

  useEffect(() => {
    // Fetch exisiting data
    fetchData().then((result) => setIsLoading(false));
  }, []);

  useEffect(() => setData(currentArticle?.content!), [currentArticle]);

  return isUserLoading ? (
    <Loading label="Loading..." />
  ) : isError ? (
    <Warning label="Lost connection to the server." />
  ) : userData.isLoggedIn ? (
    isLoading ? (
      <Loading label="Fetching data..." />
    ) : (
      <EditorBlock
        data={data}
        onChange={setData}
        currentArticle={currentArticle!}
        setCurrentArticle={setCurrentArticle}
        holder="editorjs-container"
      />
    )
  ) : (
    push("/")
  );
}

export default EditorPage;
