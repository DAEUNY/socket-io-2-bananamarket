const bcrypt = require("bcrypt");
const { send } = require("express/lib/response");
const { User } = require("../../models");
const {
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../tokenFunction");

module.exports = async (req, res) => {
  // 로그인

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Bad request" });
  }

  User.findOne({
    where: {
      email,
    },
  }).then((userData) => {
    if (!userData) {
      return res.status(404).send({ message: "Wrong email or password" });
    }
    const encodedPassword = userData.password;

    bcrypt.compare(password, encodedPassword, (err, result) => {
      if (result) {
        delete userData.dataValues.password;
        const accessToken = generateAccessToken(userData.dataValues);
        const refreshToken = generateRefreshToken(userData.dataValues);
        sendAccessToken(res, accessToken);
        sendRefreshToken(res, refreshToken);
        return res
          .status(200)
          .send({ data: userData.dataValues, message: "ok" });
        // res.redirect(302, "/articles/list");
      } else {
        return res.status(404).send({ message: "Wrong email or password" });
      }
    });
  });
};
