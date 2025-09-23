import React from "react";
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  Home,
  Icon,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  User,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: Home },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const SideBar = ({ sidebar, setSideBar }) => {

  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${
        sidebar ? "translate-x-0" : "max-sm:-translate-x-full"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="my-7 w-full">
        <img
          src={user.imageUrl}
          className="w-14 rounded-full mx-auto"
          alt="user avatar"
        />
        <h1 className="mx-1 text-center"> {user.fullName} </h1>
        <div className="px-5 mt-5 text-gray-600 font-medium text-sm">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSideBar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded ${
                  isActive
                    ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white"
                    : "hover:bg-gray-200 active:scale-95 ease-in-out duration-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
        <div onClick={openUserProfile} className="flex gap-2 items-center cursor-pointer">
            <img src={user.imageUrl} className=" rounded-full w-8" alt="" />
            <div>
                <h1 className="text-sm font-medium">
                    {user.fullName}
                </h1>
                <p className="text-sm text-gray-500">
                    <Protect fallback='Free' plan='premium'>Premium</Protect>
                    Plan
                </p>
            </div>
        </div>
        <LogOut onClick={signOut} className="w-4.5 text-gray-500 transition hover:text-gray-800 cursor-pointer hover:scale-105 duration-200 active:scale-95"/>
      </div>

    </div> 
  );
};

export default SideBar;
