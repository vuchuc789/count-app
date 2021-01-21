const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("./helpers/database");

require("dotenv").config();

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;
const cookieSecret = process.env.COOKIE_SECRET || "secret";

connectToDatabase(mongoURI);

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser(cookieSecret));

app.use("/api", require("./routes/api"));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
