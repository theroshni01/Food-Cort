var express=require("express"),
mongoose=require("mongoose"),
passport=require("passport"),
bodyparser = require("body-parser"),
LocalStrategy=require("passport-local"),
PassportLocalMongoose=require("passport-local-mongoose"),
User = require("./model/user");

var ejs=require('ejs');

mongoose.connect("mongodb://127.0.0.1.:27017/AL&R");

var app=express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret:"Rusty is a dog",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
    res.render("index");
});

app.get("/login",function(req,res){
    res.render("home");
});

app.get("/index",function(req,res){
    res.render("index");
});

app.get("/profile",isLoggedIn, function(req,res){
    res.render("profile");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
res.redirect("/profile");
}

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){

    var username = req.body.username

    User.register(new User({username:username}),
 req.body.password,function(err,user)
 {
    if(err){
        console.log(err);
        return res.render("home");
    }

    passport.authenticate("local")(req,res,function(){
    res.render("home");
}); 
});
});

//showing login form
app.get("/login",function(req,res){
    res.render("login");
});

//handing user login
app.post("/login", passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login"
}), function(req,res){
});

//handling user logout
app.get("/logout",function(req, res, next){
req.logout(function(err){
    if(err){
        return next(err);
    }
    res.redirect("/");
});
});

var port = process.env.PORT || 8080;
app.listen(port,function(){
    console.log("server Has Started!");
});
console.log("http://localhost:8080/");