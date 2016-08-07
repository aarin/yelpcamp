// require Models
var Campground = require("../models/campground");
var Comment = require("../models/comment");


var middlewareObj = {};

/********** checkCampgroundOwnership Middleware **********/
// verifies Authorization to campgrounds and comments
// allowing only the authoring user to EDIT, UPDATE, or DESTROY

middlewareObj.checkCampgroundOwnership = function( req, res, next ){
    // checks if user is logged in
    if(req.isAuthenticated()){
        
        // look for campground by id
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                // (just for secuity) if err, pass error flash to template
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // Check if the author id of campground matches the logged in user id
                // note: foundCampground.author.id = Mongoose Object & req.user._id = String
                // instead use Mongoose method .equals() to compare
                if(foundCampground.author.id.equals(req.user._id)){
                    
                    // call next() ie. route handler
                    next();

                } else {
                    
                    // if user does not own campground, pass flash error message
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        // just for security, pass error flash to template if user not logged in
        req.flash("error","You need to be logged in to do that.");
        
        // redirect user to previously visited page
        res.redirect("back");
    }
    
}

/********** checkCommentOwnership Middleware **********/
// verifies Authorization to comment
// allowing only the authoring user to EDIT, UPDATE or DESTROY

middlewareObj.checkCommentOwnership = function( req, res, next ){
    // checks if user is logged in
    if(req.isAuthenticated()){
        
        // look for comment by id
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                
                // Check if the author id of comment matches the logged in user id
                
                // use Mongoose method .equals() to compare mongoose object to passport's user._id
                if(foundComment.author.id.equals(req.user._id)){
                    
                    // call next() ie. route handler
                    next();

                } else {
                    
                    // if user does not own comment, pass flash error message
                    req.flash("error", "You do not have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else {
        // just for security, pass error flash to template if user not logged in
        req.flash("error","You need to be logged in to do that.");
        
        // redirect user to previously visited page
        res.redirect("back");
    }

}

/********** isLoggedIn Middleware **********/
middlewareObj.isLoggedIn = function( req, res, next ){
    if(req.isAuthenticated()) {
        return next();
    }
    // pass flash message to template BEFORE redirect
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login");
}

module.exports = middlewareObj;