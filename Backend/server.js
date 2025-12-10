import express from 'express';
import cors from 'cors';
import { clerkMiddleware, requireAuth} from "@clerk/express";
import aiRouter from './Routes/aiRoutes.js'
import connectCloudinary from './Config/cloudinary.js';
import { auth } from './Middlewares/auth.js';
import userRouter from './Routes/userRoutes.js';
import connectMongoDB from './Config/mongoDB.js';
import blogRouter from './Routes/postBlog.js';

const app = express();

await connectCloudinary();
await connectMongoDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://novaiq.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "apiKey"],
    credentials: true,
  })
);

app.get('/', (req,res) => {
    res.send("hello express"); 
});

app.use("/api/ai/post", blogRouter);
app.use(clerkMiddleware());

// protected routes
app.use(requireAuth());

app.use("/api/ai", auth, aiRouter);
app.use('/api/user', userRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});