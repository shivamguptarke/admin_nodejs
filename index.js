const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const Product = require(__dirname + '/ProductSchema.js');
const AdminModel  = require(__dirname + '/AdminSchema.js');

const multer = require('multer');
const { response } = require("express");

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
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat is secret',
    resave: false,
    saveUninitialized: false,
   // cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb+srv://newuser:newuser@cluster0.dark2.mongodb.net/helloFromComputer?retryWrites=true&w=majority');

const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'kitty kitty meow from server' });
kitty.save().then(() => console.log("meow"));

passport.use(AdminModel.createStrategy());
passport.serializeUser(AdminModel.serializeUser());
passport.deserializeUser(AdminModel.deserializeUser());

app.listen(process.env.PORT || 3000, console.log("server is up and running at 3000"));

app.get("/", (req, res) => {
    res.render("dashboard");
})

app.get("/dashboard", (req, res) => {
    if(req.isAuthenticated()){
        res.render("dashboard");
    }else{
        res.redirect("/login");
    }
    
})

app.get("/products", (req, res) => {
    Product.find({}, function(err, products){
        if (err){
            console.log(err);
        }
        else{
            res.render("products", {loadProducts: products});
            console.log(products);
        } 
    });
})


app.get("/AddProduct", (req, res) => {
    if(req.isAuthenticated()){
        res.render("AddProduct");
    }else{
        res.redirect("/login");
    }
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

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", (req, res, next) => {
    try{
        console.log("pass id ->" + req.body.password + req.body.username)
        passport.authenticate('local', function(err, admin, info) {
            console.log("auth log ----> " + err + " ------------ " + admin + " ---------- " + info)
            if (err) {
              return next(err); // will generate a 500 error
            }
            if (! admin) {
              return res.send(401,{ success : false, message : 'authentication failed' });
            }
            req.login(admin, function(err){
              if(err){
                return next(err);
              }
              return res.redirect("/dashboard");        
            });
          })(req, res, next);
    } catch (error) {
        console.log(error);
    }
})

app.post("/register", (req, res) => {
    try{
        AdminModel.register({username: req.body.username, name: req.body.name, phone: req.body.phone}, req.body.password, function(err, admin){
            if(err){
                console.log(err);
                res.redirect("/register");
            }else{
                console.log('here' + admin);
                passport.authenticate('local')(req, res, function () {
                    console.log(res);
                    res.redirect("/dashboard");
                });
            }
        })
    } catch (error) {
        console.log(error);
    }
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})