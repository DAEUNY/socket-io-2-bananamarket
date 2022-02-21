const { checkAccessToken } = require("../tokenFunction");

module.exports = async (req, res) => {
  // 로그아웃

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(205).send({ message: "Logged out successfully" });
  // res.redirect(302, "/posts/lists");
};
