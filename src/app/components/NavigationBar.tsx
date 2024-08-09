"use client";

import React from "react";
import Image from "next/image";
import useUser from "@/lib/useUser";
import Loading from "./Loading";
import NavbarComponents from "./NavbarComponents";

function NavigationBar({ children }: { children: React.ReactNode }) {
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
            <NavbarComponents isMenuHorizontal={true} />
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
        <NavbarComponents isMenuHorizontal={false} />
      </div>
    </div>
  );
}

export default NavigationBar;
