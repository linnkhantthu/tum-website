"use client";

import { useEffect, useState } from "react";
import VCard from "./components/VCard";
import { Article } from "@/lib/models";
import Showcase from "./components/Showcase";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const skeletonCount = [0, 0, 0, 0];
  useEffect(() => {
    // Fetch Articles
    fetch(`/api/articles?isPublished=${true}&skip=${0}&take=-10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(
        ({ articles, message }: { articles: Article[]; message: string }) => {
          if (articles) {
            setArticles([...articles]);
          }
          setIsLoading(false);
        }
      );
  }, []);

  return (
    <main className="flex flex-col h-full items-center">
      {/* Articles */}

      {/* Show Case */}
      <Showcase />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 h-min">
          {skeletonCount.map((_, ind) => (
            <VCard
              key={`skeleton-${ind}`}
              image={undefined}
              title={""}
              content={""}
              authorName={""}
              date={""}
              articleId={""}
              isSkeleton={true}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 h-min">
          {articles.length === 0 ? (
            <div className="grid grid-cols-1">No articles yet</div>
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

              const title = header ? header.data.text : "Title";
              const content = paragraph ? paragraph.data.text : "Content";
              const date = new Date(article.date);
              return (
                <VCard
                  key={`article-${article.id}`}
                  image={image}
                  title={title}
                  content={content}
                  authorName={article.author.username}
                  date={date.toDateString()}
                  articleId={article.id!}
                  isSkeleton={false}
                />
              );
            })
          )}
        </div>
      )}
    </main>
  );
}
