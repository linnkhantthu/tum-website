"use client";

import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import useUser from "@/lib/useUser";
import ThemeController from "./ThemeController";
import NavbarDropdown from "./NavbarDropdown";
import { Category, SpecialCategory } from "@/lib/models";
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
        <Link className="btn btn-ghost" href="/articles">
          Articles
        </Link>
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
              <Link className="btn btn-ghost" href="/editor/new">
                Editor
              </Link>
            </li>
          ) : (
            ""
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
          <li>
            <Link className="btn btn-error" href="/users/auth/logout">
              Logout
            </Link>
          </li>
        </>
      ) : (
        <li>
          <Link className="btn btn-ghost" href="/users/auth/">
            Login/Register
          </Link>
        </li>
      )}
    </ul>
  );
}

export default NavbarComponents;
