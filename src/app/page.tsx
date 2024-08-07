"use client";

import { useEffect, useState } from "react";
import VCard from "./components/VCard";
import { Article } from "@/lib/models";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch(`/api/articles?isPublished=${true}`, {
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
        }
      );
  }, []);

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="carousel w-full h-min">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
            className="w-full"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide4" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
            className="w-full"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
            className="w-full"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide4" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide4" className="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
            className="w-full"
          />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide3" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>
      <div className="w-full p-10 h-fit flex flex-row flex-wrap">
        {articles.length === 0 ? (
          <div className="flex flex-row justify-center items-center w-full">
            No articles yet
          </div>
        ) : (
          articles.map((article) => {
            const blocks =
              article.content === null ? undefined : article.content.blocks;
            const image = blocks?.filter((value) => value.type === "image")[0];
            const header = blocks?.filter(
              (value) => value.type === "header"
            )[0];
            const paragraph = blocks?.filter(
              (value) => value.type === "paragraph"
            )[0];

            const title = header ? header.data.text : "Title";
            const content = paragraph ? paragraph.data.text : "Content";
            return (
              <VCard
                key={`article-${article.id}`}
                image={image}
                title={title}
                content={content}
              />
            );
          })
        )}
      </div>
    </main>
  );
}
