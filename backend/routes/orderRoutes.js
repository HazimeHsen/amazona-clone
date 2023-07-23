const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const Order = require("../models/orederModel.js");
const Product = require("../models/productModel.js");
const User = require("../models/userModel.js");
const { generateToken, isAuth } = require("../utls.js");
const stripe = require("stripe")(
  "sk_test_51MzO2YKh2d1GhWEbh828l6rjpw4YC2P1uz7Viae2S24vWBzhTaw8S963dpxhHwAfOZm1HCJykSWvX88jGxJwymzT006lW5xkI3"
);

const orderRouter = express.Router();

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: "new order created", order });
  })
);
orderRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name");
    if (orders) {
      res.status(201).send(orders);
      return;
    }
    res.status(201).send({ message: "No orders found" });
  })
);
orderRouter.get(
  "/summary",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find();
    const orders = await Order.find();
    const users = await User.find();
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ orders, products, users, dailyOrders, productCategories });
  })
);
orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.find({ user: req.user._id });
    res.send(order);
  })
);
orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "order not found" });
    }
  })
);

orderRouter.post(
  "/stripe/:id",
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id);

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: order.orderItems.map((item) => {
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.name,
              },
              unit_amount: Math.ceil(
                (item.price +
                  item.price * 0.15 +
                  (order.shippingPrice ? order.shippingPrice : 0)) *
                  100
              ),
            },
            quantity: item.quantity,
          };
        }),
        success_url: `http://localhost:3000/order/${id}?success=true`,
        cancel_url: `http://localhost:3000/order/${id}?success=false`,
      });
      await order.save();
      res.send({ url: session.url, order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
);
orderRouter.post(
  "/success/:id",
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      await order.save();
      res.send({ message: "Order updated" });
      return;
    }
    res.status(401).send({ message: "Error while update this Order" });
  })
);
orderRouter.delete(
  "/delete/:id",
  expressAsyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.deleteOne({ _id: orderId });
    if (order) {
      res.send({ message: "Order deleted" });
      return;
    }
    res.status(401).send({ message: "Error while delete this Order" });
  })
);

module.exports = orderRouter;
