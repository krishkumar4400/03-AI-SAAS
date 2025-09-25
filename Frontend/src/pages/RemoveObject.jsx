import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Download, DownloadIcon, Scissors, SkipBack, SkipForward, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
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
      if (object.split(" ").length > 1) {
        setLoading(false);
        return toast("Please enter only one object name");
      }
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
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
          <Sparkles className="w-6 text-[#0048ff]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>

        <h2 className="font-xl text-gray-600 font-medium mt-7 mb-2">
          Upload Image
        </h2>
        <input
          required
          onChange={(e) => setInput(e.target.files[0])}
          accept="image/*"
          className="outline-none text-sm w-full p-2 px-3 mt-2 rounded-md border border-gray-300 text-gray-600 cursor-pointer"
          type="file"
        />
        <p className="text-gray-600 font-medium mt-6 mb-2 text-sm">
          Describe object name to remove
        </p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          className="w-full text-gray-500 border border-gray-300 rounded-md p-2 text-sm outline-0"
          placeholder="e.g., car in background, tree from the image, Only single object name"
          rows={5}
          required
        ></textarea>

        <div className="text-white">
          <button
            disabled={loading}
            className="bg-gradient-to-r from-blue-700 to-purple-700 gap-2 w-full flex items-center justify-center rounded-lg text-white py-2 text-sm cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Scissors className="w-5" />
            )}
            Remove object
          </button>
        </div>
      </form>

      {/* Right column */}
      <div className="p-4 w-full min-h-96 max-w-lg bg-white rounded-lg border border-gray-300 flex flex-col max-h-[600px] overflow-y-auto">
        <h2 className="flex items-center text-xl font-semibold gap-3 text-slate-700">
          <Scissors className="w-6 text-[#0048ff]" />
          Processed Image
        </h2>
        {content && !clear ? (
          <>
            <img src={content} className="h-full w-full mt-3" alt="image" />
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
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            {requested && !content ? (
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                <span className="w-12 h-12 border-4 border-pink-600 border-t-transparent my-2 rounded-full animate-spin"></span>
                <p>Wait For Few Seconds</p>
              </div>
            ) : (
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                <Scissors className="w-9 h-9" />
                <p className="text-center">
                  Upload an image and click "Remove Object" to get started
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
