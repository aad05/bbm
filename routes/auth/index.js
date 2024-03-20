const { Router } = require("express");
const { sing_in, sing_up, update_user } = require("../../controllers/auth");

const router = Router();

router.post("/sign-in", sing_in);
router.post("/sign-up", sing_up);
router.put("/update", update_user);

module.exports = router;
