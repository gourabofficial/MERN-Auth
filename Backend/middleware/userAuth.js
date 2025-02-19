import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    console.log("Token not found in cookies");
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_TOKEN);

    if (tokenDecode.id) {
      req.body.userid = tokenDecode.id;
      next();
    } else {
      console.log("Token verification failed");
      return res.json({ success: false, message: "Not Authorized, Login Again" });
    }
  } catch (error) {
    console.log("Error during token verification:", error.message);
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }
};

export default userAuth;