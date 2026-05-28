import { DownloadIcon, Image, Pen, SkipForward, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli Style",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
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
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        {
          prompt,
          publish,
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
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-300"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00ff1e]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>

        <h2 className="font-xl text-slate-800 font-medium mt-7 mb-2">
          Describe Your Image
        </h2>
        <textarea
          rows={5}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          className="outline-none text-sm w-full p-2 px-3 mt-2 rounded-md border border-gray-300"
          type="text"
          required
          placeholder="Describe what you want to see in the image.."
        />
        <h2 className="text-slate-800 font-medium mt-4 mb-3">Style</h2>

        <div className="flex gap-3 flex-wrap sm:max-w-9/11 pb-6">
          {imageStyle.map((item, index) => (
            <span
              onClick={() => setSelectedStyle(item)}
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? "bg-green-50 border-green-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
            />
            <div className="w-12 h-6 bg-slate-300 rounded-full peer-checked:bg-green-500 transition duration-300 ease-in-out"></div>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition duration-300 ease-in-out  peer-checked:translate-x-6"></span>
          </label>
          <p className="text-sm">Make this image Public</p>
        </div>

        <div className="text-white">
          <button
            disabled={loading}
            className="bg-gradient-to-r from-green-500 via-blue-700 to-rose-500 via-50% gap-2 w-full flex items-center justify-center rounded-lg text-white py-2 text-sm cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 mt-1 border-2 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Image className="w-5" />
            )}
            Style
          </button>
        </div>
      </form>

      {/* Right column */}
      <div className="p-4 w-full min-h-96 max-w-lg bg-white rounded-lg border border-gray-300 flex flex-col max-h-[600px]">
        <h2 className="flex items-center text-xl font-semibold gap-3 text-slate-700">
          <Image className="w-6 text-[#00ff1e]" />
          Generated image
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
                <Image className="w-9 h-9" />
                <p>Enter a topic and click “Generate Titles ” to get started</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
