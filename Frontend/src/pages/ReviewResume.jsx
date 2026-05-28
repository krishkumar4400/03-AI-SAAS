import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

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
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        <h2 className="font-xl text-gray-600 font-medium mt-7 mb-2">
          Upload Resume
        </h2>
        <input
          required
          onChange={(e) => setInput(e.target.files[0])}
          accept="application/pdf"
          className="outline-none text-sm w-full p-2 px-3 mt-2 rounded-md border border-gray-300 text-gray-600 cursor-pointer"
          type="file"
        />
        <p className="text-gray-500 font-light mt-1.5 mb-6 text-sm">
          Supports PDF Resume Only
        </p>

        <div className="text-white">
          <button
            disabled={loading}
            className="bg-gradient-to-r from-[#00c777] via-[#2db300] to-[#009bb3] gap-2 w-full flex items-center justify-center rounded-lg text-white py-2 text-sm cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 mt-1 border-2 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <FileText className="w-5" />
            )}
            Review Resume
          </button>
        </div>
      </form>

      {/* Right column */}
      <div className="p-4 w-full min-h-96 max-w-lg bg-white rounded-lg border border-gray-300 flex flex-col max-h-[600px]">
        <h2 className="flex items-center text-xl font-semibold gap-3 text-slate-700">
          <FileText className="w-6 text-[#00DA83]" />
          Analysis Results
        </h2>
        {content ? (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="w-9 h-9" />
              <p className="text-center">
                Upload your resume and click "Review Resume" to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
