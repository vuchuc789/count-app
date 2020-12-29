const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;

app.use(cors());

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDB connected !!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api", require("./routes/api"));

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
