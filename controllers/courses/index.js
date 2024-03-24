const errorStatus500 = require("../../errors/500");
const main_db = require("../../db");
const bodyRequirer = require("../../errors/bodyRequirer");

const course_category = async (req, res) => {
	try {
		const [categories] = await main_db.query(`
            SELECT * FROM course_categories;
        `);

		res.status(200).json({ message: "success", data: categories });
	} catch (error) {
		return errorStatus500(error, res);
	}
};

const by_category = async (req, res) => {
	try {
		const { category } = req.params;
		await bodyRequirer({ body: req.params, requiredValue: ["category"] });
		const [categories] = await main_db.query(`
		    SELECT * FROM ${category.toUpperCase().replaceAll("-", "_")};
		`);

		res.status(200).json({
			message: "success",
			data: categories.map((value) => ({
				...value,
				curriculum: JSON.parse(value.curriculum),
			})),
		});
	} catch (error) {
		return errorStatus500(error, res);
	}
};

module.exports = { course_category, by_category };
