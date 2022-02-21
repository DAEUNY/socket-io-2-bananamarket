const router = require("express").Router();
const controller = require("./../controller");

router.get("/messages/:articleid", controller.getMessage);
router.get("/", controller.getRoomList);
router.post("/join/:articleid", controller.joinRoom);
router.get("/participant/:articleid", controller.getParticipant);

module.exports = router;
