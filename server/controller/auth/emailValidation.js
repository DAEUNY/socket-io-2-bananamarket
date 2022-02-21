const { User } = require("../../models");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (req, res) => {
  // 이메일 중복 확인
  const { email } = req.body;
  if (!email) {
    return res
      .status(422)
      .send({ message: "Insufficient parameters supplied" });
  }

  const userInfo = await User.findOne({
    where: {
      email,
    },
  }).catch((err) => {
    res.status(500).send({
      message: "Internal server error",
    });
  });

  if (userInfo) {
    return res.status(409).send({
      message: "Already exist name",
    });
  }

  // 사용할 수 있는 이메일이면 인증 이메일을 보내도록 한다.
  // 메일 발송 객체 생성
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // 인증 번호로 사용할 6자리 랜덤 숫자
  const randomNum = Math.random() * 100000;
  const randomNumFloor = Math.floor(randomNum + 100000);

  // 메일 내용물에 대한 정의
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "🍌 Banana Market 인증 이메일입니다 🍌",
    html: `<div
    style='
    text-align: center; 
    box-shadow: 5px 5px;
    width: 50%; 
    height: 60%;
    margin: 15%;
    padding: 20px;
    box-shadow: 1px 1px 3px 0px #999;
    border-radius: 10px; 
    '>
    <h2>🍌 Banana Market 인증 이메일입니다 🍌</h2>
    <div>아래 6자리 인증번호를 입력해주세요!</div>
    <h2>${randomNumFloor}</h2> 
    </div>`,
  };

  // 메일 발송
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent" + info.response);
    }
  });

  return res
    .status(200)
    .send({ data: { authorizationNum: randomNumFloor }, message: "ok" });
};
