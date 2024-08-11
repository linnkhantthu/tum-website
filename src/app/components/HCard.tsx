import React from "react";

function HCard({
  image,
  title,
  content,
  articleId,
}: {
  image: any;
  title: string;
  content: string;
  articleId: string;
}) {
  return (
    <div className="flex flex-row justify-center items-center w-full">
      <div className="card card-side card-bordered bg-base-100 shadow-xl mt-3 w-full">
        <div className="flex flex-col min-w-[33%] max-w-[33%] justify-center border border-y-0 border-l-0 border-base-300">
          <figure>
            {image ? (
              <img src={image.data.file.url} alt={image.data.caption} />
            ) : (
              <img src="/tum-logo.png" alt="image" />
            )}
          </figure>
        </div>
        <div className="card-body min-w-[67%] max-w-[67%]">
          <h2 className="card-title">{title}</h2>
          <p className="text-ellipsis truncate hover:text-clip">
            {content.replaceAll("&nbsp;", "")}
          </p>
          <div className="card-actions justify-end">
            <a href={`/articles/${articleId}`} className="btn btn-primary">
              Read more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HCard;
