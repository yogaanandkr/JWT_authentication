const asyncHandler = require("express-async-handler");
const { findById } = require("../models/goalModel");
const Goal = require("../models/goalModel");
const User = require("../models/userModel");

// get goals      GET/api/goals    private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
});

// post goals      POST/api/goals    private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("please add some text field");
  }

  const newGoal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  });
  res.status(200).json({ newGoal });
});

// update goals      PUT/api/goals/:id    private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error("goal not found");
  }

  const user = await User.findById(req.user.id);

  //check for user
  if (!user) {
    res.status(401);
    throw new Error("user not found");
  }

  // make sure the logged in user matches goal user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }
  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  console.log(updatedGoal);
  res.status(200).json({ updatedGoal });
});

// delete goals      DELETE/api/goals:id    private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("goal not found");
  }
  const user = await User.findById(req.user.id);

  //check for user
  if (!user) {
    res.status(401);
    throw new Error("user not found");
  }

  // make sure the logged in user matches goal user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }

  await goal.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
