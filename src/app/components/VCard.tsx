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
    <div className="card card-bordered bg-base-100 w-[100%] sm:w-[49%] shadow-xl h-96 mr-1 mb-1">
      <figure className="min-h-[50%] max-h-[50%]">
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
      <div className="card-body h-1/2 pt-3">
        <h2 className="card-title overflow-ellipsis">
          <Link
            href={`/articles/${articleId}`}
            className="link link-success link-hover"
          >
            {title}
          </Link>
          <div className="badge badge-secondary">NEW</div>
        </h2>

        <div className="line-clamp-3 text-justify text-sm sm:text-base">
          {content.replaceAll("&nbsp;", "")}
        </div>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">{authorName}</div>
          <div className="badge badge-outline">{date}</div>
        </div>
      </div>
    </div>
  );
}

export default VCard;
