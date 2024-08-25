import React from "react";
import { MdCategory, MdDateRange, MdPerson } from "react-icons/md";

function ArticleDetails({
  username,
  publishedDate,
  categoryName,
  subcategoryName,
}: {
  username: string;
  publishedDate: Date;
  categoryName: string;
  subcategoryName: string;
}) {
  return (
    <div className="flex flex-row xl:justify-end">
      <div className="xl:absolute border-l-[8px] xl:border-r-[8px] xl:border-l-[0px] border-success p-1 bg-neutral">
        <div className="flex flex-row items-center">
          <MdPerson className="mx-1" />
          {username}
        </div>
        <div className="flex flex-row items-center">
          <MdDateRange className="mx-1" />
          {new Date(publishedDate!).toDateString()}
        </div>
        <div className="flex flex-row items-center">
          <MdCategory className="mx-1" />
          {categoryName}
        </div>
        <div className="flex flex-row items-center">
          <MdCategory className="mx-1" />
          {subcategoryName}
        </div>
      </div>
    </div>
  );
}

export default ArticleDetails;
