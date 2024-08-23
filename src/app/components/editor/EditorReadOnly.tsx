"use client";

//./components/Editor
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./tools";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import DeleteDialog from "../DeleteDialog";
import { Article, User } from "@/lib/models";
import ArticleDetails from "../ArticleDetails";

//props
type Props = {
  data?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
  articleId: string;
  currentAuthor: User;
  publishedDate: Date | undefined;
  currentArticle: Article | undefined;
};

const EditorBlock = ({ data, holder, currentArticle }: Props) => {
  //add a reference to editor
  const ref = useRef<EditorJS>();
  const { data: userData, isLoading, isError } = useUser();
  const { push } = useRouter();

  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        // @ts-ignore
        tools: EDITOR_TOOLS,
        readOnly: true,
        data,
      });
      ref.current = editor;
    }

    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);

  const callDialog = () => {
    // @ts-ignore
    document.getElementById("my_modal_3")?.showModal();
  };

  const deleteArticle = async () => {
    const res = await fetch("/api/articles/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articleId: currentArticle?.id }),
    });
    const { success, message }: { success: boolean; message: string } =
      await res.json();
    if (res.ok && success) {
      push("/articles");
    } else {
      alert(message);
    }
  };
  return (
    <div className="flex flex-col">
      {isLoading ? (
        <Loading />
      ) : isError ? (
        "An Error occurred."
      ) : userData.user?.role === "ADMIN" &&
        userData.user.id === currentArticle?.author.id ? (
        <div className="flex flex-col h-full w-full">
          <div className="lg:px-[7rem] xl:px-[14rem] 2xl:px-[20rem] px-0 flex flex-row justify-end m-3 w-full lg:w-auto">
            <button
              onClick={() => push(`/editor/new/${currentArticle.id}`)}
              className="btn btn-primary mr-3"
            >
              Edit
            </button>
            <button onClick={callDialog} className="btn btn-error">
              Delete
            </button>
          </div>

          <DeleteDialog uploader={deleteArticle} />
        </div>
      ) : (
        ""
      )}
      <ArticleDetails
        username={currentArticle?.author.username!}
        publishedDate={currentArticle?.date!}
        categoryName={currentArticle?.category?.label!}
        subcategoryName={currentArticle?.Subcategory?.label!}
      />
      <div className="pointer-events-none text-justify" id={holder} />
    </div>
  );
};

export default memo(EditorBlock);
