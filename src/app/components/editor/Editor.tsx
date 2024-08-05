"use client";

//./components/Editor
import React, { memo, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./tools";

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
  const upload = async () => {
    const res = await fetch("/api/editor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
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
        <button onClick={upload} className="btn btn-primary">
          Upload
        </button>
      </div>
      <div className="flex flex-row">
        <div className="w-full" id={holder} />
      </div>
    </div>
  );
};

export default memo(EditorBlock);
