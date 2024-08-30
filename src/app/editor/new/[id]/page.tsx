"use client";

import Loading from "@/app/components/Loading";
import Toast from "@/app/components/Toast";
import Warning from "@/app/components/Warning";
import { Article, Category, FlashMessage, Subcategory } from "@/lib/models";
import useUser from "@/lib/useUser";
import { makeid, toastOnDelete } from "@/lib/utils-fe";
//index.tsx
import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";
import { FormEvent, useEffect, useState } from "react";

// important that we use dynamic loading here
// editorjs should only be rendered on the client side.
const EditorBlock = dynamic(() => import("../../../components/editor/Editor"), {
  ssr: false,
});

function EditorPage({ params }: { params: { id: string } }) {
  //state to hold output data. we'll use this for rendering later
  const [currentArticle, setCurrentArticle] = useState<Article>();
  const [data, setData] = useState<OutputData>(currentArticle?.content!);
  const [isLoading, setIsLoading] = useState(true);
  const { data: userData, isLoading: isUserLoading, isError } = useUser();
  const [toasts, setToasts] = useState<FlashMessage[]>([]);
  const [newCategory, newCategoryController] = useState<string>("");
  const [newCategoryError, newCategoryErrorController] = useState<string>();
  const [isSpecial, isSpecialController] = useState(false);

  const [newSubcategory, newSubcategoryController] = useState<string>("");
  const [newSubcategoryError, newSubcategoryErrorController] =
    useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  /**
   * Fetch existing data
   */
  const fetchArticles = async () => {
    const res = await fetch(`/api/articles?id=${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ articleId: params.id }),
    });
    const { articles, message }: { articles: Article; message: string } =
      await res.json();
    if (articles) {
      setCurrentArticle(articles);
      setData(articles.content);
      setSubcategories(articles.category?.subcategory!);
      setSelectedCategory(articles.category);
      setSelectedSubcategory(articles.Subcategory);

      setToasts((toasts) => [
        {
          id: makeid(10),
          message: message,
          category: "alert-success",
        },
        ...toasts,
      ]);
    } else {
      setToasts((toasts) => [
        {
          id: makeid(10),
          message: message,
          category: "alert-error",
        },
        ...toasts,
      ]);
    }
    return true;
  };

  /**
   * Close Category Dialog
   */
  const closeCategoryDialog = async () => {
    // @ts-ignore
    document.getElementById("category_dialog")?.close();
    // @ts-ignore
    document.getElementById("update_category_dialog")?.close();
  };
  // Submit Data
  const handleCategorySubmit = async (
    e: FormEvent,
    isUpdate: boolean = false
  ) => {
    e.preventDefault();
    const res = await fetch("/api/articles/categories", {
      method: isUpdate ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: isUpdate ? selectedCategory?.id : undefined,
        categoryName: newCategory,
        isSpecial: isSpecial,
      }),
    });
    if (res.ok) {
      const { category, message }: { category: Category; message: string } =
        await res.json();
      if (category) {
        if (isUpdate) {
          // Upddate the object
          setCategories(
            categories.map((_category) =>
              _category.id === category.id ? category : _category
            )
          );
          setSelectedCategory(category);
        } else {
          // Add new object
          setCategories((categories) => [...categories, category]);
        }
        setToasts((toasts) => [
          {
            id: makeid(10),
            message: message,
            category: "alert-success",
          },
          ...toasts,
        ]);
      } else {
        setToasts((toasts) => [
          {
            id: makeid(10),
            message: message,
            category: "alert-error",
          },
          ...toasts,
        ]);
      }
    } else {
      try {
        const { message } = await res.json();
        setToasts((toasts) => [
          {
            id: makeid(10),
            message: message,
            category: "alert-error",
          },
          ...toasts,
        ]);
      } catch (error) {
        setToasts((toasts) => [
          {
            id: makeid(10),
            //@ts-ignore
            message: error.message,
            category: "alert-success",
          },
          ...toasts,
        ]);
      }
    }
    newCategoryController("");
    isSpecialController(false);
    closeCategoryDialog();
  };
  /**
   * Close Subcategory Dialog
   */
  const closeSubcategoryDialog = async () => {
    // @ts-ignore
    document.getElementById("subcategory_dialog")?.close();
  };

  // Submit Data
  const handleSubcategorySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      const res = await fetch("/api/articles/categories/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subcategoryName: newSubcategory,
          categoryId: selectedCategory?.id,
        }),
      });
      if (res.ok) {
        const {
          subcategory,
          message,
        }: { subcategory: Subcategory; message: string } = await res.json();
        if (subcategory) {
          const indexToUpdate = categories.findIndex(
            (category) => category.id === subcategory.categoryId
          );
          const updatedCategories = [...categories];
          updatedCategories[indexToUpdate]?.subcategory.push(subcategory);
          setCategories((updatedCategories) => [...updatedCategories]);
          setSubcategories((subcategories) => [...subcategories, subcategory]);
          setToasts((toasts) => [
            {
              id: makeid(10),
              message: message,
              category: "alert-success",
            },
            ...toasts,
          ]);
        } else {
          setToasts((toasts) => [
            {
              id: makeid(10),
              message: message,
              category: "alert-error",
            },
            ...toasts,
          ]);
        }
      } else {
        try {
          const { message } = await res.json();
          setToasts((toasts) => [
            {
              id: makeid(10),
              message: message,
              category: "alert-error",
            },
            ...toasts,
          ]);
        } catch (error) {
          setToasts((toasts) => [
            {
              id: makeid(10),
              //@ts-ignore
              message: error.message,
              category: "alert-success",
            },
            ...toasts,
          ]);
        }
      }
      newCategoryController("");
    } else {
      setToasts((toasts) => [
        {
          id: makeid(10),
          message: "Please select a Category to add its subcategory.",
          category: "alert-info",
        },
        ...toasts,
      ]);
    }
    closeSubcategoryDialog();
  };

  /**
   * Fetch Categories
   */
  const fetchCategories = async () => {
    const res = await fetch("/api/articles/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const {
        categories,
        message,
      }: { categories: Category[] | undefined; message: string } =
        await res.json();
      setCategories(categories!);
      setToasts((toasts) => [
        { id: makeid(10), message: message, category: "alert-success" },
        ...toasts,
      ]);
    } else {
      const { message } = await res.json();
      setToasts((toasts) => [
        { id: makeid(10), message: message, category: "alert-error" },
        ...toasts,
      ]);
    }
  };

  useEffect(() => {
    // Fetch exisiting data
    fetchArticles().then((result) => {
      fetchCategories().then(() => setIsLoading(false));
    });
  }, []);

  // useEffect(() => {
  //   setData(currentArticle?.content!);
  // }, [currentArticle]);

  /**
   * Delete Category
   * @param categoryId
   * @returns
   */
  const deleteCategory = async (categoryId: string) => {
    try {
      const res = await fetch("/api/articles/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: categoryId }),
      });
      const {
        category: deletedCategory,
        message,
      }: { category: Category; message: string } = await res.json();
      if (res.ok) {
        if (deletedCategory) {
          // Delete Category from Categories
          setCategories((categories) => [
            ...categories.filter(
              (category) => category.id !== deletedCategory.id
            ),
          ]);

          // Delete Subcategories
          setSubcategories(
            deletedCategory.id === selectedCategory?.id ? [] : subcategories
          );

          // Delete Selected Category
          setSelectedCategory(
            deletedCategory.id === selectedCategory?.id
              ? undefined
              : selectedCategory
          );

          // Delete Selected Subcategory
          setSelectedSubcategory(
            deletedCategory.id === selectedCategory?.id
              ? undefined
              : selectedSubcategory
          );

          setToasts((toasts) => [
            { id: makeid(10), message: message, category: "alert-warning" },
            ...toasts,
          ]);
          return;
        }
        setToasts((toasts) => [
          { id: makeid(10), message: message, category: "alert-error" },
          ...toasts,
        ]);
        return;
      }
      setToasts((toasts) => [
        { id: makeid(10), message: message, category: "alert-error" },
        ...toasts,
      ]);
      return;
    } catch (error) {
      setToasts((toasts) => [
        // @ts-ignore
        { id: makeid(10), message: error.message, category: "alert-error" },
        ...toasts,
      ]);
      return;
    }
  };

  /**
   * Delete Subcategory
   * @param subcategoryId
   * @returns
   */
  const deleteSubcategory = async (subcategoryId: string) => {
    try {
      const res = await fetch("/api/articles/categories/subcategories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subcategoryId: subcategoryId }),
      });

      if (res.ok) {
        const {
          subcategory: deletedSubcategory,
          message,
        }: { subcategory: Subcategory | undefined; message: string } =
          await res.json();
        if (deletedSubcategory) {
          // Delete Category from Categories
          setSubcategories((subcategories) => [
            ...subcategories.filter(
              (subcategory) => subcategory.id !== deletedSubcategory.id
            ),
          ]);

          // Delete Selected Subcategory
          setSelectedSubcategory(
            deletedSubcategory.id === selectedSubcategory?.id
              ? undefined
              : selectedSubcategory
          );

          setToasts((toasts) => [
            { id: makeid(10), message: message, category: "alert-warning" },
            ...toasts,
          ]);
          return;
        }
        setToasts((toasts) => [
          { id: makeid(10), message: message, category: "alert-error" },
          ...toasts,
        ]);
        return;
      } else {
        const { message } = await res.json();
        setToasts((toasts) => [
          { id: makeid(10), message: message, category: "alert-error" },
          ...toasts,
        ]);
        return;
      }
    } catch (error) {
      setToasts((toasts) => [
        // @ts-ignore
        { id: makeid(10), message: error.message, category: "alert-error" },
        ...toasts,
      ]);
      return;
    }
  };

  return isUserLoading ? (
    <Loading label="Loading..." />
  ) : isError ? (
    <Warning label="Lost connection to the server." />
  ) : userData.isLoggedIn ? (
    isLoading ? (
      <Loading label="Fetching data..." />
    ) : (
      <>
        <EditorBlock
          data={data}
          onChange={setData}
          currentArticle={currentArticle!}
          setCurrentArticle={setCurrentArticle}
          holder="editorjs-container"
          toasts={toasts}
          setToasts={setToasts}
          categories={categories}
          setCategories={setCategories}
          subcategories={subcategories!}
          setSubcategories={setSubcategories}
          newCategory={newCategory}
          newCategorycontroller={newCategoryController}
          newCategoryError={newCategoryError}
          newCategoryErrorController={newCategoryErrorController}
          handleCategorySubmit={handleCategorySubmit}
          newSubcategory={newSubcategory}
          newSubcategorycontroller={newSubcategoryController}
          newSubcategoryError={newSubcategoryError}
          newSubcategoryErrorController={newSubcategoryErrorController}
          handlesubcategorySubmit={handleSubcategorySubmit}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          deleteCategory={deleteCategory}
          deleteSubcategory={deleteSubcategory}
          isSpecial={isSpecial}
          isSpecialController={isSpecialController}
        />

        {/* Toasts */}
        <div className="toast toast-start z-10">
          {toasts?.map((value) => {
            return (
              <Toast
                key={`toastId-${value.id}`}
                toastId={value.id}
                flashMessage={value}
                onDelete={() => toastOnDelete(value.id, toasts, setToasts)}
              />
            );
          })}
        </div>
      </>
    )
  ) : (
    <div>
      You need to login to access this feature.
      <a href="/users/auth" className="link link-info">
        Login?
      </a>
    </div>
  );
}

export default EditorPage;
