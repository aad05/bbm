const errorStatus500 = require("../errors/500");
const fs = require("fs");

const certificate = async (req, res) => {
	try {
		const filePath = "utils/certificate.svg"; // Path to the SVG file

		// Read the SVG file
		fs.readFile(filePath, (err, data) => {
			if (err) {
				console.error("Error reading file:", err);
				res.status(500).send("Internal Server Error");
				return;
			}

			// Set appropriate headers
			res.setHeader("Content-Type", "image/svg+xml"); // Set content type as SVG
			res.setHeader(
				"Content-Disposition",
				'attachment; filename="certificate.svg"',
			); // Set filename for the downloaded file

			// Send the SVG data
			res.send(data);
		});
	} catch (error) {
		errorStatus500(error, res);
	}
};

module.exports = { certificate };
