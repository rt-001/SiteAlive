const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const userRoutes = require("./app/User/UserRoute");
const webRoutes = require("./app/Website/WebsiteRoutes");

app.use(cors());
app.use(express.json());
app.use(webRoutes);
app.use(userRoutes);
app.listen(3000, () => {
  console.log("Backend is up at port 3000");
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Established a connection with the database"))
    .catch((err) => console.log("Error connecting to database", err));
});
