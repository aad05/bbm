const { Router } = require("express");

const router = Router();

router.use("/auth", require("./auth"));
router.use("/courses", require("./courses"));
router.use("/download", require("./download"));

module.exports = router;
