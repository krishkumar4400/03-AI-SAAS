import express from 'express';
import cors from 'cors';
import { clerkMiddleware, requireAuth} from "@clerk/express";
import aiRouter from './Routes/aiRoutes.js'
import connectCloudinary from './Config/cloudinary.js';
import { auth } from './Middlewares/auth.js';
import userRouter from './Routes/userRoutes.js';

const app = express();

await connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors({credentials: true}));

app.get('/', (req,res) => {
    res.send("hello express"); 
});

app.use(clerkMiddleware());

// protected routes
app.use(requireAuth());

app.use("/api/ai", auth, aiRouter);
app.use('/api/user', userRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});