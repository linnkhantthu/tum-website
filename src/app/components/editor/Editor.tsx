"use client";

//./components/Editor
import React, { memo, useEffect, useRef, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./tools";
import Dialog from "./Dialog";
import { Article } from "@/lib/models";
import useUser from "@/lib/useUser";
import Loading from "../Loading";
import { useRouter } from "next/navigation";

//props
type Props = {
  data?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
  articleId: string;
};

const EditorBlock = ({ data, onChange, holder, articleId }: Props) => {
  const { data: userData, isLoading, isError } = useUser();
  const { push } = useRouter();

  const [currentArticleId, setCurrentArticleId] = useState<string>(articleId);
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(false);
  const [isPublishBtnDisabled, setIsPublishBtnDisabled] = useState(false);
  const [saveBtnStatus, setSaveBtnStatus] = useState("Save");
  const [publishBtnStatus, setPublishBtnStatus] = useState("Publish");

  /**
   * Upload
   */
  const uploader = async (isPublished = false, isSave: boolean) => {
    // Setting Status
    setSaveBtnStatus(isSave ? "Saving..." : "Save");
    setPublishBtnStatus(!isSave ? "Publishing" : "Publish");

    // Send and fetch data
    const res = await fetch("/api/articles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: data,
        isPublished: isPublished,
        articleId: currentArticleId,
      }),
    });
    if (res.ok) {
      const { article, message }: { article: Article; message: string } =
        await res.json();

      // onChange(article.content);
      setCurrentArticleId(article.id!);
      // Set Status
      console.log(isSave);
      setSaveBtnStatus(isSave ? "Saved" : "Save");
      setIsSaveBtnDisabled(isSave);
      setPublishBtnStatus(article.isPublished ? "Published" : "Publish");
      setIsPublishBtnDisabled(article.isPublished);
      return true;
    }
    return false;
  };

  const publish = async () => {
    // @ts-ignore
    document.getElementById("my_modal_3")?.showModal();
  };

  //add a reference to editor
  const ref = useRef<EditorJS>();

  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        // @ts-ignore
        tools: EDITOR_TOOLS,
        autofocus: true,
        data,
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
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

  useEffect(() => {
    setSaveBtnStatus("Save");
    setIsSaveBtnDisabled(false);
  }, [data]);

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
              onClick={() => uploader(isPublishBtnDisabled, true)}
              className="btn btn-primary mr-3"
              disabled={isSaveBtnDisabled}
            >
              {saveBtnStatus}
            </button>
            <button
              onClick={publish}
              className="btn btn-success"
              disabled={isPublishBtnDisabled}
            >
              {publishBtnStatus}
            </button>
          </div>
          <div className="flex flex-row">
            <div className="w-full" id={holder} />
          </div>
          <Dialog uploader={uploader} />
        </div>
      ) : (
        push("/")
      )}
    </>
  );
};

export default memo(EditorBlock);
