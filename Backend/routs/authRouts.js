import express from "express";
import { register,login,logout, sendVerifyOtp, verifyEmail, isAuthenticated, forgotPassword, resetPassword } from "../controllers/authcontrollers.js";
import userAuth from "../middleware/userAuth.js";


const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated); // post to get (i change )
authRouter.post('/send-rest-otp',forgotPassword);
authRouter.post('/reset-password',resetPassword);

export default authRouter;