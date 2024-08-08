import { Article } from "@/lib/models";
import React, { useState } from "react";
import { FaCheck, FaFilter } from "react-icons/fa";

function Filter({
  setArticles,
  isDraft,
  setIsDraft,
}: {
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  isDraft: boolean;
  setIsDraft: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isHidden, setIsHidden] = useState(false);

  const fetchData = async (isDraft: boolean) => {
    const url = `/api/articles?isPublished=${!isDraft}`;

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
      setIsDraft(true);
      setIsHidden(true);
    }
    return true;
  };
  return (
    <div
      className="flex flex-row justify-center"
      onClick={() => setIsHidden(false)}
    >
      <div className="mx-4 mt-3 w-4/5 text-right">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1">
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
            <li className={isDraft ? "bg-base-100" : ""}>
              <a onClick={() => fetchData(!isDraft)}>
                Drafts
                {isDraft ? <FaCheck className="text-right" /> : ""}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Filter;
