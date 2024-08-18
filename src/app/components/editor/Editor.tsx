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
import { Article, Category, Subcategory } from "@/lib/models";
import { ArticleType } from "@prisma/client";
import ArticleDetails from "../ArticleDetails";
import { makeid } from "@/lib/utils-fe";
import useUser from "@/lib/useUser";
import AddNewCategoryDialog from "./AddNewCategoryDialog";
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
  const { data: userData } = useUser();
  const [currentArticleId, setCurrentArticleId] = useState<string>(
    currentArticle.id!
  );
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(false);
  const [isPublishBtnDisabled, setIsPublishBtnDisabled] = useState(
    currentArticle.isPublished
  );
  const [saveBtnStatus, setSaveBtnStatus] = useState("Save");
  const [publishBtnStatus, setPublishBtnStatus] = useState("Publish");

  const [categories, setCategories] = useState<Category[]>();
  const [subcategories, setSubcategories] = useState<Subcategory[]>();

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory>();

  const [newCategory, newCategoryController] = useState<string>("");
  const [newCategoryError, newCategoryErrorController] = useState<string>();

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

  /**
   * Call Publish Dialog
   */
  const openPublishDialog = async () => {
    // @ts-ignore
    document.getElementById("my_modal_3")?.showModal();
  };

  /**
   * Call Publish Dialog
   */
  const openAddNewCategoryDialog = async () => {
    // @ts-ignore
    document.getElementById("add-new-category-dialog")?.showModal();
  };
  //add a reference to editor
  const ref = useRef<EditorJS>();

  //initialize editorjs
  useEffect(() => {
    // Initialize Category
    const dummyCategories: Category[] = [
      {
        id: makeid(10),
        date: new Date(),
        label: "Departments",
        subcategory: [
          {
            id: makeid(10),
            date: new Date(),
            label: "Some Subcategory",
            author: userData.user!,
            userId: 1,
          },
        ],
        author: userData.user!,
        userId: 1,
      },
      {
        id: makeid(10),
        date: new Date(),
        label: "Events",
        subcategory: [],
        author: userData.user!,
        userId: 1,
      },
      {
        id: makeid(10),
        date: new Date(),
        label: "Announcements",
        subcategory: [],
        author: userData.user!,
        userId: 1,
      },
      {
        id: makeid(10),
        date: new Date(),
        label: "Timetables",
        subcategory: [],
        author: userData.user!,
        userId: 1,
      },
    ];

    setCategories(dummyCategories);
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
          <form className="grid grid-cols-3">
            {/* Select for Category */}
            <select
              name="category"
              id="category"
              className="select select-bordered mr-3"
              onChange={(e) => {
                const selectedCategoryLabel =
                  e.currentTarget.options[e.currentTarget.selectedIndex].value;
                const selectedCategory = categories?.filter(
                  (category) => category.label === selectedCategoryLabel
                )[0];
                setSelectedCategory(selectedCategory);
                setSubcategories(selectedCategory?.subcategory);
                if (selectedCategoryLabel === "addNew") {
                  openAddNewCategoryDialog();
                }
              }}
            >
              <option key={`category-default`} value="default">
                Select Category
              </option>
              {categories?.map((category) => (
                <option
                  key={`category-${category.id}`}
                  value={`${category.id}`}
                >
                  {category.label}
                </option>
              ))}
              <option
                // onTouchStart={() => openAddNewCategoryDialog()}
                key={`category-new`}
                value="addNew"
              >
                Add New
              </option>
            </select>

            {/* Select for SubCategory */}
            <select
              name="subCategory"
              id="SubCategory"
              className="select select-bordered mr-3"
              onChange={(e) => {
                const selectedSubcategoryId =
                  e.currentTarget.options[e.currentTarget.selectedIndex].value;
                const selectedSubcategory = subcategories?.filter(
                  (subcategory) => subcategory.id === selectedSubcategoryId
                )[0];
                setSelectedSubcategory(selectedSubcategory);
              }}
            >
              <option key={`subcategory-default`} value="-">
                Select Subcategory
              </option>
              {subcategories?.map((subcategory) => (
                <option
                  key={`subcategory-${subcategory.id}`}
                  value={`${subcategory.id}`}
                >
                  {subcategory.label}
                </option>
              ))}
              <option key={`subcategory-new`} value="addNew">
                Add New
              </option>
            </select>

            {/* Select for Article Type */}
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
            onClick={openPublishDialog}
            className="btn btn-success"
            disabled={isPublishBtnDisabled}
          >
            {publishBtnStatus}
          </button>
        </div>
        <div>
          <ArticleDetails
            username={currentArticle.author.username}
            publishedDate={currentArticle.date}
          />
          <div className="w-full" id={holder} />
        </div>
        <PublishDialog uploader={uploader} />
        <AddNewCategoryDialog
          value={newCategory}
          controller={newCategoryController}
          error={newCategoryError}
          errorController={newCategoryErrorController}
        />
      </div>
    </>
  );
};

export default memo(EditorBlock);
