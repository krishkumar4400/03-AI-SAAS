import express from "express";
// import { auth } from "../Middlewares/auth.js";
import { generateArticle, generateBlog, generateBlogTitle, generateEmail, generateImage, generateProductDescription, generateSocialCaption, removeImageBackground, removeImageObject, resumeReview, summarizeText, translateText } from "../Controllers/aiControllers.js";
import { upload } from "../Config/multer.js";

const aiRouter = express.Router();

aiRouter.post("/generate-article", generateArticle);
aiRouter.post("/generate-blog-title", generateBlogTitle);
aiRouter.post("/generate-image", generateImage);
aiRouter.post('/remove-image-background',upload.single('image'), removeImageBackground);
aiRouter.post('/remove-image-object',upload.single('image'), removeImageObject);
aiRouter.post("/summarize-text", summarizeText);
aiRouter.post("/translate-text", translateText);
aiRouter.post('/resume-review',upload.single('resume'), resumeReview);
aiRouter.post('/social-caption', generateSocialCaption);
aiRouter.post('/write-email', generateEmail);
aiRouter.post('/product-description', generateProductDescription);
aiRouter.post('/generate-blog', generateBlog);

export default aiRouter;