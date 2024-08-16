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
   * Check - true => dark
   * @param e
   */
  const changeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "dark" : "light");
    localStorage.setItem("theme", e.target.checked ? "dark" : "light");
  };

  useEffect(() => {
    // Initiate Theme
    // Get theme from local storage
    const localTheme = localStorage.getItem("theme");

    const themeController_1 = document.getElementById("theme-controller-1");
    const themeController_2 = document.getElementById("theme-controller-2");
    if (localTheme !== null) {
      setTheme(localTheme);
      if (themeController_1 !== null && themeController_2 !== null) {
        // @ts-ignore
        themeController_1!.checked = localTheme === "dark" ? true : false;
        // @ts-ignore
        themeController_2!.checked = localTheme === "dark" ? true : false;
      }
    } else {
      setTheme("dark");
      if (themeController_1 !== null && themeController_2 !== null) {
        // @ts-ignore
        themeController_1!.checked = true;
        // @ts-ignore
        themeController_2!.checked = true;
      }
      localStorage.setItem("theme", "dark");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    const themeController_1 = document.getElementById("theme-controller-1");
    const themeController_2 = document.getElementById("theme-controller-2");
    if (themeController_1 !== null && themeController_2 !== null) {
      // @ts-ignore
      themeController_1!.checked = localTheme === "dark" ? true : false;
      // @ts-ignore
      themeController_2!.checked = localTheme === "dark" ? true : false;
      // console.log("isCheck: ", isCheck.checked);
    }
  }, [isLoading]);

  useEffect(() => {
    setToasts(JSON.parse(localStorage.getItem("toasts")!));
    window.onstorage = (event) => {
      setToasts(JSON.parse(localStorage.getItem("toasts")!));
    };
  }, [isLoading]);

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
              themeId={"theme-controller-1"}
              isMenuHorizontal={true}
              themeController={changeTheme}
            />
          </div>
        </div>
        {/* Page content here */}
        <div className=" text-pretty container">
          <Navigator />
          {children}
          <div className="toast toast-start">
            {toasts?.map((value) => (
              <Toast
                key={`toastId-${value.id}`}
                flashMessage={value}
                onDelete={() => toastOnDelete(value.id, toasts, setToasts)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Drawer */}
      <div className="drawer-side z-10">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <NavbarComponents
          isMenuHorizontal={false}
          themeController={changeTheme}
          themeId={"theme-controller-2"}
        />
      </div>
    </div>
  );
}

export default NavigationBar;
