import React from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets.js';

const Hero = () => {

    const navigate = useNavigate();
  return (
    <div className="bg-[url(/gradientBackground.png)] bg-cover bg-center bg-no-repea px-4  sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-gray-900 text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Create amazing content
          <br /> with <span className="text-primary ">AI tools</span>
        </h1>
        <p className="mt-4 mb-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600">
          Transform your content creation with our suite of premium AI tools.
          Write articles, generate images, and enhance your workflow.
        </p>
      </div>
      <div className="flex flex-wrap text-sm max-sm:text-xs gap-4 items-center justify-center">
        <button
          onClick={() => navigate('/ai')}
          className="bg-primary rounded-lg text-white px-10 py-3 hover:scale-102 active:scale-95 transition cursor-pointer active:shadow-lime-400 shadow-sm hover:shadow-fuchsia-300"
        >
          Start creating now
        </button>
        <button className="bg-white rounded-lg text-black px-10 py-3 border border-gray-300 shadow-sm hover:shadow-fuchsia-300  hover:scale-102 active:scale-95 transition cursor-pointer active:shadow-lime-400">
          Watch demo
        </button>
      </div>
      <div className='flex items-center gap-4  mx-auto mt-8 text-gray-600'>
        <img src={assets.user_group} className='h-8' alt="user_group" /> Trusted by 100k+ people
      </div>
      
    </div>
  );
}

export default Hero
