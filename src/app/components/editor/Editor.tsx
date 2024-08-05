"use client";

//./components/Editor
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./tools";
import Dialog from "./Dialog";
import { Article } from "@/lib/models";

//props
type Props = {
  data?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
};

const EditorBlock = ({ data, onChange, holder }: Props) => {
  /**
   * Upload
   */
  const uploader = async () => {
    const res = await fetch("/api/articles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { article, message }: { article: Article; message: string } =
        await res.json();
      onChange(article.content);
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

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-row justify-end m-3">
        <button onClick={publish} className="btn btn-primary">
          Publish
        </button>
      </div>
      <div className="flex flex-row">
        <div className="w-full" id={holder} />
      </div>
      <Dialog uploader={uploader} />
    </div>
  );
};

export default memo(EditorBlock);
