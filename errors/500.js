const errorStatus500 = (error, res) =>
	res.status(500).json({
		message: "error",
		extraMessage:
			error?.message || "Ooops something went wrong. Please try again!",
	});

module.exports = errorStatus500;
