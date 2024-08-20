import React from "react";

function NavbarDropdown() {
  return (
    <details>
      <summary className=" pr-24">Departments</summary>
      <ul className="bg-base-300 rounded-t-none p-2 z-10 w-full">
        <li className="border-b-[1px] border-base-100">
          <a>Information Technology</a>
        </li>
        <li>
          <a>Civil Engineering</a>
        </li>
        <li>
          <a>Electrical Engineering</a>
        </li>
      </ul>
    </details>
  );
}

export default NavbarDropdown;
