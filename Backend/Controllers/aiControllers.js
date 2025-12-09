import { v2 as cloudinary } from "cloudinary";
import OpenAI from "openai";
import sql from "../Config/connectDB.js";
import { clerkClient } from "@clerk/express";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import axios from 'axios';
import FormData from 'form-data';

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = await req.auth(); // this auth will be added using the clerk middleware
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan != "premium" && free_usage >= 10) {
      return res.json({
        message: "Limit reached. Upgrade to continue",
        success: false,
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });
    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({
      content,
      message: "Article Generated Successfully",
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    res.json({
      message: error.message,
      success: false,
    });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth(); // this auth will be added using the clerk middleware
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan != "premium" && free_usage >= 10) {
      return res.json({
        message: "Limit reached. Upgrade to continue",
        success: false,
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });
    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    return res.json({
      content,
      message: "Title Generated Successfully",
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message,
      success: false,
    });
  }
};

export const generateImage = async (req, res) => {

  try {
    const { userId } = req.auth(); // this auth will be added using the clerk middleware
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan != "premium") {
      return res.json({
        message: "This feature is only available for premium subscriptions",
        success: false,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIP_DROP_API_KEY},
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image, {
      resource_type: "image"
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type, publish) VALUES(${userId}, ${prompt}, ${secure_url}, 'image', ${
      publish ? true : false
    })`;

    res.json({
      content: secure_url,
      message: "Image Generated Successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.json({
      message: error.message,
      success: false,
    });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth(); // this auth will be added using the clerk middleware
    const image = req.file;
    const plan = req.plan;

    if (plan != "premium") {
      return res.json({
        message: "This feature is only available for premium subscriptions",
        success: false,
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, 'Remove background from the image', ${secure_url}, 'image')`;

    res.json({
      content: secure_url,
      message: "Background Removed Successfully",
      success: true,
    });
  } catch (error) {
    res.json({
      content: secure_url,
      success: false,
    });
  }
};
export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth(); // this auth will be added using the clerk middleware
    const image = req.file;
    const plan = req.plan;
    const { object } = req.body;

    if (plan != "premium") {
      return res.json({
        message: "This feature is only available for premium subscriptions",
        success: false,
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = await cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

    res.json({
      content: imageUrl,
      message: "Object Removed Successfully",
      success: true,
    });
  } catch (error) {
    res.json({
      content: secure_url,
      success: false,
    });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth(); // this auth will be added using the clerk middleware
    const resume = req.file;
    const plan = req.plan;

    if (plan != "premium") {
      return res.json({
        message: "This feature is only available for premium subscriptions",
        success: false,
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        message: "Resume file size exceeds allowed size (5MB). ",
        success: false,
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weeknesses, and areas for improvment. Resume Content:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, ${"Review the uploaded resume"}, ${content}, 'resume-review')`;

    return res.json({
      content,
      message: "We’ve reviewed your resume! Check out the feedback.",
      success: true,
    });
  } catch (error) {
    res.json({
      content: error.message,
      success: false,
    });
  }
};
