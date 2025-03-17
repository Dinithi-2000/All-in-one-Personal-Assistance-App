//import express ,mongoDb,bodyparser and cord
const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

//create express application instance
const app = express();

dotenv.config();

//set local host port
const PORT = process.env.PORT || 8070;

//apply middleware to the applicaton and convert JSON request to HTTP request
app.use(cors());
app.use(bodyparser.json());

//get mongodb url
const URL = process.env.MONGO_URL;

//create connection
mongoose.connect(URL)
    .then(() => console.log("MongoDb Connected Successfully"))
    .catch((err) => console.log("Connection Failed", err));

//open created connection
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MogoDB success")
})

//start server
app.listen(PORT, () => {
    console.log(`server start and running ${PORT}`);
})

