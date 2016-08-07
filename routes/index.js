// use Express Router to add all routes to router & export router
var express  = require("express");
var router   = express.Router();
var passport = require("passport");

// require Models
var User  = require("../models/user");


/*********************************/
/******     Root Route    *******/
/********************************/

router.get("/", function(req, res){
    res.render("landing");
});

// ================================================
//  AUTH ROUTES
// 
//  NEW         /signup         GET
//  CREATE      /signup         POST
//
// ================================================

// NEW - render signup form
router.get("/signup", function(req,res){
    res.render("signup");
});

// CREATE - handles signup logic
router.post("/signup", function(req,res){
    
    // newUser using User model with username only
    var newUser = new User({username: req.body.username});
    
    // use passport-local-mongoose method register that will pass a hash password
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // if err & can't sign up for some reason, pass err.message to error flash message
            req.flash("error", err.message);
            // use redirect to signup (redirect catches flash message, render was not)
            res.redirect("/signup");
        } else {
            
            // after signing up, authenticate and log them in & redirect to /campgrounds
            passport.authenticate("local")(req,res, function(){
                // pass success flash for successful signup to template
                // where user.username is the username from db
                req.flash("success","Welcome to YelpCamp " + user.username)
                res.redirect("/campgrounds");
            });
        }
    });
    
});

// ================================================
//  LOGIN ROUTES
// 
//  NEW         /login         GET
//  CREATE      /login         POST
//
// and LOGOUT route 
// ================================================

// NEW - render login form
router.get("/login", function(req, res){
    // render login form
    res.render("login");
});

// CREATE - handles login logic & uses passport's authenticate middleware
router.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    
    }), function(req,res){
});

// LOGOUT - use passport's logout method and then redirects user
router.get("/logout", function(req, res){
   req.logout();
   
   // pass flash message to template & then redirect
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});


/******** IMPORTANT! ********/
module.exports = router;