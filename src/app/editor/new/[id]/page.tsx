"use client";

import Loading from "@/app/components/Loading";
import { Article } from "@/lib/models";
//index.tsx
import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";
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

  /**
   * Fetch existing data
   */
  const fetchData = async () => {
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articleId: params.id }),
    });
    const { article, message }: { article: Article; message: string } =
      await res.json();
    if (article) {
      setCurrentArticle(article);
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

  return (
    <main>
      {isLoading ? (
        <Loading label="Fetching data..." />
      ) : (
        <EditorBlock
          data={data}
          onChange={setData}
          currentArticle={currentArticle!}
          setCurrentArticle={setCurrentArticle}
          holder="editorjs-container"
        />
      )}
    </main>
  );
}

export default EditorPage;
