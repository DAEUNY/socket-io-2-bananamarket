const { User } = require("../../models");

module.exports = async (req, res) => {
  // 닉네임 중복 확인
  const { name } = req.body;
  if (!name) {
    return res
      .status(422)
      .send({ message: "Insufficient parameters supplied" });
  }

  const userInfo = await User.findOne({
    where: {
      name: name,
    },
  }).catch((err) => {
    res.status(500).send({
      message: "Internal server error",
    });
  });

  if (!userInfo) {
    return res.status(200).send({
      message: "ok",
    });
  } else {
    return res.status(409).send({
      message: "Already exist name",
    });
  }
};
