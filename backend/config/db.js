const mongoose = require("mongoose");
// const dotenv = require("dotenv").config();
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "../.env" });
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`DB connected: ${conn.connection.host}`.cyan.underline.bold);
    console.log(conn.connection.host);
  } catch (error) {
    console.log(error);
    console.log("first");
    process.exit(1);
  }
};

module.exports = connectDB;
