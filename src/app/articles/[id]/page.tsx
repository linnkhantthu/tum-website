"use client";

import Loading from "@/app/components/Loading";
import { Article, User } from "@/lib/models";
//index.tsx
import { OutputData } from "@editorjs/editorjs";
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
  const [currentAuthor, setCurrentAuthor] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [publishedDate, setPublishedDate] = useState<Date>();

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
        setData(articles.content === null ? data : articles.content);
        setCurrentAuthor(articles.author);
        setPublishedDate(articles.date);
      }
      setMessage(message);
    } else {
      const { message } = await res.json();
      setMessage(message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return isLoading ? (
    <Loading label="Fetching data..." />
  ) : currentAuthor ? (
    <EditorBlock
      data={data}
      onChange={setData}
      holder="editorjs-container"
      articleId={params.id}
      currentAuthor={currentAuthor!}
      publishedDate={publishedDate}
    />
  ) : (
    <div className="text-center mt-3">{message}</div>
  );
}

export default ArticleById;
