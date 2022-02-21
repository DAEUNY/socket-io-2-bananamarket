const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const aws = require("aws-sdk");
const sharp = require("sharp");
// aws.config.loadFromPath(__dirname + "/../config/s3.json");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "ap-northeast-2",
});

//  이미지 사이즈는 최대 2MB로 제한
const maxSize = 2 * 1024 * 1024;

// 이미지 타입이 아닌 것은 제한한다.
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload image", 400), false);
  }
};

const profileImageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "banana-profile-img",
    acl: "public-read",
    limits: {
      fileSize: maxSize,
      files: 1,
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [
      {
        id: "resized",
        key: function (req, file, cb) {
          cb(null, Date.now() + "." + file.originalname.split(".").pop());
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(200, 200));
        },
      },
    ],
  }),
  fileFilter: multerFilter,
});

module.exports = profileImageUpload;
