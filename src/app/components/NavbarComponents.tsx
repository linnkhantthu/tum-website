"use client";

import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import useUser from "@/lib/useUser";
import ThemeController from "./ThemeController";
import NavbarDropdown from "./NavbarDropdown";
import { Category, SpecialCategory } from "@/lib/models";

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
        console.log(message);
        setCategories(categories);
      } else {
        const { message } = await res.json();
        console.log(message);
      }
    } catch (error) {
      console.error(error);
    }
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

      <li>
        <NavbarDropdown categories={categories} />
      </li>

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
