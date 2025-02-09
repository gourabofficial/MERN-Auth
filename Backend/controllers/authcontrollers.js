import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../model/user-model.js";


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill all the fields" });
  }


  try {
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      res.json({success:false,message:"User already exists"})
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashpassword });
    await user.save();

    const token = jwt.sign({id: user._id}, process.env.JWT_TOKEN, {expiresIn: "5d"});
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 5 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, message: "User Registered Successfully" })
  }
  
  catch (error) {
    res.json({ success: false });
    console.log(error.message);
  }


}

export const login = async (req, res) => {
  const { email, password } = req.body;
  if ( !email || !password) {
    return res.json({ success: false, message:"Email and Password are required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_TOKEN, {expiresIn: "5d"});
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 5 * 24 * 60 * 60 * 1000
    });


    return res.json({ success: true , message: "User Logged in Successfully" });


  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}


export const logout = async (req, res) => { 
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      
    })

    return res.json({ success: true, message: "Logged out Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}