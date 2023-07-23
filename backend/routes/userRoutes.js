const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const { generateToken, isAuth } = require("../utls.js");

const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      image: req.body.image,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    if (user) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
  })
);
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.image = req.body.image || user.image;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        image: updatedUser.image,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "user not found" });
    }
  })
);
userRouter.get(
  "/list",
  expressAsyncHandler(async (req, res) => {
    const user = await User.find({});
    if (user) {
      res.send(user);
      return;
    }
    res.status(401).send({ message: "There are no users" });
  })
);
userRouter.delete(
  "/delete/:id",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.deleteOne({ _id: userId });
    if (user) {
      res.send({ message: "User deleted" });
      return;
    }
    res.status(401).send({ message: "Error while delete this user" });
  })
);
userRouter.put(
  "/update/:id",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.admin || false;

      await user.save();
      res.send({ message: "Update success" });
    } else {
      res.status(404).send({ message: "user not found" });
    }
  })
);
userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.send({
        name: user.name,
        email: user.email,
      });
      return;
    }
    res.status(401).send({ message: "User not found" });
  })
);
module.exports = userRouter;
