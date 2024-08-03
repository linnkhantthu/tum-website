"use client";

import Loading from "@/app/components/Loading";
//index.tsx
import { OutputData } from "@editorjs/editorjs";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// important that we use dynamic loading here
// editorjs should only be rendered on the client side.
const EditorBlock = dynamic(
  () => import("@/app/components/editor/EditorReadOnly"),
  {
    ssr: false,
  }
);

import React from "react";

function ArticleById({ params }: { params: { id: string } }) {
  //state to hold output data. we'll use this for rendering later
  const [data, setData] = useState<OutputData>();
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    const res = await fetch(`/api/article?id=${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const { article, message } = await res.json();
      console.log("Article: ", article.content);
      if (article) {
        setIsLoading(false);
        setData(article.content);
      }
    } else {
      const { message } = await res.json();
      alert(message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <main>
      {isLoading ? (
        <div className="flex flex-col mt-20">
          <Loading />
        </div>
      ) : (
        <EditorBlock
          data={data}
          onChange={setData}
          holder="editorjs-container"
        />
      )}
    </main>
  );
}

export default ArticleById;