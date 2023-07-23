const express = require("express");
const Product = require("../models/productModel.js");
const data = require("../data.js");
const User = require("../models/userModel.js");
const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Product.deleteMany({});
  const createProduct = await Product.insertMany(data.products);
  await User.deleteMany({});
  const createUser = await User.insertMany(data.users);
  res.status(200).json({ createProduct, createUser }); // send both responses in one object
});
module.exports = seedRouter;
