import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen w-full flex flex-col ml-[35%] mr-[60px]">
      <NavBar />
      <div className="flex-grow max-w-4xl p-4">
        <Outlet />
      </div>
    </div>
  );
}
