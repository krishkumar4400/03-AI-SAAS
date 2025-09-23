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
        <img src={assets.logo} className='cursor-pointer w-32 sm:w-44' alt="" onClick={() => naviagte("/")} />
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
    <div className='flex justify-center items-center h-screen'>
      <SignIn />
    </div>
  );
}

export default Layout
