import Image from "next/image";
import Link from "next/link";
import React from "react";

function VCard({
  image,
  title,
  slug,
  content,
  authorName,
  date,
  articleId,
  isSkeleton,
}: {
  image: any;
  title: string;
  slug: string;
  content: string;
  authorName: string;
  date: string;
  articleId: string;
  isSkeleton: boolean;
}) {
  return (
    <div
      className={
        `card card-bordered bg-base-200 shadow-xl h-96 ring-1 ring-neutral ` +
        (isSkeleton ? `` : ``)
      }
    >
      {/* Image */}
      <figure className="min-h-[50%] max-h-[50%] border-b-[0.5px] border-neutral">
        {isSkeleton ? (
          <div className="skeleton w-[500px] h-[500px]"></div>
        ) : image ? (
          <Image
            className="mask mask-squircle"
            src={image.data.file.url}
            alt={image.data.caption}
            width={150}
            height={150}
          />
        ) : (
          <Image
            className="mask mask-squircle"
            src="/tum-logo.png"
            alt="image"
            width={150}
            height={150}
          />
        )}
      </figure>

      {/* Card Body */}
      <div className="card-body min-h-[50%] max-h-[50%] pt-3">
        {/* Card Title */}
        <h2
          className={`card-title text-sm lg:text-base h-[30%] overflow-ellipsis `}
        >
          <Link
            href={`/articles/${articleId}/${slug}`}
            className={
              isSkeleton
                ? `skeleton w-full h-3`
                : `link link-success link-hover`
            }
          >
            {title}
          </Link>
          <div
            className={
              isSkeleton ? `skeleton w-[20%] h-3` : `badge badge-secondary`
            }
          >
            {isSkeleton ? "" : "NEW"}
          </div>
        </h2>

        {/* Card Content */}
        <div
          className={
            `line-clamp-3 text-sm lg:text-base h-[55%] text-justify ` +
            (isSkeleton ? `skeleton` : ``)
          }
        >
          {content.replaceAll("&nbsp;", "")}
        </div>

        {/* Card Actions */}
        <div className="card-actions h-[15%] justify-end">
          <div
            className={
              isSkeleton
                ? "badge w-[20%] skeleton"
                : "badge badge-outline badge-sm lg:badge-md"
            }
          >
            {authorName}
          </div>
          <div
            className={
              isSkeleton
                ? "badge w-[20%] skeleton"
                : "badge badge-outline badge-sm lg:badge-md"
            }
          >
            {date}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VCard;
