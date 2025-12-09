import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { Menu, X } from 'lucide-react';
import SideBar from '../components/SideBar.jsx';
import { useUser, SignIn } from '@clerk/clerk-react';

const Layout = () => {

  const naviagte = useNavigate();
  const [sideBar, setSideBar] = useState(false);
  const {user } = useUser();

  return user ? (
    <div className="flex flex-col items-start justify-start h-screen">
      <nav className="w-full px-8 min-h-16 flex items-center justify-between border-b border-gray-200">
        {/* <img src={assets.logo} className='cursor-pointer w-32 sm:w-44' alt="" onClick={() => naviagte("/")} /> */}
        <span
          onClick={() => naviagte("/")}
          className="text-3xl font-semibold text-indigo-700 cursor-pointer"
        >
          AI SaaS
        </span>

        {sideBar ? (
          <X
            onClick={() => setSideBar(false)}
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer hover:scale-108 active:scale-95 duration-200"
          />
        ) : (
          <Menu
            onClick={() => setSideBar(true)}
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer hover:scale-108 active:scale-95 duration-200"
          />
        )}
      </nav>
      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
        <SideBar sideBar={sideBar} setSideBar={setSideBar} />
        <div className="flex-1 bg-[#F4F7FB]">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}

export default Layout


// import React, { useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { assets } from "../assets/assets.js";
// import { Menu, X } from "lucide-react";
// import SideBar from "../components/SideBar.jsx";
// import { useUser, SignIn } from "@clerk/clerk-react";

// const Layout = () => {
//   const navigate = useNavigate();
//   const [sideBar, setSideBar] = useState(false);
//   const { user } = useUser();

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <SignIn />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen relative">
//       {/* Navbar */}
//       <nav className="w-full px-8 min-h-16 flex items-center justify-between border-b border-gray-200">
//         <img
//           src={assets.logo}
//           className="cursor-pointer w-32 sm:w-44"
//           alt=""
//           onClick={() => navigate("/")}
//         />
//         {/* Mobile Toggle */}
//         {sideBar ? (
//           <X
//             onClick={() => setSideBar(false)}
//             className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer hover:scale-108 active:scale-95 duration-200"
//           />
//         ) : (
//           <Menu
//             onClick={() => setSideBar(true)}
//             className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer hover:scale-108 active:scale-95 duration-200"
//           />
//         )}
//       </nav>

//       {/* Main Content */}
//       <div className="flex flex-1 w-full relative h-[calc(100vh-64px)]">
//         {/* Backdrop for Mobile */}
//         {sideBar && (
//           <div
//             onClick={() => setSideBar(false)}
//             className="sm:hidden fixed inset-0 bg-black/30 z-10"
//           ></div>
//         )}

//         <SideBar sideBar={sideBar} setSideBar={setSideBar} />

//         <div className="flex-1 bg-[#F4F7FB] overflow-auto">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;
