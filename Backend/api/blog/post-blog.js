import connectDB from "../../config/db.js";
import BlogModel from "../../models/Blog.js";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await connectDB();

  if (req.method === "POST") {
    try {
      const { title, subTitle, description, image, category, isPublished } =
        req.body;

      const newBlog = await BlogModel.create({
        title,
        subTitle,
        description,
        image,
        category,
        isPublished,
      });

      return res.status(200).json({
        success: true,
        message: "Blog published successfully!",
        blogURL: `/blog/${newBlog._id}`,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: "Method Not Allowed" });
}
