"use client";

import Loading from "@/app/components/Loading";
import { Article } from "@/lib/models";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function NewEditor() {
  const { data, isLoading, isError } = useUser();
  const { push } = useRouter();
  const [articleId, setArticleId] = useState<string>();
  const [label, setLabel] = useState<string>("Creating a new article");

  useEffect(() => {
    // Create a new article without any data in block field
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

  return isLoading ? (
    <Loading label="Checking login sessions..." />
  ) : isError ? (
    "There was an error connecting to the server"
  ) : data.user?.verified ? (
    articleId ? (
      push(`/editor/new/${articleId}`)
    ) : (
      <Loading label={label} />
    )
  ) : (
    push("/users/auth/pleaseVerify")
  );
}

export default NewEditor;
