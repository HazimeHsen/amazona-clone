const express = require("express");
const multer = require("multer");

const uploadRouter = express.Router();

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Set up an endpoint to handle file uploads
uploadRouter.post("/", upload.single("image"), (req, res) => {
  res.send(req.file);
});
module.exports = uploadRouter;
