const { Router } = require("express");
const { course_category, by_category } = require("../controllers/courses");

const router = Router();

router.get("/categories", course_category);
router.get("/:category", by_category);

module.exports = router;
