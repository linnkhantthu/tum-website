import { SpecialCategory } from "@/lib/models";
import Link from "next/link";
import React from "react";

function NavbarDropdown({ categories }: { categories: SpecialCategory[] }) {
  const OpenOrCloseDropdown = () => {
    const element = document.activeElement;
    if (element) {
      // @ts-ignore
      element?.blur();
    }
  };
  return (
    <div className="dropdown dropdown-bottom lg:dropdown-left lg:dropdown-bottom p-0 m-0">
      <div
        tabIndex={0}
        role="button"
        className="btn w-[18rem] lg:w-auto btn-ghost justify-start"
      >
        Categories
      </div>
      {/* Level 1 */}
      <ul
        id="ddul"
        className="p-10 border border-base-300 dropdown-content menu lg:menu-horizontal bg-base-100 rounded-box lg:min-w-max z-[1000]"
      >
        {/* First Col */}
        {categories.length === 0 ? (
          <li className="border-t-[1px] border-base-200">No Categories Yet</li>
        ) : (
          categories.map((category) => {
            return (
              <li
                key={`ddli-${category.id}`}
                className="border-t-[1px] border-base-200"
              >
                <span className=" text-lg">{category.label}</span>
                <ul key={`ddliul-${category.id}`}>
                  {category.Article.length === 0 ? (
                    <li className="border-t-[1px] border-base-200">
                      No Articles Yet
                    </li>
                  ) : (
                    category.Article.map((article) => {
                      if (article.Subcategory === null) {
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
                            key={`ddliulli-${article.id}`}
                            className="border-t-[1px] border-base-200"
                          >
                            <Link
                              href={`/articles/${article.id}`}
                              onClick={OpenOrCloseDropdown}
                            >
                              {title}
                            </Link>
                          </li>
                        );
                      }
                    })
                  )}
                  {category.subcategory.length === 0 ? (
                    <li>No Subcategories Yet</li>
                  ) : (
                    category.subcategory.map((subcategory) => {
                      return (
                        <li
                          key={`ddliulli-${subcategory.id}`}
                          className="border-t-[1px] border-base-200"
                        >
                          <span className="text-base">{subcategory.label}</span>
                          <ul key={`ddliulliul-${subcategory.id}`}>
                            {subcategory.Article.length === 0 ? (
                              <li className="border-t-[1px] border-base-200">
                                No Subarticles Yet
                              </li>
                            ) : (
                              subcategory.Article.map((article) => {
                                const blocks =
                                  article.content === null
                                    ? undefined
                                    : article.content.blocks;
                                const header = blocks?.filter(
                                  (value) => value.type === "header"
                                )[0];
                                const title = header
                                  ? header.data.text
                                  : "Title";
                                return (
                                  <li
                                    key={`ddliulliulli-${article.id}`}
                                    className="border-t-[1px] border-base-200"
                                  >
                                    <Link
                                      href={`/articles/${article.id}`}
                                      onClick={OpenOrCloseDropdown}
                                    >
                                      {title}
                                    </Link>
                                  </li>
                                );
                              })
                            )}
                          </ul>
                        </li>
                      );
                    })
                  )}
                </ul>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

export default NavbarDropdown;
