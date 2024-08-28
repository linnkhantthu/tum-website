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
  const [skip, setSkip] = useState(-10);
  const [totalNoOfPages, setTotalNoOfPages] = useState(0);
  const [currentPageNo, setCurrentPageNo] = useState(0);
  const [pageNo, pageNoController] = useState(1);

  /**
   * Fetch Articles
   * @param isNext
   * @param skip
   * @param currentPageNo
   */
  const fetchArticles = async (
    isNext: boolean,
    skip: number,
    currentPageNo: number
  ) => {
    setIsLoading(true);
    if (!isNext && skip < 0) {
      console.error("Page number cannot be negative");
    } else {
      const currentSkip = isNext ? skip + 10 : skip - 10;

      const res = await fetch(
        `/api/articles?isPublished=${isPublished}&skip=${currentSkip}&take=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const {
          articles,
          message,
          count,
        }: { articles: Article[]; message: string; count: number } =
          await res.json();

        if (articles) {
          setSkip(currentSkip);
          setCurrentPageNo(isNext ? currentPageNo + 1 : currentPageNo - 1);
          setTotalNoOfPages(Math.ceil(count / 10));
          setIsLoading(false);
          setArticles(articles);
        } else {
          console.error(message);
        }
      } else {
        const { message } = await res.json();
        alert(message);
      }
    }
    setIsLoading(false);
  };

  // Ftech in inside useEffect
  useEffect(() => {
    fetchArticles(true, skip, currentPageNo);
  }, [isPublished]);

  return (
    <>
      <main>
        <div className=" flex flex-col">
          <div className="flex flex-row items-center w-full justify-end">
            {/* Filter */}
            <div>
              {isUserLoading ? (
                "Loading Filter"
              ) : isError ? (
                <Warning />
              ) : data.user?.role === "ADMIN" ? (
                <Filter
                  isPublished={isPublished}
                  setIsPublished={setIsPublished}
                  setSkip={setSkip}
                  setCurrentPageNo={setCurrentPageNo}
                />
              ) : (
                ""
              )}
            </div>
            <div className="join">
              <button
                className="join-item btn-sm sm:btn"
                onClick={() => {
                  fetchArticles(false, skip, currentPageNo);
                }}
                disabled={currentPageNo === 1}
              >
                «
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (pageNo > 0) {
                    const skip = pageNo * 10;
                    const currentPageNo = pageNo + 1;
                    fetchArticles(false, skip, currentPageNo);
                  } else {
                    console.error("Page number must be greater than zero");
                  }
                }}
                className="px-3"
              >
                <label htmlFor="pageNumber" className="text-sm pr-1">
                  Page:
                </label>
                <input
                  type="number"
                  className="input input-sm sm:input max-w-[2.5rem] sm:max-w-[5rem] text-right"
                  name="pageNumber"
                  id="pageNumber"
                  value={pageNo}
                  onChange={(e) => pageNoController(parseInt(e.target.value))}
                />
                <span className="text-sm sm:text-base">/{totalNoOfPages}</span>
              </form>
              <button
                className="join-item btn-sm sm:btn"
                onClick={() => {
                  fetchArticles(true, skip, currentPageNo);
                }}
                disabled={currentPageNo === totalNoOfPages}
              >
                »
              </button>
            </div>
          </div>
          {/* Articles */}
          {isLoading ? (
            <Loading label="Fetching articles..." />
          ) : (
            <div>
              {articles.length === 0 ? (
                <div className="flex flex-row justify-center items-center w-full mt-10">
                  No Articles yet.
                </div>
              ) : (
                articles.map((article) => {
                  const blocks =
                    article.content === null
                      ? undefined
                      : article.content.blocks;
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
          )}
        </div>
      </main>
    </>
  );
}

export default Articles;
