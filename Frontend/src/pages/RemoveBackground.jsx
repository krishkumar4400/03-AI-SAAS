import { DownloadIcon, Eraser, SkipForward, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
    const [requested, setRequested] = useState(false);
    const [clear, setClear] = useState(true);

  const { getToken } = useAuth();
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setRequested(true);
      setClear(false);
      const formData = new FormData();
      formData.append("image", input);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setContent(data.content);
        setRequested(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const downloadImage = () => {
    if (!content) return;
    const link = document.createElement("a");
    link.href = content;
    link.download = "processed-image.png"; // file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-800">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-300"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#ff6f00]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>

        <h2 className="font-xl text-gray-600 font-medium mt-7 mb-2">
          Upload Image
        </h2>
        <input
          required
          onChange={(e) => setInput(e.target.files[0])}
          accept="image/*"
          className="outline-none text-sm w-full p-2 px-3 mt-2 rounded-md border border-gray-300 text-gray-600"
          type="file"
        />
        <p className="text-gray-500 mt-4 mb-3 text-sm font-light">
          Supports JPG, PNG, and other image formats
        </p>

        <div className="text-white">
          <button
            disabled={loading}
            className="bg-gradient-to-r from-orange-400 via-red-600 to-orange-400 via-50% gap-2 w-full flex items-center justify-center rounded-lg text-white py-2 text-sm cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 my-1 border-2 border-t-transparent animate-spin rounded-full"></span>
            ) : (
              <Eraser className="w-5" />
            )}
            Remove background
          </button>
        </div>
      </form>

      {/* Right column */}
      <div className="p-4 w-full min-h-96 max-w-lg bg-white rounded-lg border border-gray-300 flex flex-col max-h-[600px]">
        <h2 className="flex items-center text-xl font-semibold gap-3 text-slate-700">
          <Eraser className="w-6 text-[#ff6f00]" />
          Processed Image
        </h2>
        {content && !clear ? (
          <div className="h-full mt-3">
            <img src={content} className="w-full h-full" alt="image" />
            {content && (
              <div className="flex justify-between text-sm px-3 gap-4">
                <span
                  onClick={() => {
                    setClear(true);
                    setContent("");
                  }}
                  className="flex items-center justify-center gap-2 text-white w-1/2 text-center bg-red-500 py-1.5 rounded-lg my-2 cursor-pointer"
                >
                  <SkipForward />
                  Clear
                </span>
                <span
                  onClick={downloadImage}
                  className=" flex items-center justify-center gap-2 text-white w-1/2 text-center bg-blue-500 py-1.5 rounded-lg my-2 cursor-pointer"
                >
                  <DownloadIcon />
                  Download
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            {requested && !content ? (
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                <span className="w-12 h-12 border-4 border-pink-600 border-t-transparent my-2 rounded-full animate-spin"></span>
                <p>Wait For Few Seconds</p>
              </div>
            ) : (
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                <Eraser className="w-9 h-9" />
                <p className="text-center">
                  Upload an image and click "Remove Background" to get started
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
