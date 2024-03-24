const errorStatus500 = require("../errors/500");
const fs = require("fs");
const cheerio = require("cheerio");
const main_db = require("../db");
const bodyRequirer = require("../errors/bodyRequirer");

const certificate = async (req, res) => {
	try {
		const { id } = req.query;

		await bodyRequirer({ body: req.query, requiredValue: ["id"] });

		const filePath = "utils/certificate.svg"; // Path to the SVG file

		const [[user]] = await main_db.query(`
			SELECT * FROM users WHERE id = ${id};
		`);

		if (!user) return res.status(404).json({ message: "User not found" });

		// Svg with Sync reading
		const svgFile = fs.readFileSync(filePath, "utf8");

		// SVG DOM
		const $ = cheerio.load(svgFile, { xmlMode: true });

		// Finding related text element
		const textElement = $("text#full_name");

		// Updating related word
		textElement.text(`${user.name} ${user.surname}`);

		// Storing new svg
		fs.writeFileSync("modified_svg_file.svg", $.xml(), "utf8");

		const data = fs.readFileSync("modified_svg_file.svg");

		res.setHeader("Content-Type", "image/svg+xml"); // Set content type as SVG
		res.setHeader(
			"Content-Disposition",
			'attachment; filename="certificate.svg"',
		); // Set filename for the downloaded file

		res.send(data);

		// fs.unlink("modified_svg_file.svg", (err) => {
		// 	if (err) {
		// 		console.error("Error deleting the updated SVG file:", err);
		// 		return;
		// 	}
		// 	console.log("Updated SVG file has been deleted successfully.");
		// });
	} catch (error) {
		errorStatus500(error, res);
	}
};

module.exports = { certificate };
