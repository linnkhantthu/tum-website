"use client";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import dynamic from "next/dynamic";
import { OutputData } from "@editorjs/editorjs";
import { Article, User } from "@/lib/models";
// important that we use dynamic loading here
// editorjs should only be rendered on the client side.
const EditorBlock = dynamic(
  () => import("@/app/components/editor/EditorReadOnly"),
  {
    ssr: false,
  }
);
function ArticlePage({ id }: { id: string }) {
  //state to hold output data. we'll use this for rendering later
  const [data, setData] = useState<OutputData>();
  const [currentAuthor, setCurrentAuthor] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [publishedDate, setPublishedDate] = useState<Date>();
  const [currentArticle, setCurrentArticle] = useState<Article>();

  /**
   * Fetch Article
   */
  const fetchArticle = async () => {
    const res = await fetch(`/api/articles?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const { articles, message }: { articles: Article; message: string } =
        await res.json();
      if (articles) {
        setCurrentArticle(articles);
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
    fetchArticle();
  }, []);
  return isLoading ? (
    <div className="flex flex-col h-full justify-center">
      <Loading label="Fetching article..." />
    </div>
  ) : currentAuthor ? (
    <EditorBlock
      data={data}
      onChange={setData}
      holder="editorjs-container"
      articleId={id}
      currentArticle={currentArticle}
      currentAuthor={currentAuthor!}
      publishedDate={publishedDate}
    />
  ) : (
    <div className="text-center mt-3">{message}</div>
  );
}
export default ArticlePage;
