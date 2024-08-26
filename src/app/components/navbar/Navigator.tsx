import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

function Navigator() {
  const { push } = useRouter();
  const pathname = usePathname();
  const pathnames = pathname.split("/");
  pathnames.shift();
  let currentPathname = "";
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li></li>
        {pathnames.map((value) => {
          currentPathname += `/${value}`;
          return (
            <li key={`li-${value}`}>
              <Link href={currentPathname}>{value}</Link>
            </li>
          );
        })}
        <li></li>
      </ul>
    </div>
  );
}

export default Navigator;
