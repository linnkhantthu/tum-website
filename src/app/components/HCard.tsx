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
  articleId: number;
}) {
  console.log(`ID: ${articleId}: `, image);
  return (
    <div className="flex flex-row justify-center items-center w-full">
      <div className="card card-side bg-base-100 shadow-xl mx-4 mt-3 w-4/5">
        <figure className="w-1/4">
          {image ? (
            <img src={image.data.file.url} alt={image.data.caption} />
          ) : (
            <img src="/tum-logo.png" alt="image" />
          )}
        </figure>
        <div className="card-body w-4/5">
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
