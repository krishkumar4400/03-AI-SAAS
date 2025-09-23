import React from 'react'
import { AiToolsData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { LucideSquarePen } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const AiTools = () => {
    const navigate = useNavigate();
    const {user} = useUser();
  return (
    <div className="px-4 sm:px-20 xl:px-32 my-20">
      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">
          Powerful AI Tools
        </h2>
        <p className="text-gray-500  mx-auto max-w-lg ">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology
        </p>
      </div>
      <div className="flex flex-wrap mt-10 justify-center">
        {AiToolsData.map((tool, index) => (
          <div
            key={index}
            onClick={() => user && navigate(tool.path)}
            className="p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          >
            <div
              className="w-12 h-12 rounded-xl p-3 text-white flex items-center justify-center"
              style={{
                background: `linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to})`,
              }}
            >
              <tool.Icon className="w-6 h-6 flex" />
            </div>

            <h3 className="mt-6 mb-3 text-lg font-semibold"> {tool.title} </h3>
            <p className="text-gray-400 text-sm max-w-[95%]">
              {" "}
              {tool.description}{" "}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiTools
