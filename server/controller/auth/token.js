const {
  checkRefreshToken,
  sendAccessToken,
  generateAccessToken,
} = require("../tokenFunction");
const { User } = require("../../models");

module.exports = async (req, res) => {
  // refresh token으로 access token 재발급

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).send({ message: "refresh token not provided" });
  }

  const refreshTokenData = checkRefreshToken(req);
  if (!refreshTokenData) {
    return res.status(401).send({ message: "Not authorized" });
  }

  const userId = refreshTokenData.id;
  // console.log(userId);
  User.findOne({
    where: {
      id: userId,
    },
  })
    .then((userData) => {
      if (!userData) {
        return res.status(404).send({ message: "Not found" });
      }

      delete userData.dataValues.password;
      const newAccessToken = generateAccessToken(userData.dataValues);
      sendAccessToken(res, newAccessToken);
      return res.status(201).send({ message: "ok" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Internal server error");
    });
};
