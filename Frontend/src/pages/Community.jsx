import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setCreations(data.publishedCreations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creations",
        { id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCreations();
      } else {
        toast.error(data.message);
        fetchCreations();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return !loading ?  (
    <motion.div
      key={creations.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative group inline-block pl-3 pt-3 w-full"
    >
      <div className="flex-3 h-full flex flex-col gap-4 p-6">
        Creations
        <div className="bg-white h-full w-full rounded-xl overflow-y-scroll no-scrollbar p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {creations.map((creation, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden"
            >
              <img
                src={creation.content}
                alt=""
                className="w-full min-h-60 object-cover rounded-lg"
              />

              <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition bg-gradient-to-b from-transparent to-black/70 text-white">
                <p className="text-sm">{creation.prompt}</p>
                <div className="flex gap-1 items-center">
                  <p className="text-sm">{creation.likes.length}</p>
                  <Heart
                    onClick={() => imageLikeToggle(creation.id)}
                    className={`w-5 h-5 cursor-pointer ${
                      creation.likes.includes(user.id)
                        ? "fill-red-500 text-red-600"
                        : "text-white"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  ) : <div className="flex justify-center items-center h-full">
    <span className="w-10 h-10 my-1 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
  </div>
};

export default Community;
