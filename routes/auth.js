const { Router } = require("express");
const {
	sing_in,
	sing_up,
	update_user,
	confirm_email,
} = require("../controllers/auth");

const router = Router();

router.post("/sign-in", sing_in);
router.post("/sign-up", sing_up);
router.post("/confirm-email", confirm_email);
router.put("/update", update_user);

module.exports = router;
