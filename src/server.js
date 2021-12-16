const AWS = require("aws-sdk");
let express = require("express");
let multer = require("multer");
let multerS3 = require("multer-s3");
// const fs = require("fs-extra");

let app = express();

const ID = "AKIA2DSJ5A23DMUPGVSQ";
const SECRET = "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";
const BUCKET_NAME = "imagedash";
const PORT = 3000;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const params = {
  Bucket: BUCKET_NAME,
  CreateBucketConfiguration: {
    LocationConstraint: "ap-south-1"
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
    // acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        file.originalname + "-" + (Math.random() + 1).toString(36).substring(7)
      );
    }
  })
});

// app.post("/upload", (req, res) => {
//   res.send("POST req called!");
// });
app.post("/api/upload", upload.array("file", 1), (req, res, next) => {
  res.send("Successfully uploaded the file!");
  // res.send({ file: req.file });
  console.log(req.body);
  console.log(res);
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server Listening on PORT:", PORT);
});
// console.log(upload);
// s3.upload();
// const uploadFile = (fileName) => {
//   const fileContent = fs.readFileSync(fileName);
//   const params = {
//     Bucket: "imagedash",
//     Key: "package.json",
//     Body: fileContent
//   };
//   s3.upload(params, (err, data) => {
//     if (err) {
//       throw err;
//     }
//     console.log("Upload Successfull!!", data.Location);
//   });
// };

// uploadFile("../../package.json");
