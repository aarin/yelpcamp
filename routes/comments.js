// use Express Router to add all routes to router & export router
var express = require("express");

var router  = express.Router({mergeParams: true});                              // merges params from campgrounds and comments

// require Models
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

// require middleware
var middleware = require("../middleware");

// ================================================
//  COMMENT RESTful ROUTES
// 
//  NEW         /campgrounds/:id/comments/new                   GET
//  CREATE      /campgrounds/:id/comments                       POST
//
//  EDIT        /campgrounds/:id/comments/:comment_id/edit      GET
//  UPDATE      /campgrounds/:id/comments                       PUT
//
//  DESTROY     /campgrounds/:id/comments                       DELETE
//
//  demonstrates nested routes (comments nested in campgrounds)
//  and uses isLoggedIn middleware
// ================================================

// NEW - renders comments form
// include isLoggedIn middleware to ensure user is logged in
router.get("/new", middleware.isLoggedIn, function(req, res){
    
    // find campground by id and send to comments/new.ejs
    Campground.findById(req.params.id, function(err, campground){
        if(err){  
            console.log(err);
        } else {
            
            // render form with variable campground
            res.render("comments/new", {campground: campground});
        }
    })
});

// CREATE - adds comments to db with associated campground
// includes middleware to prevent http POST from users not logged in
router.post("/", middleware.isLoggedIn, function(req, res){
    
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            
            // create the comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    // if errored in db or data, pass error flash message to template
                    req.flash("error","Something went wrong");
                    console.log(err);
                } else {
                    
                    // add id and username to comment following model & save comment
                    // note that req.user is because authenticated from isLoggedIn
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    // push comment into the campground comments & save the campground
                    campground.comments.push(comment);
                    campground.save();
                    
                    // redirect to campgrounds show page with success flash message
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // look for comment id and pass to rendered file
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            res.redirect("back");
        } else {
            // pass both campground_id and comment to .ejs views
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
    
});

// UPDATE - use mongoose to find id and update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    
    // Use mongoose combo of find and update the correct comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            // redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - use mongoose to find id and remove comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           // pass success flash message for deleted comment to template
           req.flash("success","Comment deleted");
           
           // redirect back to show page
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});





/******** IMPORTANT! ********/
module.exports = router;