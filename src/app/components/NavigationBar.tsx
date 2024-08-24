"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import NavbarComponents from "./NavbarComponents";
import Navigator from "./Navigator";
import Loading from "./Loading";
import Toast from "./Toast";
import { Article, FlashMessage } from "@/lib/models";
import { makeid, toastOnDelete } from "@/lib/utils-fe";
import { useRouter } from "next/navigation";
import { MdInfoOutline } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import Link from "next/link";

function NavigationBar({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<FlashMessage[]>([]);
  const [showTopbar, setShowTopbar] = useState(true);
  const [latestArticle, setLatestArticle] = useState<Article>();
  const [title, setTitle] = useState<string>();
  const [content, setContent] = useState<string>();
  const { push } = useRouter();

  /**
   * Theme Controller
   * Check - true => dark
   * @param e
   */
  const changeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "dark" : "light");
    localStorage.setItem("theme", e.target.checked ? "dark" : "light");
  };

  const fetchLatestArticle = async () => {
    const res = await fetch("/api/articles?id=latest", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const { articles, message }: { articles: Article[]; message: string } =
        await res.json();
      if (articles.length !== 0) {
        const article = articles[0];
        setLatestArticle(article);
        const blocks = article.content.blocks;

        const header = blocks.filter((value) => value.type === "header")[0];
        const paragraph = blocks.filter(
          (value) => value.type === "paragraph"
        )[0];

        setTitle(header ? header.data.text : "Title");
        setContent(paragraph ? paragraph.data.text : "Content");
      }
    } else {
      const { message } = await res.json();
      setToasts((toasts) => [
        { id: makeid(10), message: message, category: "alert-warning" },
        ...toasts,
      ]);
    }
  };

  // Initiate Theme and topbar data
  useEffect(() => {
    // Get theme from local storage
    const localTheme = localStorage.getItem("theme");

    // Sync theme controllers
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
    // Fetch latest article
    fetchLatestArticle().then(() => setIsLoading(false));
  }, []);

  // Set theme values to the controllers when the theme was loaded from localstorage
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

  // Check toasts from localstorage
  useEffect(() => {
    setToasts(JSON.parse(localStorage.getItem("toasts")!));
    window.onstorage = (event) => {
      setToasts(JSON.parse(localStorage.getItem("toasts")!));
    };
  }, [isLoading]);

  return isLoading ? (
    // Load Theme
    <html lang="en" data-theme={theme}>
      <body className="m-0 h-full" suppressHydrationWarning={true}>
        <div className="flex flex-col h-screen justify-center">
          <Loading label="Loading theme..." />
        </div>
      </body>
    </html>
  ) : (
    <>
      <html lang="en" data-theme={theme}>
        <body className="m-0 h-full" suppressHydrationWarning={true}>
          {/* Topbar */}
          <div
            className={
              showTopbar
                ? "flex flex-row absolute z-20 h-6 items-center bg-info text-info-content w-full pl-2 opacity-85"
                : "hidden"
            }
          >
            <MdInfoOutline />
            <Link
              href={`/articles/${latestArticle?.id}`}
              className="pl-2 line-clamp-1 link"
            >
              {title}-{content}
            </Link>
            <span
              className="absolute right-1 cursor-pointer"
              onClick={() => setShowTopbar(false)}
            >
              <FaXmark />
            </span>
          </div>

          {/* Navbar */}
          <div className="drawer m-0 min-h-screen">
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
                  <Image
                    src="/tum-logo.png"
                    alt="tum-logo"
                    width={50}
                    height={50}
                    className="cursor-pointer"
                    onClick={() => push("/")}
                  />
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
              <div className="text-pretty container min-h-screen">
                <Navigator />
                {children}
                <div className="toast toast-start z-10">
                  {toasts?.map((toast) => (
                    <Toast
                      key={`toastId-${toast.id}`}
                      flashMessage={toast}
                      onDelete={() =>
                        toastOnDelete(toast.id, toasts, setToasts)
                      }
                      toastId={toast.id}
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
        </body>
      </html>
      <footer className="footer bg-base-300 text-base-content p-10 mt-3">
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Social</h6>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </>
  );
}

export default NavigationBar;
