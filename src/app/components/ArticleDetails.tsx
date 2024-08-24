import React from "react";

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
      <div className="xl:absolute mt-3 border-l-[8px] xl:border-r-[8px] xl:border-l-[0px] border-success p-1">
        <div className="pr-3">@{username}</div>
        <div>{new Date(publishedDate!).toDateString()}</div>
        <div>{categoryName}</div>
        <div>{subcategoryName}</div>
      </div>
    </div>
  );
}

export default ArticleDetails;
