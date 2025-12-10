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
import { useAppContext } from "../context/AppContext";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateBlog = () => {
  const [title, setTitle] = useState("");
  const [isPublished, setIsPublished] = useState("");
  const [adding, isAdding] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [blogURL, setBlogURL] = useState("");
  const { getToken } = useAuth();
  const {token, navigate} = useAppContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!title) {
        return toast.error("Please enter a title");
      }

      setLoading(true);

      const { data } = await axios.post(
        "/api/ai/generate-blog",
        {
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setContent(data.blog);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const publishBlogHandler = async () => {
    try {
      setIsPublished(true);
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/blog/post-blog",
        {
          title,
          subTitle: content.subTitle,
          description: content.description,
          image: content.image,
          category: content.category,
          isPublished: true,
        }
      );
      if (data.success) {
        toast.success(data.message);
        setBlogURL(data.blogURL);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const savePostedBlog = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_BASE_URL_LIVE + "/api/ai/post/save-post",
        { content, title }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    } catch (error) {
      console.log(error.message);
    }
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
          <h1 className="text-xl font-semibold">AI Blog Generator</h1>
        </div>

        <h2 className="font-xl text-slate-800 font-medium mt-7 mb-2">
          Input Subject
        </h2>
        <input
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="outline-none text-sm w-full p-2 px-3 mt-2 rounded-md border border-gray-300"
          type="text"
          placeholder="Enter your title to generate blog by intelligent AI models"
        />

        <div className="text-white">
          <button
            disabled={loading}
            className="bg-gradient-to-r mt-4 from-cyan-500 via-rose-800 to-purple-500 via-50% gap-2 w-full flex items-center justify-center rounded-lg text-white py-2 text-sm cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
            ) : (
              <Hash className="w-5" />
            )}
            Generate Blog
          </button>
        </div>
      </form>

      {/* Right column */}
      <div className="p-4 relative w-full min-h-96 max-w-lg bg-white rounded-lg border border-gray-300 flex flex-col max-h-[600px]">
        <h2 className="flex items-center text-xl font-semibold gap-3 text-slate-700">
          <Hash className="w-6 text-[#8E37EB]" />
          Generated Blog
        </h2>
        {content ? (
          <div className="h-full mt-3 overflow-y-scroll text-sm text-slate-600">
            <div className="max-w-sm mx-auto">
              <img src={content.image} className="w-full h-auto rounded-lg" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 py-2">
              {title}
            </h2>
            <h3 className="text-lg font-semibold text-gray-700 pb-2">
              {content.subTitle}
            </h3>
            <div className="reset-tw">
              <Markdown>{content.description}</Markdown>
            </div>
            <p className="text-sm text-gray-600 py-3">{content.category}</p>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>
                Enter your details and click " Generate Blog ” to get started
              </p>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 right-2">
          <button
            onClick={async () => {
              if (token) {
                await publishBlogHandler();
                await savePostedBlog();
              } else {
                navigate("/post/login");
              }
            }}
            className="rounded border-0 bg-green-600 px-4 py-2 font-medium hover:scale-105 active:scale-95 duration-150 text-white"
          >
            Publish
          </button>
        </div>
        <div>
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default GenerateBlog;
