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
import HCard from "../components/HCard";
import { Article } from "@/lib/models";

function Articles() {
  //state to hold output data. we'll use this for rendering later
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    const res = await fetch(`/api/articles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const { articles, message } = await res.json();
      console.log("Article: ", articles);
      if (articles) {
        setIsLoading(false);
        setArticles(articles);
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
        <div>
          {articles.map((article) => {
            const blocks = article.content.blocks;
            const image = blocks.filter((value) => value.type === "image")[0];
            const header = blocks.filter((value) => value.type === "header")[0];
            const paragraph = blocks.filter(
              (value) => value.type === "paragraph"
            )[0];

            const title = header ? header.data.text : "Title";
            const content = paragraph ? paragraph.data.text : "Content";
            return (
              <HCard
                key={`article-${article.id}`}
                image={image}
                title={title}
                content={content}
                articleId={article.id!}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Articles;
