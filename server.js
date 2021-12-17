require("dotenv").config();

const AWS = require("aws-sdk");
let multer = require("multer");
let multerS3 = require("multer-s3");
let express = require("express");

let app = express();

const s3 = new AWS.S3({
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET
});

const params = {
  Bucket: process.env.BUCKET_NAME,
  CreateBucketConfiguration: {
    LocationConstraint: process.env.REGION
  }
};

let upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/octet-stream" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/svg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  storage: multerS3({
    s3: s3,
    bucket: "imagedash",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        file.originalname + "-" + (Math.random() + 1).toString(36).substring(2)
      );
    }
  })
});

app.post("/api/upload", upload.array("file", 1), (req, res, next) => {
  res.send("Successfully uploaded the file!");
  console.log(req.body);
  console.log(res);
});

app.listen(process.env.PORT, function (err) {
  if (err) console.log(err);
  console.log("Server Listening on PORT:", process.env.PORT);
});