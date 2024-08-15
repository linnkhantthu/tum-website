"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavbarComponents from "./NavbarComponents";
import Navigator from "./Navigator";
import Loading from "./Loading";
import Toast from "./Toast";
import { FlashMessage } from "@/lib/models";
import { toastOnDelete } from "@/lib/utils-fe";

function NavigationBar({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<FlashMessage[]>([]);

  /**
   * Theme Controller
   * @param e
   */
  const changeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "dark" : "light");
    localStorage.setItem("theme", e.target.checked ? "dark" : "light");
  };
  useEffect(() => {
    // Initiate Theme
    const localTheme = localStorage.getItem("theme");
    const isCheck = document.getElementById("theme-checkbox");
    if (localTheme !== null) {
      setTheme(localTheme);
      if (isCheck !== null) {
        // @ts-ignore
        isCheck!.checked = localTheme === "dark" ? true : false;
      }
    } else {
      setTheme("dark");
      if (isCheck !== null) {
        // @ts-ignore
        isCheck!.checked = true;
      }
      localStorage.setItem("theme", "dark");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    const isCheck = document.getElementById("theme-checkbox");
    if (isCheck !== null) {
      // @ts-ignore
      isCheck!.checked = localTheme === "dark" ? true : false;
    }
  }, [isLoading]);

  useEffect(() => {
    const toasts: FlashMessage[] | null = JSON.parse(
      localStorage.getItem("toasts")!
    );
    if (toasts !== null) {
      setToasts(toasts);
    }
    window.addEventListener(
      "storage",
      () => {
        const toasts: FlashMessage[] | null = JSON.parse(
          localStorage.getItem("toasts")!
        );
        if (toasts !== null) {
          setToasts(toasts);
        }
      },
      false
    );
  }, []);

  return isLoading ? (
    <div className="flex flex-col mt-10">
      <Loading label="Loading theme..." />
    </div>
  ) : (
    <div className="drawer m-0 min-h-screen" data-theme={theme}>
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">
            <Image src="/tum-logo.png" alt="tum-logo" width={50} height={50} />
          </div>
          <div className="hidden flex-none lg:block">
            <NavbarComponents
              isMenuHorizontal={true}
              themeController={changeTheme}
            />
          </div>
        </div>
        {/* Page content here */}
        <div className=" text-pretty container">
          <Navigator />
          {children}
          <div className="toast toast-start w-full">
            {toasts.map((value) => (
              <Toast
                key={`toastId-${value.id}`}
                flashMessage={value}
                onDelete={() => toastOnDelete(value.id, toasts, setToasts)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="drawer-side z-10">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <NavbarComponents
          isMenuHorizontal={false}
          themeController={changeTheme}
        />
      </div>
    </div>
  );
}

export default NavigationBar;
