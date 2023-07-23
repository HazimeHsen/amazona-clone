const express = require("express");
const Product = require("../models/productModel.js");
const expressAsyncHandler = require("express-async-handler");
const { isAuth } = require("../utls.js");
const mongoose = require("mongoose");

const productRouter = express.Router();

productRouter.get("/search", async (req, res) => {
  const { query } = req;
  console.log(query.query);

  const regex = new RegExp(query.query, "i");
  const products = await Product.find({ name: regex });

  if (query.query == null) {
    const products = await Product.find();
    res.send({ products });
  } // "i" flag makes the search case-insensitive

  console.log(products);
  res.send({ products });
});

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});
productRouter.put(
  "/review/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      const day = ("0" + currentDate.getDate()).slice(-2);
      const hours = ("0" + currentDate.getHours()).slice(-2);
      const min = ("0" + currentDate.getMinutes()).slice(-2);
      const sec = ("0" + currentDate.getSeconds()).slice(-2);

      const fullDate = `${year}-${month}-${day}:${hours}:${min}:${sec}`;
      const hoursDate = `${hours}:${min}:${sec}`;
      const review = {
        name: req.user.name,
        user: req.user._id,
        comment: req.body.comment,
        rating: req.body.stars,
        createdAt: fullDate,
        hours: hoursDate,
      };
      product.review.push(review);
      product.numReviews = product.review.length;
      product.rating =
        product.review.reduce((a, c) => a + c.rating, 0) /
        product.review.length;
      const rev = await product.save();
      res.send(rev);
      return;
    }
    res.send({ message: "review error" });
  })
);

productRouter.post(
  "/create",
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: req.body.name,
      slug: req.body.slug,
      image: req.body.image,
      price: req.body.price,
      category: req.body.category,
      brand: req.body.brand,
      countInStock: req.body.countInStock,
      rating: 0,
      numReviews: 0,
      description: req.body.description,
    });
    const product = await newProduct.save();
    res.send({ message: "Product Created", product });
  })
);
productRouter.put(
  "/edit/:id",
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      (product.name = req.body.name),
        (product.slug = req.body.slug),
        (product.image = req.body.image),
        (product.price = req.body.price),
        (product.category = req.body.category),
        (product.brand = req.body.brand),
        (product.countInStock = req.body.countInStock),
        (product.description = req.body.description),
        await product.save();
      res.send({ message: "Edit success" });
    } else {
      res.status(404).send({ message: "product not found" });
    }
  })
);
productRouter.delete(
  "/delete/:id",
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.deleteOne({ _id: productId });
    if (product) {
      res.send({ message: "product deleted" });
      return;
    }
    res.status(401).send({ message: "Error while delete this product" });
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

productRouter.post("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    if (
      product.review.find((x) =>
        x.user.equals(new mongoose.Types.ObjectId(req.body.userId))
      )
    ) {
      res.send({ product, haveReview: true });
      return;
    }
    res.send({ product, haveReview: false });
  } else {
    res.status(404).send({ message: "product not found" });
  }
});
productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "product not found" });
  }
});

module.exports = productRouter;
