"use client";

//./components/Editor
import React, {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./tools";
import PublishDialog from "./PublishDialog";
import { Article } from "@/lib/models";
import { ArticleType } from "@prisma/client";
//props
type Props = {
  data: OutputData;
  currentArticle: Article;
  setCurrentArticle: Dispatch<SetStateAction<Article | undefined>>;
  holder: string;
  onChange(val: OutputData): void;
};

const EditorBlock = ({
  data,
  currentArticle,
  setCurrentArticle,
  holder,
  onChange,
}: Props) => {
  const [currentArticleId, setCurrentArticleId] = useState<string>(
    currentArticle.id!
  );
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(false);
  const [isPublishBtnDisabled, setIsPublishBtnDisabled] = useState(
    currentArticle.isPublished
  );
  const [saveBtnStatus, setSaveBtnStatus] = useState("Save");
  const [publishBtnStatus, setPublishBtnStatus] = useState("Publish");

  useEffect(() => {
    setSaveBtnStatus("Save");
    setIsSaveBtnDisabled(false);
  }, [data]);

  /**
   * Upload
   */
  const uploader = async (isSave: boolean) => {
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
        isPublished: !isSave,
        articleId: currentArticleId,
        articleType: currentArticle.type,
      }),
    });
    if (res.ok) {
      const { article, message }: { article: Article; message: string } =
        await res.json();

      // onChange(article.content);
      // setCurrentArticle(article);
      // Set Status
      setSaveBtnStatus(isSave ? "Saved" : "Save");
      setIsSaveBtnDisabled(isSave);
      setPublishBtnStatus(article.isPublished ? "Published" : "Publish");
      setIsPublishBtnDisabled(article.isPublished);
      return true;
    }
    return false;
  };

  const callDialog = async () => {
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
    <>
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-row justify-end m-3">
          <form>
            <select
              onChange={(e) => {
                currentArticle.type = e.currentTarget.options[
                  e.currentTarget.selectedIndex
                ].value as ArticleType;
                setCurrentArticle(currentArticle);
              }}
              className="select select-bordered mr-3"
              name="articleType"
              id="articleType"
            >
              <option
                value="PRIVATE"
                selected={currentArticle.type === "PRIVATE"}
              >
                Private
              </option>
              <option
                value="PUBLIC"
                selected={currentArticle.type === "PUBLIC"}
              >
                Public
              </option>
            </select>
          </form>
          <button
            onClick={() => uploader(true)}
            className="btn btn-primary mr-3"
            disabled={isSaveBtnDisabled}
          >
            {saveBtnStatus}
          </button>
          <button
            onClick={callDialog}
            className="btn btn-success"
            disabled={isPublishBtnDisabled}
          >
            {publishBtnStatus}
          </button>
        </div>
        <div className="flex flex-row">
          <div className="w-full" id={holder} />
        </div>
        <PublishDialog uploader={uploader} />
      </div>
    </>
  );
};

export default memo(EditorBlock);
