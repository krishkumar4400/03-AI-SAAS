import { Router } from "express";
import { postBlog } from "../Middlewares/auth.js";
import { authorizePostBlog, savePostedBlog } from "../Controllers/aiControllers.js";

const blogRouter = Router();

blogRouter.post('/authorize-post', authorizePostBlog);
blogRouter.post("/save-post", postBlog, savePostedBlog);

export default blogRouter;