const express = require("express");
const router = express.Router();

const controller = require("./../controller");
const userRouter = require("./user");
const postRouter = require("./post");
const roomRouter = require("./room");
const validationRouter = require("./validation");
const adminRouter = require("./admin");

router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/signup", controller.signup);
router.get("/token", controller.token);

router.use("/users", userRouter);
router.use("/articles", postRouter);
router.use("/rooms", roomRouter);
router.use("/validation", validationRouter);
router.use("/admin", adminRouter);

module.exports = router;
