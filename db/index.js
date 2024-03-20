const mysql = require("mysql2/promise");

const main_db = mysql.createPool({
	host: "83.69.139.250",
	user: "babmuz_online",
	password: "_.0-l#M.E*U,",
	database: "babmuz_online",
	port: 3306,
});

module.exports = main_db;
