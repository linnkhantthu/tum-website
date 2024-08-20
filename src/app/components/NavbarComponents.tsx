"use client";

import React from "react";
import Loading from "./Loading";
import useUser from "@/lib/useUser";
import ThemeController from "./ThemeController";
import NavbarDropdown from "./NavbarDropdown";

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
        <NavbarDropdown />
      </li>
      <li>
        <a href="/articles">Articles</a>
      </li>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <li>
          <span>An error occurred.</span>
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
