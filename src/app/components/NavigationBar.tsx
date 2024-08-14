"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavbarComponents from "./NavbarComponents";
import Navigator from "./Navigator";
import Loading from "./Loading";

function NavigationBar({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const changeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme !== null) {
      console.log("Here");
      document.getElementById("theme-checkbox")!.checked =
        localTheme === "light" ? true : false;
      setTheme(localTheme);
    } else {
      document.getElementById("theme-checkbox")!.checked = true;
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
    setIsLoading(false);
  }, []);

  return (
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
