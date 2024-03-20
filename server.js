const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(helmet());

// BodyParsers
app.use(express.json());

app.use(require("./routes"));

app.listen(process.env.PORT ?? 8080, () => {
	console.log(`Server started in http://localhost:${process.env.PORT ?? 8081}`);
});
