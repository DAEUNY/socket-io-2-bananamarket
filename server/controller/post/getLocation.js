const { User, Region } = require("../../models");
const { checkAccessToken } = require("../tokenFunction");

module.exports = async (req, res) => {
  // 사용자 지역 정보 요청
  const accessTokenData = checkAccessToken(req);
  if (!accessTokenData) {
    return res.status(401).send("Not authorized");
  }

  const { id } = accessTokenData;

  const userData = await User.findOne({
    where: { id },
  });

  const { region_id } = userData.dataValues;

  Region.findOne({
    where: {
      id: region_id,
    },
  })
    .then((regionData) => {
      res.status(200).send({
        data: {
          region: regionData.dataValues.city,
        },
        message: "ok",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Internal server error" });
    });
};
