const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ejs = require('ejs');

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://newuser:newuser@cluster0.dark2.mongodb.net/helloFromComputer?retryWrites=true&w=majority');

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'kitty kitty meow from server' });
kitty.save().then(() => console.log('meow'));


app.listen(process.env.PORT || 3000, console.log("server is up and running at 3000"));

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
})

app.get("/form", (req, res) => {
    res.render("form");
})
