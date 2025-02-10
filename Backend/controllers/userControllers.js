import UserModel from "../model/user-model.js";
 

export const getUserData = async (req, res) => {
  try {

    const { userid } = req.body;
    const user = await UserModel.findById(userid);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({
      success: true, 
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified
      }
     });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
  
}