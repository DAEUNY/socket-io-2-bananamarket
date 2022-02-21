const { Op } = require("sequelize");
const { User, Report } = require("../../models");
const { checkAccessToken } = require("../tokenFunction");

module.exports = async (req, res) => {
  const accessTokenData = checkAccessToken(req);
  const { userId } = req.body

  // 토큰이 없거나 잘못된 경우
  if (!accessTokenData) {
    return res.status(401).send({ message: "Not authorized" });
  }

  const { type } = accessTokenData;

  // block 요청 유저가 ADMIN이 아닌 경우
  if (type !== 'ADMIN') {
    return res.status(401).send({ message: "Not authorized" });
  }

  const user = await User.findByPk(userId);

  // block 요청한 유저가 존재하지 않는 경우
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  // 이미 정지된 유저인 경우
  if (user.block === true) {
    return res.status(409).send({ message: "Blocked already" });
  }

  // 신고 횟수 확인
  const checkReportCount = await Report.findOne({
      attributes : ['user_id', 'count'],
      where : {
        user_id : userId,
        count : {
          [Op.gte] : 1 
        }
      }
  })

  // 신고되지 않은 유저인 경우
  if (!checkReportCount) {
    return res.status(404).send({ message: "Not reported" });
  }

  // 유저 정지
  await user.update({
      block : true
    })

  res.status(200).send({ message: 'Ok' });
};
