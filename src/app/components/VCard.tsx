import Image from "next/image";
import Link from "next/link";
import React from "react";

function VCard({
  image,
  title,
  content,
  authorName,
  date,
  articleId,
}: {
  image: any;
  title: string;
  content: string;
  authorName: string;
  date: string;
  articleId: string;
}) {
  return (
    <div className="card card-bordered bg-base-200 shadow-xl h-96 ring-1 ring-neutral">
      {/* Image */}
      <figure className="min-h-[50%] max-h-[50%] border-b-[0.5px] border-neutral">
        {image ? (
          <Image
            src={image.data.file.url}
            alt={image.data.caption}
            width={500}
            height={500}
          />
        ) : (
          <Image src="/tum-logo.png" alt="image" width={500} height={500} />
        )}
      </figure>

      {/* Card Body */}
      <div className="card-body min-h-[50%] max-h-[50%] pt-3">
        {/* Card Title */}
        <h2 className="card-title text-sm lg:text-base h-[30%] overflow-ellipsis">
          <Link
            href={`/articles/${articleId}`}
            className="link link-success link-hover"
          >
            {title}
          </Link>
          <div className="badge badge-secondary">NEW</div>
        </h2>

        {/* Card Content */}
        <div className="line-clamp-3 text-sm lg:text-base h-[55%] text-justify">
          {content.replaceAll("&nbsp;", "")}
        </div>

        {/* Card Actions */}
        <div className="card-actions h-[15%] justify-end">
          <div className="badge badge-outline badge-sm lg:badge-md">
            {authorName}
          </div>
          <div className="badge badge-outline badge-sm lg:badge-md">{date}</div>
        </div>
      </div>
    </div>
  );
}

export default VCard;
