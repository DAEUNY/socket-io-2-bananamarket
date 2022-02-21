const { User, Region } = require("../../models");
const {
  checkAccessToken,
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../tokenFunction");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  // 회원 정보 수정
  // => 회원 정보 수정 시 토큰 안의 회원 정보도 수정해주어야 한다.
  const accessTokenData = checkAccessToken(req);
  if (!accessTokenData) {
    return res.status(401).send({ message: "Not authorized" });
  }

  const { name, password, region } = req.body;
  if (!name && !password && !region) {
    return res.status(400).send({ message: "Nothing to modify" });
  }

  const { id } = accessTokenData;
  if (name) {
    User.update({ name }, { where: { id } }).catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Internal server error" });
    });
  }

  if (region) {
    Region.findOne({
      where: { city: region },
    }).then((regionData) => {
      User.update(
        { region_id: regionData.dataValues.id },
        { where: { id } }
      ).catch((err) => {
        console.log(err);
        return res.status(500).send({ message: "Internal server error" });
      });
    });
  }

  if (password) {
    const saltRound = 10;
    bcrypt.genSalt(saltRound, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        User.update({ password: hash }, { where: { id } }).catch((err) => {
          console.log(err);
          return res.status(500).send({ message: "Internal server error" });
        });
      });
    });
  }

  // 수정된 정보로 토큰 생성, 전달
  User.findOne({
    where: { id },
  })
    .then((userInfo) => {
      delete userInfo.dataValues.password;
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      const accessToken = generateAccessToken(userInfo.dataValues);
      const refreshToken = generateRefreshToken(userInfo.dataValues);
      sendAccessToken(res, accessToken);
      sendRefreshToken(res, refreshToken);
      return res.redirect(302, "/users/info");
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Internal server error" });
    });
};
