"use client";

//./components/Editor
import React, {
  Dispatch,
  FormEvent,
  memo,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import { EDITOR_TOOLS } from "./tools";
import PublishDialog from "./PublishDialog";
import { Article, Category, FlashMessage, Subcategory } from "@/lib/models";
import { ArticleType } from "@prisma/client";
import ArticleDetails from "../ArticleDetails";
import useUser from "@/lib/useUser";
import CategoryDialog from "./CategoryDialog";
import SubcategoryDialog from "./SubcategoryDialog";
//props
type Props = {
  // Editor
  data: OutputData; // To store editor data
  onChange(val: OutputData): void; // Editor data controller
  holder: string; // Editor ID

  // Article Data
  currentArticle: Article; // Current article
  setCurrentArticle: Dispatch<SetStateAction<Article | undefined>>; // Controller for current controller

  // Toasts
  toasts: FlashMessage[]; // Toasts []
  setToasts: Dispatch<React.SetStateAction<FlashMessage[]>>; // Toasts Controller

  // Categories
  categories: Category[]; // Categories
  setCategories: Dispatch<SetStateAction<Category[]>>; // Categories controller
  subcategories: Subcategory[]; // Subcategories
  setSubcategories: Dispatch<SetStateAction<Subcategory[]>>; // Subcategories controller

  //Category form controllers
  newCategory: string; // New Category
  newCategorycontroller: Dispatch<React.SetStateAction<string>>; // New Category controller
  newCategoryError: string | undefined; // New Category error
  newCategoryErrorController: Dispatch<
    React.SetStateAction<string | undefined>
  >; // // New Category error controller

  // Subcategory form controllers
  newSubcategory: string; // New subcategory
  newSubcategorycontroller: Dispatch<React.SetStateAction<string>>; // New subcategory controller
  newSubcategoryError: string | undefined; // New subcategory error
  newSubcategoryErrorController: Dispatch<
    React.SetStateAction<string | undefined>
  >; // New subcategory error controller

  // Handlers
  handleCategorySubmit: (e: FormEvent) => Promise<void>;
  handlesubcategorySubmit: (e: FormEvent) => Promise<void>;

  // States for Categories and Subcategories
  selectedCategory: Category | undefined;
  setSelectedCategory: Dispatch<SetStateAction<Category | undefined>>;
  selectedSubcategory: Subcategory | undefined;
  setSelectedSubcategory: Dispatch<SetStateAction<Subcategory | undefined>>;
};

const EditorBlock = ({
  data,
  currentArticle,
  setCurrentArticle,
  holder,
  onChange,
  categories,
  subcategories,
  setSubcategories,
  newCategory,
  newCategorycontroller,
  newCategoryError,
  newCategoryErrorController,
  handleCategorySubmit,
  handlesubcategorySubmit,
  newSubcategory,
  newSubcategorycontroller,
  newSubcategoryError,
  newSubcategoryErrorController,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
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
  const articleUploader = async (isSave: boolean) => {
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
   * Call Category Dialog
   */
  const openCategoryDialog = async () => {
    // @ts-ignore
    document.getElementById("category_dialog")?.showModal();
  };
  /**
   * Call Category Dialog
   */
  const openSubcategoryDialog = async () => {
    // @ts-ignore
    document.getElementById("subcategory_dialog")?.showModal();
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
          <form className="grid grid-cols-3">
            {/* Select for Category */}
            <select
              defaultValue={"default"}
              name="category"
              id="category_select"
              className="select select-bordered mr-3"
              onChange={(e) => {
                const selectedCategoryId =
                  e.currentTarget.options[e.currentTarget.selectedIndex].value;

                const selectedCategory = categories?.filter(
                  (category) => category.id === selectedCategoryId
                )[0];
                setSelectedCategory(selectedCategory);
                setSubcategories(selectedCategory?.subcategory || []);

                // Reset Subcategory Element
                const element = document.getElementById("subcategory_select");
                // @ts-ignore
                element!.value = "default";
                if (selectedCategoryId === "addNew") {
                  openCategoryDialog();
                  // Reset the select option
                  e.currentTarget.selectedIndex = 0;
                }
              }}
            >
              <option key={`category-default`} value="default" disabled>
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
              <option key={`category-new`} value="addNew">
                Add New
              </option>
            </select>

            {/* Select for SubCategory */}
            <select
              defaultValue={"default"}
              name="subCategory"
              id="subcategory_select"
              className="select select-bordered mr-3"
              onChange={(e) => {
                const selectedSubcategoryId =
                  e.currentTarget.options[e.currentTarget.selectedIndex].value;
                const selectedSubcategory = subcategories?.filter(
                  (subcategory) => subcategory.id === selectedSubcategoryId
                )[0];
                setSelectedSubcategory(selectedSubcategory);
                if (selectedSubcategoryId === "addNew") {
                  openSubcategoryDialog();
                  // Reset the select option
                  e.currentTarget.selectedIndex = 0;
                }
              }}
            >
              <option key={`subcategory-default`} value="default" disabled>
                Select Subcategory
              </option>
              {subcategories
                ? subcategories?.map((subcategory) => (
                    <option
                      key={`subcategory-${subcategory.id}`}
                      value={`${subcategory.id}`}
                    >
                      {subcategory.label}
                    </option>
                  ))
                : ""}
              <option key={`subcategory-new`} value="addNew">
                Add New
              </option>
            </select>

            {/* Select for Article Type */}
            <select
              defaultValue={currentArticle.type}
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
                // selected={currentArticle.type === "PRIVATE"}
              >
                Private
              </option>
              <option
                value="PUBLIC"
                // selected={currentArticle.type === "PUBLIC"}
              >
                Public
              </option>
            </select>
          </form>
          <button
            onClick={() => articleUploader(true)}
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
        <PublishDialog uploader={articleUploader} />
        <CategoryDialog
          value={newCategory}
          controller={newCategorycontroller}
          error={newCategoryError}
          errorController={newCategoryErrorController}
          handleSubmit={handleCategorySubmit}
        />
        <SubcategoryDialog
          value={newSubcategory}
          controller={newSubcategorycontroller}
          error={newSubcategoryError}
          errorController={newSubcategoryErrorController}
          handleSubmit={handlesubcategorySubmit}
        />
      </div>
    </>
  );
};

export default memo(EditorBlock);
