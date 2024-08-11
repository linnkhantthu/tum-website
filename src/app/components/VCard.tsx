import React from "react";

function VCard({
  image,
  title,
  content,
  authorName,
  date,
}: {
  image: any;
  title: string;
  content: string;
  authorName: string;
  date: string;
}) {
  return (
    <div className="card card-bordered bg-base-100 w-96 shadow-xl h-96 mr-1 mb-1">
      <figure className="min-h-[50%] max-h-[50%]">
        {image ? (
          <img src={image.data.file.url} alt={image.data.caption} />
        ) : (
          <img src="/tum-logo.png" alt="image" />
        )}
      </figure>
      <div className="card-body h-1/2 pt-3">
        <h2 className="card-title overflow-ellipsis">
          {title}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p className="truncate hover:text-clip">
          {content.replaceAll("&nbsp;", "")}
        </p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">{authorName}</div>
          <div className="badge badge-outline">{date}</div>
        </div>
      </div>
    </div>
  );
}

export default VCard;
