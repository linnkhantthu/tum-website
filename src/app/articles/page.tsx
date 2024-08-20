"use client";

import Loading from "@/app/components/Loading";
import { useEffect, useState } from "react";
import React from "react";
import HCard from "../components/HCard";
import { Article } from "@/lib/models";
import useUser from "@/lib/useUser";
import Filter from "../components/Filter";
import Warning from "../components/Warning";

function Articles() {
  const { data, isLoading: isUserLoading, isError } = useUser();
  //state to hold output data. we'll use this for rendering later
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublished, setIsPublished] = useState<boolean>(true);
  const fetchData = async () => {
    const res = await fetch(`/api/articles?isPublished=${isPublished}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const { articles, message } = await res.json();

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
          {/* Filter */}
          {isUserLoading ? (
            "Loading Filter"
          ) : isError ? (
            <Warning />
          ) : data.user?.role === "ADMIN" ? (
            <Filter
              setArticles={setArticles}
              isPublished={isPublished}
              setIsPublished={setIsPublished}
            />
          ) : (
            ""
          )}
          {/* Articles */}
          <div>
            {articles.length === 0 ? (
              <div className="flex flex-row justify-center items-center w-full mt-10">
                No Articles yet.
              </div>
            ) : (
              articles.map((article) => {
                const blocks =
                  article.content === null ? undefined : article.content.blocks;
                const image = blocks?.filter(
                  (value) => value.type === "image"
                )[0];
                const header = blocks?.filter(
                  (value) => value.type === "header"
                )[0];
                const paragraph = blocks?.filter(
                  (value) => value.type === "paragraph"
                )[0];

                const title = header ? header.data.text : "No Title Yet";
                const content = paragraph
                  ? paragraph.data.text
                  : "No Content Yet";
                return (
                  <HCard
                    key={`article-${article.id}`}
                    image={image}
                    title={title}
                    content={content}
                    article={article}
                  />
                );
              })
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Articles;
