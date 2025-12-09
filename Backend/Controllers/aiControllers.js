import { v2 as cloudinary } from "cloudinary";
import OpenAI from "openai";
import sql from "../Config/connectDB.js";
import { clerkClient } from "@clerk/express";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import axios from "axios";
import FormData from "form-data";
import { GoogleGenAI } from "@google/genai";

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
        headers: { "x-api-key": process.env.CLIP_DROP_API_KEY },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image, {
      resource_type: "image",
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
      message: error.message,
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
      message: error.message,
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

export const summarizeText = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input, type } = req.body;
    const plan = req.plan;
    if (!userId) {
      return res.json({
        message: "not authorized login again",
        success: false,
      });
    }

    if (!input) {
      return res.json({
        message: "please enter the text and try again",
        success: false,
      });
    }

    if (plan != "premium") {
      return res.json({
        message: "This feature is only available for premium subscriptions",
        success: false,
      });
    }

    const prompt = `
You are an expert summarizer. Summarize the following text in a ${type} format.

Guidelines:
- Short: 2–4 sentences
- Medium: 6–10 sentences
- Long: Produce a detailed summary of 2–4 paragraphs (200–400 words). 
  Do NOT shorten aggressively. Expand key insights.
- Bullets: 5–10 bullet points
- Always preserve meaning and avoid adding fake information.

Text:
${input}

Summary:
`;

    let maxOutputTokens = 200; //default
    if (type.toLowerCase() === "short") maxToken = 80;
    if (type.toLowerCase() === "medium") maxToken = 150;
    if (type.toLowerCase() === "long") maxToken = 1300;
    if (type.toLowerCase() === "bullets") maxToken = 200;

    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY2 });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      generationConfig: {
        maxOutputTokens,
        temperature: 0,
      },
    });
    const content = response.text;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${content}, 'text-summarization')`;

    return res.json({
      content,
      message: "summarized your text!.",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "try again",
      success: false,
    });
  }
};

export const translateText = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input, targetLanguage, tone } = req.body;
    const plan = req.plan;

    if (!userId) {
      return res.json({
        message: "not authorized login again",
        success: false,
      });
    }

    if (!input) {
      return res.json({
        message: "please enter the text and try again",
        success: false,
      });
    }

    if (!targetLanguage) {
      return res.json({
        message: "Target language not selected",
        success: false,
      });
    }

    if (!tone) {
      return res.json({
        message: "Please select a tone",
        success: false,
      });
    }

    if (plan != "premium") {
      return res.json({
        message: "This feature is only available for premium subscriptions",
        success: false,
      });
    }

    const prompt = `
You are a professional translator.

Translate the following text
to ${targetLanguage}. 

Tone: ${tone || "neutral"}

Rules:
- Preserve the original meaning.
- Keep grammar and style natural for the target language.
- If the text contains names, brand names, or code do not translate them.
- Do not explain the translation.
- Provide only the translated text.

Text:
${input}

Translated Output:

`;

    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY2 });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 500,
      },
    });
    const translated = response.text;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${translated}, 'language-translation')`;

    return res.json({
      translation: translated,
      message: "Translation completed",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "try again",
      success: false,
    });
  }
};

export const generateSocialCaption = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { topic, platform, tone } = req.body;
    const plan = req.plan;

    if (!userId) {
      return res.json({
        message: "not authorized login again",
        success: false,
      });
    }

    if (!topic) {
      return res.json({
        message: "please enter the topic and try again",
        success: false,
      });
    }

    if (!platform) {
      return res.json({
        message: "Please select a platform and try again",
        success: false,
      });
    }

    if (!tone) {
      return res.json({
        message: "Please select a tone and try again",
        success: false,
      });
    }

    if (plan != "premium") {
      return res.json({
        message: "This feature is only available for premium subscriptions",
        success: false,
      });
    }

    const prompt = `
You are a professional social media content creator.

Generate a high-quality caption for the following platform: ${platform}.
Topic: ${topic}
Tone/style: ${tone}

Rules:
- Sound natural and engaging.
- Keep it platform-appropriate.
- Add relevant hashtags (5–10) unless the user says otherwise.
- Do NOT add explanations.
- Provide ONLY the caption.

Caption:


`;

    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY2 });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 300,
      },
    });
    const caption = response.text;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${caption}, 'social caption')`;

    return res.json({
      caption,
      message: "Caption Generated",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "try again",
      success: false,
    });
  }
};

export const generateEmail = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { subject, details, tone, emailType } = req.body;
    const plan = req.plan;

    if (!userId) {
      return res.json({
        message: "not authorized login again",
        success: false,
      });
    }

    if (!subject) {
      return res.json({
        message: "please enter the subject and try again",
        success: false,
      });
    }

    if (!details) {
      return res.json({
        message: "Please enter the details and try again",
        success: false,
      });
    }

    if (!tone) {
      return res.json({
        message: "Please select a tone and try again",
        success: false,
      });
    }

    if (!emailType) {
      return res.json({
        message: "Please select the Email type and try again",
        success: false,
      });
    }

    if (plan != "premium") {
      return res.json({
        message: "This feature is only available for premium subscriptions",
        success: false,
      });
    }

    const prompt = `
You are a professional email writer.

Write an email based on the following details:

Email Type: ${emailType}
Tone: ${tone}
Subject or Purpose: ${subject || purpose}

Additional details:
${details}

Rules:
- Keep the email natural, clear, and professional.
- Format properly with greeting, body, and closing.
- Do NOT include explanations.
- Do NOT add meta text like “Here is your email”.
- Provide ONLY the email text.

Email:


`;

    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY2 });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 300,
      },
    });
    const emailText = response.text;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES(${userId}, ${prompt}, ${emailText}, 'email-writer')`;

    return res.json({
      email: emailText,
      message: "Email generated successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "try again later",
      success: false,
    });
  }
};
