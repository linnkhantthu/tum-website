"use client";

//./components/Editor
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./tools";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import PublishDialog from "./PublishDialog";
import DeleteDialog from "../DeleteDialog";

//props
type Props = {
  data?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
  articleId: string;
};

const EditorBlock = ({ data, onChange, holder, articleId }: Props) => {
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
      body: JSON.stringify({ articleId: articleId }),
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
    <>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        "An Error occurred."
      ) : userData.user?.role === "ADMIN" ? (
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-end">
            <button
              onClick={() => push(`/editor/new/${articleId}`)}
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
      <div className="w-full" id={holder} />
    </>
  );
};

export default memo(EditorBlock);
