const main_db = require("../../db");
const errorStatus500 = require("../../errors/500");
const bodyRequirer = require("../../errors/bodyRequirer");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { filterViaObject } = require("../../tools");
const nodemailer = require("nodemailer");

function generateRandomNumber(length) {
	let randomNumber = "";
	for (let i = 0; i < length; i++) {
		randomNumber += Math.floor(Math.random() * 10); // generates a random digit (0-9)
	}
	return randomNumber;
}

const transporter = nodemailer.createTransport({
	host: "server3.ahost.uz",
	port: 465,
	auth: {
		user: "registration@babm.uz",
		pass: "@oIe4VX!$Fq[",
	},
});

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

		const [[hasFound]] = await main_db.query(`
		   SELECT id, surname, name, middle_name, email, phone_number, work, province, district, bio
		   FROM users
		   WHERE email = '${email}';
		`);

		if (hasFound)
			return res
				.status(400)
				.json({ message: `Duplicate entry '${email}' for key 'email'!` });

		// Hash password (salt 10)
		const hashed_password = await bcryptjs.hash(password, 10);

		const expires_at = new Date();

		// Add 5 minutes to the current date
		expires_at.setMinutes(expires_at.getMinutes() + 5);

		// User
		const user = JSON.stringify({ email, password: hashed_password });

		// Code 8 length
		const code = generateRandomNumber(8);

		await main_db.query(`
            INSERT INTO should_confirm (expires_at, code, user)
            VALUES ('${expires_at.getTime()}', '${code}', '${user}');
        `);

		const mailOptions = {
			from: "Babm Register <registration@babm.uz>",
			to: email,
			subject: "Gmail Confirmation",
			text: `This is your registration code: ${code}`,
		};

		console.log(mailOptions);

		transporter.sendMail(mailOptions, (error, info) => {
			console.log(error);
			// if (error) return errorStatus500(error ?? {}, res);

			return res.status(200).json({
				message: "success",
				extraMessage:
					"Code has been sent, please check your mail box and verify your account!",
				code,
			});
		});
	} catch (error) {
		errorStatus500(error, res);
	}
};

// Method: POST; Description: Confirm Email
const confirm_email = async ({ body }, res) => {
	try {
		const { code } = body;

		await bodyRequirer({ body, requiredValue: ["code"] });

		const [[data]] = await main_db.query(`
			SELECT * FROM should_confirm WHERE code = '${code}';
		`);

		if (!data) return res.status(404).json({ message: "Code not found!" });

		if (Number(data.expires_at) < new Date().getTime()) {
			await main_db.query(`
				DELETE FROM should_confirm
				WHERE code = '${code}';
			`);
			return res.status(404).json({ message: "Code has been expired!" });
		}

		const { email, password } = JSON.parse(data.user);

		// Diactivating code
		await main_db.query(`
				DELETE FROM should_confirm
				WHERE code = '${code}';
			`);

		// New user
		await main_db.query(`
		    INSERT INTO users (email, password)
		    VALUES ('${email}', '${password}');
		`);

		const [[user]] = await main_db.query(`
		   SELECT id, surname, name, middle_name, email, phone_number, work, province, district, bio
		   FROM users
		   WHERE email = '${email}';
		`);

		const token = jwt.sign({ user }, process.env.JWT_SECRET, {
			expiresIn: "365d",
		});

		return res.status(201).json({
			message: "success",
			data: {
				token,
				user,
			},
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

module.exports = { sing_in, sing_up, confirm_email, update_user };
