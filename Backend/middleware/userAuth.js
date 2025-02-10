import jwt from "jsonwebtoken";

const userAuth = async (req, res,next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_TOKEN);

    if (tokenDecode) {
      req.body.userid = tokenDecode.id;
    } else {
      return res.json({ success: false, message: "Not Authorized, Login Again"});
    }
    next();


    
  } catch (error) {
    return res.json({ success: false, message: error
    });
  }
}
 
export default userAuth;