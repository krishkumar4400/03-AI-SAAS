import { clerkClient } from "@clerk/express";
import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth(); // ✅ object hai, function nahi
    const hasPremiumPlan = await has({plan: 'premium'});
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No userId found",
      });
    }

    const user = await clerkClient.users.getUser(userId);

    if(!user) {
      return res.json({
        message: "Unauthorized: No user found",
        success: false
      });
    }

    if(!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0
        }
      });
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? 'premium' : 'free';
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const postBlog = async(req,res,next) => {
  try {
    const token = req.headers.authorization;
    if(!token) {
      return res.json({
        message: "No token provided",
        success: false 
      });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    next();

  } catch (error) {
    console.log(error.message);
    return res.json({
      message: "Not authorized Login again",
      success: false 
    });
  }
}
