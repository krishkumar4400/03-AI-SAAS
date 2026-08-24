import { Router } from "express";
import { postBlog } from "../middlewares/auth.js";
import { authorizePostBlog, savePostedBlog } from "../controllers/aiControllers.js";

const blogRouter = Router();

blogRouter.post('/authorize-post', authorizePostBlog);
blogRouter.post("/save-post", postBlog, savePostedBlog);

export default blogRouter;