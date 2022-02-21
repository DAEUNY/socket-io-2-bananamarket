const { User, Region } = require("../../models");
const { checkAccessToken } = require("../tokenFunction");

module.exports = async (req, res) => {
  // 회원 정보 요청
  const accessTokenData = checkAccessToken(req);
  if (!accessTokenData) {
    return res.status(401).send({ message: "Not authorized" });
  }

  const { id } = accessTokenData;

  const userData = await User.findOne({
    where: { id },
  });

  if (!userData) {
    return res.status(404).send({ message: "Not found" });
  }

  const region = await Region.findOne({
    where: {
      id: userData.region_id,
    },
  });

  const {
    name,
    email,
    profile_image_location,
    block,
    type,
    createdAt,
    updatedAt,
  } = userData;

  const userInfo = {
    userId: id,
    name,
    email,
    profileImage: profile_image_location,
    block,
    type,
    createdAt,
    updatedAt,
    region: region.dataValues.city,
  };

  res.status(200).send({ data: userInfo, message: "ok" });
};
