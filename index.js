const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/testAdminDB');


app.listen(process.env.PORT || 3000, console.log("server is up and running at 3000"));

app.get("/", (req, res) => {
    res.redirect("index.html");
})
