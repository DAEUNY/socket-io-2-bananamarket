const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "ap-northeast-2",
});

const deleteProfileImage = (params) => {
  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log(err);
      return null;
    } else {
      return data;
    }
  });
};

module.exports = deleteProfileImage;
