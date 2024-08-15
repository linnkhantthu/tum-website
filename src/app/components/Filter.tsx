import { Article } from "@/lib/models";
import React, { useState } from "react";
import { FaCheck, FaFilter } from "react-icons/fa";

function Filter({
  setArticles,
  isPublished,
  setIsPublished,
}: {
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  isPublished: boolean;
  setIsPublished: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isHidden, setIsHidden] = useState(false);

  const fetchData = async (isPublished: boolean) => {
    const url = `/api/articles?isPublished=${isPublished}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { articles, message }: { articles: Article[]; message: string } =
      await res.json();
    if (articles.length !== 0) {
      setArticles(articles);
      setIsPublished(articles[0].isPublished);
      setIsHidden(true);
    }
    return true;
  };
  return (
    <div
      className="flex flex-row justify-end"
      onClick={() => setIsHidden(false)}
    >
      <div className="mt-3">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm m-1">
            <FaFilter />
          </div>
          <ul
            tabIndex={0}
            className={
              isHidden
                ? "hidden"
                : "dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow"
            }
          >
            <li className={isPublished ? "" : "bg-base-100"}>
              <a onClick={() => fetchData(!isPublished)}>
                Drafts
                {isPublished ? "" : <FaCheck className="text-right" />}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Filter;
