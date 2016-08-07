/************************   Campgrounds RESTful Routes     **********************************/
/*   ===============================================================================        */
/*   name       url                     http verb   desc                                    */
/*   ===============================================================================        */
/*   INDEX      /campgrounds            GET         Displays list of campgrounds            */
/*   NEW        /campgrounds/new        GET         Displays form to make new campground    */
/*   CREATE     /campgrounds            POST        Adds new campground to DB, then         */         
/*                                                    redirects to /campgrounds              */
/*   SHOW       /campgrounds/:id        GET         Shows info about one campground         */
/*   EDIT       /campgrounds/:id/edit   GET         Displays edit form for one campground   */
/*   UPDATE     /campgrounds/:id        PUT         Updates particular campground, then     */
/*                                                     redirects to /campgrounds/:id         */
/*   DESTROY    /campgrounds/:id        DELETE      Deletes particular campground then      */
/*                                                    redirects to /campgrounds/:id          */
/********************************************************************************************/

// use Express Router to add all routes to router & export router
var express = require("express");
var router  = express.Router();

// require Models and middleware
var Campground  = require("../models/campground");

// require middlewares 
// notice /index.js in node is always required (its a special name)
var middleware = require("../middleware");

// ================================================
//  CAMPGROUNDS RESTful ROUTES
// 
//  INDEX   /campgrounds        GET
//  NEW     /campgrounds/new    GET
//  CREATE  /campgrounds        POST
//  SHOW    /campgrounds/:id    GET
// ================================================

// INDEX - show all campgrounds
router.get("/", function(req, res){
    
    
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
        }
    });
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    
    // get data from form and create newCampground object
    // uses req.user since authenticated by isLoggedIn 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    
    // create new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");  
        }
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    
    // find the campground with the provided id using mongoose method findById(id, callbac)
    // and populating the comments to references to mongoose object id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        } else {
            // render show template with that campground id
            res.render("campgrounds/show", {campground: foundCampground});
        }
        
    });
});

// EDIT - show form to edit campground after checkCampgroundOwnership middleware
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){

        // look for campground by id
        Campground.findById(req.params.id, function(err, foundCampground){
            // should be no error finding id because it was found in middleware 
            res.render("campgrounds/edit", {campground: foundCampground});
        });

});

// UPDATE - uses HTTP verb PUT; also calls checkCampgroundOwnership middleware
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    
    // Use mongoose combo of find and update the correct campground
    // we had to wrap name,image,description inside campgrounds in edit.ejs
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            // redirect to show page
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

// DESTROY - use mongoose to find id and remove a campground (also calls middleware)
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
});







/******** IMPORTANT! ********/
module.exports = router;