import express from "express";
import { register,login,logout, sendVerifyOtp, verifyEmail, isAuthenticated, forgotPassword, resetPassword } from "../controllers/authcontrollers.js";
import userAuth from "../middleware/userAuth.js";


const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-auth', userAuth, (req, res, next) => {
  try {
    isAuthenticated(req, res, next);
  } catch (error) {
    res.status(500).json({ success: false, message: "Authentication failed" });
  }
});
authRouter.post('/send-reset-otp',forgotPassword);
authRouter.post('/reset-password',resetPassword);

export default authRouter;