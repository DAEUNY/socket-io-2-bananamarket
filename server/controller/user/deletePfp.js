const { checkAccessToken } = require("../tokenFunction");
const { User } = require("../../models");
const deleteProfileImage = require("../../modules/multerDeletePfp");

module.exports = async (req, res) => {
  const accessTokenData = checkAccessToken(req);
  if (!accessTokenData) {
    return res.status(401).send("Not authorized");
  }

  const { id } = accessTokenData;

  User.findOne({
    where: { id },
  }).then((userData) => {
    if (!userData) {
      return res.status(404).send({ message: "No user info" });
    }
    if (!userData.dataValues.profile_image_key) {
      return res.status(404).send({ message: "No profile image" });
    }

    const imageKey = userData.dataValues.profile_image_key;
    const params = {
      Bucket: "banana-profile-img",
      Key: imageKey,
    };

    deleteProfileImage(params);
    User.update(
      {
        profile_image_key: null,
        profile_image_location: null,
      },
      { where: { id } }
    ).catch((err) => {
      return res.status(500).send({ message: "Internal server error" });
    });
    return res.status(200).send({ message: "ok" });
  });
};
