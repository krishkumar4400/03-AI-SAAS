import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (object.split(" ").length > 1) {
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
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
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
      <div className="p-4 w-full min-h-96 max-w-lg bg-white rounded-lg border border-gray-300 flex flex-col max-h-[600px]">
        <h2 className="flex items-center text-xl font-semibold gap-3 text-slate-700">
          <Scissors className="w-6 text-[#0048ff]" />
          Processed Image
        </h2>
        {content ? (
          <img src={content} className="h-full w-full mt-3" alt="image" />
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-9 h-9" />
              <p className="text-center">
                Upload an image and click "Remove Object" to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
