/* seeds : error driven development */

var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var data = [
    {
        name: "Waptus Lake", 
        image: "https://cbswashington.files.wordpress.com/2012/05/camping-fishing-lake.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Lake Serene", 
        image: "http://www.mountainphotography.com/images/large/201107_snowmassLakeHikeTo.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
        {
        name: "Hyas Lake", 
        image: "http://www.superiortrails.com/2013images/porkies-1010109.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }];

function seedDB() {
    // remove all campgrounds in our database
    Campground.remove({}, function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("removed campgrounds!");
            
            // add the campgrounds in the data array to our db
            // inside the remove() callback, to ensure order of operations
            data.forEach(function(seed){
              Campground.create(seed, function(err,campground){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("added a campground!");
                        // create a comment for campground
                        Comment.create(
                            {
                                text: "This place is great, but I wish I had cell service",
                                author: "Homer"
                                
                            }, function(err, comment){
                                if(err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
              });
            });
        }
    });
}

module.exports = seedDB;