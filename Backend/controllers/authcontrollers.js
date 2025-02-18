import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../model/user-model.js";
import transporter from "../config/nodemailer.js";


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill all the fields" });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashpassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: "5d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 5 * 24 * 60 * 60 * 1000
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our website",
      text: `Your account has been created with email id: ${email}`
    };
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "User Registered Successfully" });
  } catch (error) {
    console.log("Error during registration:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Email and Password are required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: "5d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 5 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, message: "User Logged in Successfully" });
  } catch (error) {
    console.log("Error during login:", error.message);
    return res.json({ success: false, message: error.message });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({ success: true, message: "Logged out Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req,res) => {
  try {
    const { userid } = req.body;
    const user = await UserModel.findById(userid);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "User already verified" });
    }

    const opt = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = opt;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();



    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text:`Your OTP is ${opt}. Verify your account using the OTP`
    }

    await transporter.sendMail(mailOption);


    res.json({ success: true, message: "OTP sent successfully" });


  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}
 

export const verifyEmail = async (req, res) => {
  const { userid, otp } = req.body;

  if (!userid || !otp) {
    return res.json({ success: false, message: "Messing Details" });
  }

  const user = await UserModel.findById(userid);

  try {
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });

    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }


    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
    
  } catch (error) {

    res.json({ success: false, message: error.message });
    
  }
}

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({success: true});
  } catch (error) {
    return  res.json({ success: false, message: error.message });
  }
} 


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if(!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  try {
    const user = await UserModel.findOne({ email });


    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const opt = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = opt;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();



    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text:`Your OTP is ${opt}.Use the otp to reset your password`
    }

    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "OTP sent Your Email" });


  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Email,Otp and New password Are Required" });

  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.json({ success: false, message: "User not found" });
    }

    if(user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashpassword = await bcrypt.hash(newPassword, 10);
    user.password = hashpassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    

    await user.save();

    return res.json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}