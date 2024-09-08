import { Article } from "@/lib/models";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function HCard({
  image,
  title,
  content,
  slug,
  article,
}: {
  image: any;
  title: string;
  content: string;
  slug: string;
  article: Article;
}) {
  return (
    <div className="flex flex-row justify-center items-center w-full">
      <div className="card card-side card-bordered bg-base-100 shadow-xl w-full h-[13rem]">
        <div className="flex flex-col min-w-[33%] max-w-[33%] justify-center border border-y-0 border-l-0 border-base-300 sm:min-w-[20%] sm:max-w-[20%]">
          <figure>
            {image ? (
              <Image
                className="mask mask-squircle"
                src={image.data.file.url}
                alt={image.data.caption}
                width={150}
                height={150}
              />
            ) : (
              <Image
                className="mask mask-square"
                src="/tum-logo.png"
                alt="image"
                width={150}
                height={150}
              />
            )}
          </figure>
        </div>
        <div className="card-body min-w-[67%] max-w-[67%] sm:min-w-[80%] sm:max-w-[80%] pr-3">
          <Link
            href={`/articles/${article.id}/${slug}`}
            className="link link-success link-hover"
          >
            <h2 className="card-title text-sm sm:text-lg">{title}</h2>
          </Link>
          <div className="line-clamp-3 text-justify text-sm sm:text-base">
            {content.replaceAll("&nbsp;", "")}
          </div>
          <div className="card-actions">
            <div className="card-actions justify-start w-full">
              <div className="badge badge-outline">
                {article.author.username}
              </div>
              <div className="badge badge-outline">
                {article.Subcategory?.label ||
                  article.category?.label ||
                  "No Category"}
              </div>
              <div className="badge badge-outline text-xs sm:text-sm">
                {new Date(article.date).toDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HCard;
