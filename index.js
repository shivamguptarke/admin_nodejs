const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ejs = require('ejs');
const Product = require('../mongo_app/Schema.js');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const upload = multer({ storage: storage });

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("/public"));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://newuser:newuser@cluster0.dark2.mongodb.net/helloFromComputer?retryWrites=true&w=majority');

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'kitty kitty meow from server' });
kitty.save().then(() => console.log('meow' + __dirname));


app.listen(process.env.PORT || 3000, console.log("server is up and running at 3000"));

app.get("/", (req, res) => {
    res.render("dashboard");
})

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
})

app.get("/products", (req, res) => {
    res.render("products");
})


app.get("/AddProduct", (req, res) => {
    res.render("AddProduct");
})

app.post("/AddProduct",upload.single('productImage'), (req, res) => {
    var body = req.body;
    console.log(body);

    var newProduct = new Product({
        "name" : body.name,
        "category" : "asjkdlhas dj",
        "quantity" : body.quantity,
        "description" : body.description,
        "image" : req.file.filename,
    });
    newProduct.save(
    //     function (err) {
    //     if (err) {
    //         res.render("products");
    //     };
    //     // saved!
    //     res.render("products");
    //   }
    );
})