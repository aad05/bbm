const bodyRequirer = async ({ body, requiredValue }) => {
	const checkRequireValue = requiredValue?.filter((val) => !body[val]);

	if (checkRequireValue.length)
		throw new Error(`${checkRequireValue.join(", ")} required!`);

	return null;
};

module.exports = bodyRequirer;
