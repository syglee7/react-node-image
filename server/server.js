const express = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const mongoose = require("mongoose");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid file type"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});
const app = express();
const PORT = 5001;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("mongodb connect");
    app.use("/uploads", express.static("uploads"));

    app.post("/upload", upload.single("image"), (req, res) => {
      console.log(req.file);
      res.json(req.file);
    });

    app.listen(PORT, () =>
      console.log(`Express server listening on PORT ${PORT}`)
    );
  })
  .catch(console.err);
