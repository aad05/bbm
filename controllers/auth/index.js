const main_db = require("../../db");
const errorStatus500 = require("../../errors/500");
const bodyRequirer = require("../../errors/bodyRequirer");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { filterViaObject } = require("../../tools");

// Method: POST; Description: Sign in
const sing_in = async ({ body }, res) => {
	try {
		const { email, password } = body;

		await bodyRequirer({ body, requiredValue: ["email", "password"] });

		const [[user]] = await main_db.query(`
           SELECT id, surname, name, middle_name, email, phone_number, work, province, district, bio, password
           FROM users
           WHERE email = '${email}';
        `);

		if (!user) throw new Error("User not found!");

		if (!(await bcryptjs.compare(password, user.password)))
			throw new Error("User not found!");

		const token = jwt.sign({ user }, process.env.JWT_SECRET, {
			expiresIn: "365d",
		});

		res.status(201).json({
			message: "success",
			data: {
				token,
				user: filterViaObject({ object: user, keys: ["password"] }),
			},
		});
	} catch (error) {
		console.log(error);
		errorStatus500(error, res);
	}
};

// Method: POST; Description: Sign up
const sing_up = async ({ body }, res) => {
	try {
		const { email, password } = body;

		await bodyRequirer({ body, requiredValue: ["email", "password"] });

		// Hash password (salt 10)
		const hashed_password = await bcryptjs.hash(password, 10);

		await main_db.query(`
            INSERT INTO users (email, password)
            VALUES ('${email}', '${hashed_password}');
        `);

		const [[user]] = await main_db.query(`
           SELECT id, surname, name, middle_name, email, phone_number, work, province, district, bio
           FROM users
           WHERE email = '${email}';
        `);

		const token = jwt.sign({ user }, process.env.JWT_SECRET, {
			expiresIn: "365d",
		});

		res.status(201).json({
			message: "success",
			data: { token, user },
		});
	} catch (error) {
		errorStatus500(error, res);
	}
};

// Method: PUT; Description: Update user
const update_user = async ({ body }, res) => {
	try {
		const {
			surname = null,
			name = null,
			middle_name = null,
			phone_number = null,
			work = null,
			province = null,
			district = null,
			bio = null,
			id = null,
		} = body;

		await bodyRequirer({ body, requiredValue: ["id"] });

		await main_db.query(`
        UPDATE users
        SET surname = '${surname}', name = '${name}', middle_name = '${middle_name}', 
            phone_number = '${phone_number}', work = '${work}', province = '${province}',  
            district = '${district}', bio = '${bio}'
        WHERE id = ${id};
        `);

		res.status(201).json({
			message: "success",
		});
	} catch (error) {
		errorStatus500(error, res);
	}
};

module.exports = { sing_in, sing_up, update_user };
