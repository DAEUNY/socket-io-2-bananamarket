const router = require("express").Router();
const controller = require("./../controller");

router.post("/email", controller.getEmailValidation);
router.post("/name", controller.getNameValidation);

module.exports = router;
