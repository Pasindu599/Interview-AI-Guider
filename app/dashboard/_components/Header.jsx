"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

function Header() {
  const path = usePathname();

  return (
    <div className="flex items-center justify-between p-4 bg-slate-100 shadow-sm sticky z-10">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={50} height={10} />
        <span className="font-bold ">
          Interview <span className="text-bold text-blue-800">AI</span>
        </span>
      </div>
      <ul className="hidden md:flex gap-10 font-semibold">
        <li
          className={`hover:font-bold hover:text-purple-800 transition cursor-pointer ${
            path === "/dashboard" ? "font-bold text-purple-800" : ""
          }`}
        >
          Dashboard
        </li>
        <li
          className={`hover:font-bold hover:text-purple-800 transition cursor-pointer ${
            path === "/dashboard/questions" ? "font-bold text-purple-800" : ""
          }`}
        >
          Questions
        </li>
        <li
          className={`hover:font-bold hover:text-purple-800 transition cursor-pointer ${
            path === "/upgrade" ? "font-bold text-purple-800" : ""
          }`}
        >
          Upgrade
        </li>
        <li
          className={`hover:font-bold hover:text-purple-800 transition cursor-pointer ${
            path === "/how" ? "font-bold text-purple-800" : ""
          }`}
        >
          How it Works?
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
