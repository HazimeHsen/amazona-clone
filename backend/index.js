const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const seedRouter = require("./routes/seedRoutes.js");
const productRouter = require("./routes/productRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const uploadRouter = require("./routes/uploadRoutes.js");
const cors = require("cors");
const app = express();
const path = require("path");

dotenv.config();
const port = 5000;

app.use(express.json());
app.use(
  cors({
    origin: "*", // specify a specific origin or an array of origins
  })
);
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect("mongodb+srv://form:hazime18@cluster0.u2wuoj0.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
app.use("/api/products", productRouter);
app.use("/api/seed", seedRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRouter);
app.use("/image", express.static(path.join(__dirname, "public/images")));

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});
