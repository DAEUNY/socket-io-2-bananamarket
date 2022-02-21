const { User } = require("../../models");
const { checkAccessToken } = require("../tokenFunction");

module.exports = async (req, res) => {
  // 회원 탈퇴
  const accessTokenData = checkAccessToken(req);
  if (!accessTokenData) {
    return res.status(401).send({ message: "Not authorized" });
  }

  const { id } = accessTokenData;
  User.destroy({
    where: {
      id,
    },
  })
    .then(() => {
      return res.status(200).send({ message: "ok" });
      // return res.redirect(302, "/posts/lists")
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: "Internal server error" });
    });
};
