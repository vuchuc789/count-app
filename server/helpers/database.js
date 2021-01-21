const mongoose = require("mongoose");

exports.connectToDatabase = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("MongoDB connected !!");
  } catch (err) {
    console.log(err);
  }
};
