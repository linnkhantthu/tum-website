"use client";

import Loading from "@/app/components/Loading";
import { Article, FlashMessage } from "@/lib/models";
import useUser from "@/lib/useUser";
import { makeid } from "@/lib/utils-fe";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function NewEditor() {
  const { data, isLoading, isError, mutateUser } = useUser();
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
          const toast: FlashMessage = {
            id: makeid(10),
            message: message,
            category: "alert-error",
          };
          localStorage.setItem("toasts", JSON.stringify([toast]));
          if (localStorage.getItem("toasts")) {
            // console.log(localStorage.getItem("toasts"));
          }
        })
    );
  }, []);

  return isLoading ? (
    <Loading label="Checking login sessions..." />
  ) : isError ? (
    "There was an error connecting to the server"
  ) : data.isLoggedIn ? (
    data.user?.verified ? (
      data.user.role === "ADMIN" ? (
        articleId ? (
          push(`/editor/new/${articleId}`)
        ) : (
          <Loading label={label} />
        )
      ) : (
        push("/")
      )
    ) : (
      push("/users/auth/pleaseVerify")
    )
  ) : (
    push("/users/auth")
  );
}

export default NewEditor;
