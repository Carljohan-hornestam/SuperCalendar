const router = require("express").Router();

router.use("/auth", require("./Auth"));
router.use("/events", require("./Events"));
router.use("/users", require("./Users"));

module.exports = router;