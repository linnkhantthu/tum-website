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
    <div className="dropdown dropdown-bottom lg:dropdown-left lg:dropdown-bottom p-0 m-0 w-full">
      <div
        tabIndex={0}
        role="button"
        className="btn w-[18rem] btn-ghost justify-start"
      >
        Categories
      </div>
      {/* Level 1 */}
      <ul
        id="ddul"
        className="dropdown-content menu lg:menu-horizontal bg-base-200 rounded-box lg:min-w-max z-[1000]"
      >
        {/* First Col */}
        {categories.length === 0 ? (
          <li>No Categories Yet</li>
        ) : (
          categories.map((category) => {
            return (
              <li key={`ddli-${category.id}`}>
                {category.label}
                <ul key={`ddliul-${category.id}`}>
                  {category.Article.length === 0 ? (
                    <li>No Articles Yet</li>
                  ) : (
                    category.Article.map((article) => {
                      console.log(`${category.label}: ${article.Subcategory}`);
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
                          <li key={`ddliulli-${article.id}`}>
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
                        <li key={`ddliulli-${subcategory.id}`}>
                          {subcategory.label}
                          <ul key={`ddliulliul-${subcategory.id}`}>
                            {subcategory.Article.length === 0 ? (
                              <li>No Subarticles Yet</li>
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
                                  <li key={`ddliulliulli-${article.id}`}>
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
