"use client";

//./components/Editor
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./tools";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";
import Loading from "../Loading";

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

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        "An Error occurred."
      ) : userData.isLoggedIn ? (
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-row justify-end m-3">
            <button
              onClick={() => push(`/editor/new/${articleId}`)}
              className="btn btn-primary mr-3"
              // disabled={isSaveBtnDisabled}
            >
              Edit
            </button>
            <button
              // onClick={publish}
              className="btn btn-success"
              // disabled={isPublishBtnDisabled}
            >
              Delete
            </button>
          </div>

          {/* <Dialog uploader={uploader} /> */}
        </div>
      ) : (
        push("/")
      )}
      <div className="w-full" id={holder} />
    </>
  );
};

export default memo(EditorBlock);
