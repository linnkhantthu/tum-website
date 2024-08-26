"use client";

import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import useUser from "@/lib/useUser";
import ThemeController from "../ThemeController";
import { Category, SpecialCategory } from "@/lib/models";
import { MdCategory, MdList, MdNewspaper } from "react-icons/md";
import Link from "next/link";

function NavbarComponents({
  isMenuHorizontal,
  themeController,
  themeId,
}: {
  isMenuHorizontal: boolean;
  themeController: (e: React.ChangeEvent<HTMLInputElement>) => void;
  themeId: string;
}) {
  const { data, isLoading, isError } = useUser();
  const [categories, setCategories] = useState<SpecialCategory[]>([]);

  const fetchSpecialCategories = async () => {
    try {
      const res = await fetch(
        "/api/articles/categories?isSpecial=true&take=5",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const {
          categories,
          message,
        }: { categories: SpecialCategory[]; message: string } =
          await res.json();
        setCategories(categories);
      } else {
        const { message } = await res.json();
        console.log(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeDrawer = () => {
    const checkbox = document.getElementById("my-drawer-3")!;
    // @ts-ignore
    checkbox.checked = false;
    const menus = document.getElementsByName("menu")!;
    // @ts-ignore
    menus.forEach((menu) => (menu.open = false));
  };

  useEffect(() => {
    fetchSpecialCategories();
  }, []);

  return (
    <ul
      className={
        isMenuHorizontal
          ? "menu menu-horizontal items-center"
          : "menu bg-base-200 min-h-full w-80 p-4"
      }
    >
      {/* Sidebar content here */}

      {/* <li>
        <NavbarDropdown categories={categories} />
      </li> */}
      {categories.map((category) => (
        <li key={`parentli-${category.id}`} className=" z-30">
          <details name="menu">
            <summary>
              <MdCategory />
              {category.label}
            </summary>
            <ul
              className="bg-base-200 xl:w-[20rem]"
              onMouseLeave={(e) =>
                // @ts-ignore
                (e.currentTarget.parentElement!.open = !isMenuHorizontal)
              }
            >
              {category.Article.filter(
                (article) => article.Subcategory === null
              ).map((article) => {
                const blocks =
                  article.content === null ? undefined : article.content.blocks;
                const header = blocks?.filter(
                  (value) => value.type === "header"
                )[0];
                const title = header ? header.data.text : "Title";
                return (
                  <li
                    key={`articleli-${article.id}`}
                    className="border-b-[0.1px] border-neutral w-full"
                  >
                    <Link
                      href={`/articles/${article.id}`}
                      onClick={() => closeDrawer()}
                    >
                      <MdNewspaper />
                      {title.replaceAll("&nbsp;", "")}
                    </Link>
                  </li>
                );
              })}
              {category.subcategory.map((subcategory) => (
                <li key={`subcategoryli-${subcategory.id}`}>
                  <details>
                    <summary>
                      <MdCategory />
                      {subcategory.label}
                    </summary>
                    <ul
                      onMouseLeave={(e) =>
                        // @ts-ignore
                        (e.currentTarget.parentElement!.open =
                          !isMenuHorizontal)
                      }
                    >
                      {subcategory.Article.map((article) => {
                        const blocks =
                          article.content === null
                            ? undefined
                            : article.content.blocks;
                        const header = blocks?.filter(
                          (value) => value.type === "header"
                        )[0];
                        const title = header ? header.data.text : "Title";
                        return (
                          <li
                            key={`articleli-${article.id}`}
                            className=" border-b-[0.1px] border-neutral"
                          >
                            <Link
                              href={`/articles/${article.id}`}
                              onClick={() => closeDrawer()}
                            >
                              <MdNewspaper />
                              {title.replaceAll("&nbsp;", "")}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          </details>
        </li>
      ))}

      <li>
        <a href="/articles">Articles</a>
      </li>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <li>
          <span>ConnectionError</span>
        </li>
      ) : data.isLoggedIn ? (
        <>
          {data.user?.role === "ADMIN" ? (
            <li>
              <a href="/editor/new">Editor</a>
            </li>
          ) : (
            ""
          )}
          <li>
            <a href="/users/auth/logout">Logout</a>
          </li>
        </>
      ) : (
        <li>
          <a href="/users/auth/">Login/Register</a>
        </li>
      )}
      <li className="flex flex-row items-end">
        <span>
          Theme
          <ThemeController
            themeController={themeController}
            themeId={themeId}
          />
        </span>
      </li>
    </ul>
  );
}

export default NavbarComponents;
