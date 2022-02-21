const { User } = require("../../models");
const { checkAccessToken } = require("../tokenFunction");
const profileImageUpload = require("../../modules/multerUploadPfp");
const deleteProfileImage = require("../../modules/multerDeletePfp");
const profileImage = profileImageUpload.single("profileImage");

module.exports = async (req, res) => {
  // 프로필 사진 업로드 및 수정
  const accessTokenData = checkAccessToken(req);
  if (!accessTokenData) {
    return res.status(401).send({ message: "Not authorized" });
  }

  const { id } = accessTokenData;

  const userData = await User.findOne({
    where: { id },
  });

  // 사용자가 설정한 다른 이미지가 있다면 그 이미지를 삭제한 후 업로드를 한다.
  if (userData.dataValues.profile_image_key) {
    const params = {
      Bucket: "banana-profile-img",
      Key: userData.dataValues.profile_image_key,
    };
    deleteProfileImage(params);
  }

  profileImage(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: "Fail upload" });
    }

    if (!req.file) {
      return res.status(404).send("Not found image");
    }

    const { location, key } = req.file.transforms[0];

    User.update(
      {
        profile_image_location: location,
        profile_image_key: key,
      },
      {
        where: { id },
      }
    )
      .then(() => {
        return res.status(201).send({
          data: {
            profileImage: location,
          },
          message: "ok",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send("Internal server error");
      });
  });
};
