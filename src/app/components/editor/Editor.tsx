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
import PublishDialog from "../dialogs/PublishDialog";
import { Article, Category, FlashMessage, Subcategory } from "@/lib/models";
import { ArticleType } from "@prisma/client";
import ArticleDetails from "../ArticleDetails";
import CategoryDialog from "../dialogs/CategoryDialog";
import SubcategoryDialog from "../dialogs/SubcategoryDialog";
import CategoryDropdown from "./CategoryDropdown";
import { MdCategory, MdOutlineCategory } from "react-icons/md";
import SubcategoryDropdown from "./SubcategoryDropdown";
import Loading from "../Loading";
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
  isSpecial: boolean;
  isSpecialController: Dispatch<SetStateAction<boolean>>;

  // Handlers
  handleCategorySubmit: (e: FormEvent) => Promise<void>;
  handlesubcategorySubmit: (e: FormEvent) => Promise<void>;

  // States for Categories and Subcategories
  selectedCategory: Category | undefined;
  setSelectedCategory: Dispatch<SetStateAction<Category | undefined>>;
  selectedSubcategory: Subcategory | undefined;
  setSelectedSubcategory: Dispatch<SetStateAction<Subcategory | undefined>>;
  deleteCategory: (categoryId: string) => Promise<void>;
  deleteSubcategory: (subcategoryId: string) => Promise<void>;

  handleUpdateCategorySubmit: (
    e: FormEvent,
    categoryId: string
  ) => Promise<void>;
  selectedToUpdateCategory: Category | undefined;
  setSelectedToUpdateCategory: Dispatch<SetStateAction<Category | undefined>>;

  handleUpdateSubcategorySubmit: (
    e: FormEvent,
    subcategoryId: string
  ) => Promise<void>;
  selectedToUpdateSubcategory: Subcategory | undefined;
  setSelectedToUpdateSubcategory: Dispatch<
    SetStateAction<Subcategory | undefined>
  >;
  selectedNewCategory: Category | undefined;
  setSelectedNewCategory: React.Dispatch<
    React.SetStateAction<Category | undefined>
  >;
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
  isSpecial,
  isSpecialController,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  deleteCategory,
  deleteSubcategory,
  handleUpdateCategorySubmit,
  selectedToUpdateCategory,
  setSelectedToUpdateCategory,
  handleUpdateSubcategorySubmit,
  selectedToUpdateSubcategory,
  setSelectedToUpdateSubcategory,
  selectedNewCategory,
  setSelectedNewCategory,
}: Props) => {
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(false);
  const [isPublishBtnDisabled, setIsPublishBtnDisabled] = useState(
    currentArticle.isPublished
  );
  const [saveBtnStatus, setSaveBtnStatus] = useState("Save");
  const [publishBtnStatus, setPublishBtnStatus] = useState("Save & Publish");

  useEffect(() => {
    console.log("Called");
    setSaveBtnStatus("Save");
    setIsSaveBtnDisabled(false);
  }, [data, selectedCategory, selectedSubcategory]);

  /**
   * Upload
   */
  const articleUploader = async (isSave: boolean) => {
    // Setting Status
    setSaveBtnStatus(isSave ? "Saving" : "Save");
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
        articleId: currentArticle.id,
        articleType: currentArticle.type,
        selectedCategory: selectedCategory,
        selectedSubcategory: selectedSubcategory,
      }),
    });
    if (res.ok) {
      const { article, message }: { article: Article; message: string } =
        await res.json();

      // onChange(article.content);
      // setCurrentArticle(article);
      // Set Status
      setSaveBtnStatus("Saved");
      setIsSaveBtnDisabled(true);
      setPublishBtnStatus(article.isPublished ? "Published" : "Save & Publish");
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
        <div className="lg:px-[7rem] xl:px-[14rem] 2xl:px-[20rem] px-0 flex flex-row justify-center lg:justify-start m-3 w-full lg:w-auto">
          <div className=" grid-cols-2 grid lg:grid-cols-2 items-center w-full">
            {/* Dropdown for Category */}
            <div className="pr-1 bg-base-200 border border-base-300">
              <CategoryDropdown
                Icon={MdCategory}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSelectedSubcategory={setSelectedSubcategory}
                categories={categories}
                setSubcategories={setSubcategories}
                deleteCategory={deleteCategory}
                isSpecialController={isSpecialController}
                controller={newCategorycontroller}
                setSelectedToUpdateCategory={setSelectedToUpdateCategory}
              />
            </div>
            {/* Dropdown for Category */}
            <div className="pr-1 bg-base-200 border border-base-300">
              <SubcategoryDropdown
                Icon={MdOutlineCategory}
                selectedSubcategory={selectedSubcategory}
                setSelectedSubcategory={setSelectedSubcategory}
                setSubcategories={setSubcategories}
                subcategories={subcategories}
                deleteSubcategory={deleteSubcategory}
                selectedCategory={selectedCategory}
                controller={newSubcategorycontroller}
                setSelectedToUpdateSubcategory={setSelectedToUpdateSubcategory}
                selectedNewCategory={selectedNewCategory}
                setSelectedNewCategory={setSelectedNewCategory}
              />
            </div>

            {/* Select for Article Type */}
            <div>
              <label htmlFor="articleType_select" className="label text-xs">
                Audiance:
              </label>
              <select
                className="select select-bordered mr-1 sm:mr-3 select-md text-xs sm:text-base"
                name="articleType_select"
                id="articleType_select"
                defaultValue={currentArticle.type}
                onChange={(e) => {
                  currentArticle.type = e.currentTarget.options[
                    e.currentTarget.selectedIndex
                  ].value as ArticleType;
                  setCurrentArticle(currentArticle);
                }}
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
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2">
              <button
                type="button"
                onClick={() => articleUploader(true)}
                className="btn btn-primary mr-3"
                disabled={isSaveBtnDisabled}
              >
                {saveBtnStatus === "Saving" ? (
                  <>
                    Saving <Loading />
                  </>
                ) : (
                  saveBtnStatus
                )}
              </button>
              <button
                type="button"
                onClick={openPublishDialog}
                className="btn btn-success"
                disabled={isPublishBtnDisabled}
              >
                {publishBtnStatus === "Publishing" ? (
                  <>
                    Publishing <Loading />
                  </>
                ) : (
                  publishBtnStatus
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Article Details and the Editor */}
        <div>
          <ArticleDetails
            username={currentArticle.author.username}
            publishedDate={currentArticle.date}
            categoryName={currentArticle.category?.label!}
            subcategoryName={currentArticle.Subcategory?.label!}
          />
          {/* Editor */}
          <div className="w-full text-justify border-spacing-1" id={holder} />
        </div>

        {/* Publish Dialog */}
        <PublishDialog uploader={articleUploader} />

        {/* New Category Dialog */}
        <CategoryDialog
          value={newCategory}
          controller={newCategorycontroller}
          error={newCategoryError}
          errorController={newCategoryErrorController}
          handleSubmit={handleCategorySubmit}
          isSpecial={isSpecial}
          isSpecialController={isSpecialController}
          isUpdate={false}
          handleUpdateCategorySubmit={handleUpdateCategorySubmit}
          selectedToUpdateCategory={selectedToUpdateCategory}
        />

        {/* Update Cateogry dialog */}
        <CategoryDialog
          value={newCategory}
          controller={newCategorycontroller}
          error={newCategoryError}
          errorController={newCategoryErrorController}
          handleSubmit={handleCategorySubmit}
          isSpecial={isSpecial}
          isSpecialController={isSpecialController}
          isUpdate={true}
          handleUpdateCategorySubmit={handleUpdateCategorySubmit}
          selectedToUpdateCategory={selectedToUpdateCategory}
        />

        <SubcategoryDialog
          value={newSubcategory}
          controller={newSubcategorycontroller}
          error={newSubcategoryError}
          errorController={newSubcategoryErrorController}
          handleSubmit={handlesubcategorySubmit}
          selectedCategory={selectedCategory}
          isUpdate={false}
          handleUpdateSubcategorySubmit={handleUpdateSubcategorySubmit}
          selectedToUpdateSubcategory={selectedToUpdateSubcategory}
          selectedNewCategory={selectedNewCategory}
          setSelectedNewCategory={setSelectedNewCategory}
        />

        <SubcategoryDialog
          value={newSubcategory}
          controller={newSubcategorycontroller}
          error={newSubcategoryError}
          errorController={newSubcategoryErrorController}
          handleSubmit={handlesubcategorySubmit}
          selectedCategory={selectedCategory}
          isUpdate={true}
          handleUpdateSubcategorySubmit={handleUpdateSubcategorySubmit}
          selectedToUpdateSubcategory={selectedToUpdateSubcategory}
          categories={categories}
          selectedNewCategory={selectedNewCategory}
          setSelectedNewCategory={setSelectedNewCategory}
        />
      </div>
    </>
  );
};

export default memo(EditorBlock);
