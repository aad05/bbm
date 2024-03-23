const { Router } = require("express");
const { certificate } = require("../controllers/download");

const router = Router();

router.get("/certificate", certificate);

module.exports = router;
