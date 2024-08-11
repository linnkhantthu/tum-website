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
  const { data: userData, isLoading: isUserLoading, isError } = useUser();
  const { push } = useRouter();

  const fetchData = async () => {
    const res = await fetch(`/api/articles?id=${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const { articles, message }: { articles: Article; message: string } =
        await res.json();
      if (articles) {
        setIsLoading(false);
        setData(articles.content);
      }
    } else {
      const { message } = await res.json();
      alert(message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return isLoading ? (
    <Loading label="Fetching data..." />
  ) : (
    <EditorBlock
      data={data}
      onChange={setData}
      holder="editorjs-container"
      articleId={params.id}
    />
  );
}

export default ArticleById;
