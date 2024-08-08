"use client";

import Loading from "@/app/components/Loading";
import { Article } from "@/lib/models";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function NewEditor() {
  const { push } = useRouter();
  const [articleId, setArticleId] = useState<string>();
  const [label, setLabel] = useState<string>("Creating a new article");

  useEffect(() => {
    fetch("/api/articles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((res) =>
      res
        .json()
        .then(({ article, message }: { article: Article; message: string }) => {
          if (article) {
            setArticleId(article.id);
          }
          setLabel(message);
        })
    );
  }, []);

  return articleId ? (
    push(`/editor/new/${articleId}`)
  ) : (
    <Loading label={label} />
  );
}

export default NewEditor;
