import {
  AreaChartIcon,
  Edit,
  Hash,
  Pen,
  Sparkles,
  Square,
  SquarePen,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt = `Generate a blog titles for the keyword ${input} in the category ${selectedCategory}`;

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        {
          prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-300"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>

        <h2 className="font-xl text-slate-800 font-medium mt-7 mb-2">
          Keyword
        </h2>
        <input
          required
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="outline-none text-sm w-full p-2 px-3 mt-2 rounded-md border border-gray-300"
          type="text"
          placeholder="The Future of Artificial inteligence"
        />
        <h2 className="text-slate-800 font-medium mt-4 mb-3">Category</h2>

        <div className="flex gap-3 flex-wrap sm:max-w-9/11 pb-6">
          {blogCategories.map((item, index) => (
            <span
              onClick={() => setSelectedCategory(item)}
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? "bg-purple-50 border-purple-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="text-white">
          <button
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 via-rose-800 to-purple-500 via-50% gap-2 w-full flex items-center justify-center rounded-lg text-white py-2 text-sm cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
            ) : (
              <Hash className="w-5" />
            )}
            Generate title
          </button>
        </div>
      </form>

      {/* Right column */}
      <div className="p-4 w-full min-h-96 max-w-lg bg-white rounded-lg border border-gray-300 flex flex-col max-h-[600px]">
        <h2 className="flex items-center text-xl font-semibold gap-3 text-slate-700">
          <Hash className="w-6 text-[#8E37EB]" />
          Generated titles
        </h2>
        {content ? (
          <div className="h-full mt-3 overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>
                {content}
              </Markdown>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>Enter a topic and click “Generate Titles ” to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
