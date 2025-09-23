import React from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const NavBar = () => {
    const navigate = useNavigate();
    const {user} = useUser();
    const {openSignIn} = useClerk();
  return (
    <div className="fixed bg-gradient-to-b from-violet-400 z-5 backdrop:blur-2xl pt-5 px-8 sm:px-20 xl:px-32 flex items-center justify-between w-full">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="w-35 sm:w-45 cursor-pointer"
      />
      {user ? (
        <UserButton />
      ) : (
        <button onClick={openSignIn} className="px-10 py-2.5 text-white text-sm rounded-full bg-primary flex items-center gap-2 cursor-pointer">
          Get Started <ArrowRight className="w-4 h-4" />{" "}
        </button>
      )}
    </div>
  );
}

export default NavBar
