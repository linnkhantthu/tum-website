import React from "react";

function ArticleDetails({
  username,
  publishedDate,
}: {
  username: string;
  publishedDate: Date;
}) {
  return (
    <div className="lg:px-[7rem] xl:px-[14rem] 2xl:px-[20rem] px-0">
      <span className="pr-3">@{username}</span>
      <span>{new Date(publishedDate!).toDateString()}</span>
    </div>
  );
}

export default ArticleDetails;
