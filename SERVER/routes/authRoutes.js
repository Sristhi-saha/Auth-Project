import express from 'express';
import { isAuthenticated, login, logout, register,resetPassword,sendPasswordResetOtp,sentVerifyOtp, verifyEmail } from '../controller/auth-controller.js';
import { userAuth } from '../middelware/user-auth.js';

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/verify',userAuth,sentVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-authenticated',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendPasswordResetOtp);
authRouter.post('/reset-password',resetPassword);

export default authRouter;