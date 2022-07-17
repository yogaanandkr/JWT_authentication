const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //verifying token
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      //getting user from the token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (e) {
      console.log(e);
      res.status(401);
      throw new Error("not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("not authorized or no token");
  }
});

module.exports = protect;
