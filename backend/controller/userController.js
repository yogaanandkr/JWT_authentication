const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//register user   POST api/users/    public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "please enter all fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }

  // hashing and salting password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (newUser) {
    res.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
});

//login user   POST api/users/login    public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const loginUser = await User.findOne({ email });
  if (email && (await bcrypt.compare(password, loginUser.password))) {
    res.status(200).json({
      id: loginUser._id,
      name: loginUser.name,
      email: loginUser.email,
      token: generateToken(loginUser._id),
    });
  } else {
    res.status(400);
    throw new Error("error in data");
  }
});

//get user data   GET api/users/me    private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  // console.log(req.user);
  res.status(200).json({ _id: _id, name, email });
});

//GENERATE  JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
