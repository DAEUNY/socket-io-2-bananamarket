const { Op } = require("sequelize");
const { User, Report } = require("../../models");
const { checkAccessToken } = require("../tokenFunction");
const { Sequelize } = require("./../../models/index.js");


module.exports = async (req, res) => {
  const accessTokenData = checkAccessToken(req);

  // 토큰이 없거나 잘못된 경우
  if (!accessTokenData) {
    return res.status(401).send({ message: "Not authorized" });
  }

  const { type } = accessTokenData;

  // block 요청 유저가 ADMIN이 아닌 경우
  if (type !== 'ADMIN') {
    return res.status(401).send({ message: "Not authorized" });
  }

  const reportList = await User.findAll({
    attributes : [['id', 'userId'], 'name', 'email', ['profile_image', 'profileImage'], 'block'],
    include : [{
      model : Report,
      attributes : [],
      where : {
        count : {
          [Op.gte] : 1 
        }
      }
    }]
  })
  .catch((err) => {
    console.log(err)
    res.status(400).send({message : 'Internal server error'})
  })

  return res.status(200).json({
    data : {
      reportedUserInfo : reportList
    }, 
    message: "ok" 
  });
}