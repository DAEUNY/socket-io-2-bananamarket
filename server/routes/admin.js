const router = require("express").Router();
const controller = require("./../controller");

router.get("/report", controller.getReportList);
router.patch("/block", controller.blockUser);

module.exports = router;
