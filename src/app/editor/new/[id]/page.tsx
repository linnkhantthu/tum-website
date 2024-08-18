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
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  /**
   * Call Category Dialog
   */
  const closeAddNewCategoryDialog = async () => {
    // @ts-ignore
    document.getElementById("add_new_category_dialog")?.close();
  };

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

  // Submit Data
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/articles/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryName: newCategory,
      }),
    });
    if (res.ok) {
      const { category, message }: { category: Category; message: string } =
        await res.json();
      if (category) {
        setCategories((categories) => [...categories, category]);
        setToasts((toasts) => [
          {
            id: makeid(10),
            message: message,
            category: "alert-success",
          },
          ...toasts,
        ]);
        // setToasts([
        //   {
        //     id: makeid(10),
        //     message: message,
        //     category: "alert-success",
        //   },
        // ]);
      } else {
        setToasts((toasts) => [
          {
            id: makeid(10),
            message: message,
            category: "alert-error",
          },
          ...toasts,
        ]);
        // setToasts([
        //   {
        //     id: makeid(10),
        //     message: message,
        //     category: "alert-success",
        //   },
        // ]);
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
        // setToasts([
        //   {
        //     id: makeid(10),
        //     message: message,
        //     category: "alert-success",
        //   },
        // ]);
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
    closeAddNewCategoryDialog();
  };

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

  useEffect(() => setData(currentArticle?.content!), [currentArticle]);

  return isUserLoading ? (
    <Loading label="Loading..." />
  ) : isError ? (
    <Warning label="Lost connection to the server." />
  ) : userData.isLoggedIn ? (
    isLoading ? (
      <Loading label="Fetching data..." />
    ) : (
      <>
        <main className="flex flex-row justify-center">
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
            subcategories={subcategories}
            setSubcategories={setSubcategories}
            newCategory={newCategory}
            newCategorycontroller={newCategoryController}
            newCategoryError={newCategoryError}
            newCategoryErrorController={newCategoryErrorController}
            handleSubmit={handleSubmit}
          />
        </main>
        <div className="toast toast-start z-10">
          {toasts?.map((value) => {
            return (
              <Toast
                key={`toastId-${value.id}`}
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
      You need to login to access this feature.<a href="/users/auth">Login?</a>
    </div>
  );
}

export default EditorPage;
