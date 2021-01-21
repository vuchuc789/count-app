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
const corsOptions = {
  origin: true,
  credentials: true,
  maxAge: 3600,
  optionsSuccessStatus: true,
};

connectToDatabase(mongoURI);

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser(cookieSecret));

app.use("/api", require("./routes/api"));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
