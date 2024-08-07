"use client";

import React from "react";
import Image from "next/image";
import useUser from "@/lib/useUser";
import Loading from "./Loading";

function NavigationBar({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useUser();
  return (
    <div className="drawer m-0 min-h-screen" data-theme="dark">
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
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              <li>
                <a>Navbar Item 1</a>
              </li>
              <li>
                <a>Navbar Item 2</a>
              </li>
            </ul>
          </div>
        </div>
        {/* Page content here */}
        <div className=" text-pretty">{children}</div>
      </div>
      <div className="drawer-side z-10">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <a href="/editor">Editor</a>
          </li>
          <li>
            {isLoading ? (
              <Loading />
            ) : isError ? (
              <span>An error occurred.</span>
            ) : data.isLoggedIn ? (
              <a href="/users/auth/logout">Logout</a>
            ) : (
              <a href="/users/auth/">Login/Register</a>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavigationBar;
