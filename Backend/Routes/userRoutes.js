import express from 'express';
import { auth } from '../Middlewares/auth.js';
import { getPublishedCreations, getUserCreations, toggleLikeCreation } from '../Controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/get-user-creations', auth, getUserCreations);
userRouter.get('/get-published-creations', auth, getPublishedCreations);
userRouter.post('/toggle-like-creations', auth, toggleLikeCreation);

export default userRouter;