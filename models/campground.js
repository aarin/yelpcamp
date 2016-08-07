/****** Schema and Model Configuration *******/
var mongoose = require("mongoose");

// Campground Schema
// with object reference (association) to Comment & User models
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});



// note that the model exported has the schema (patterns) we need
// as well as the mongo methods we'll use with our mongo database
// (creating a new model will create a mongo database as the plural)

// export the Campground Model
module.exports = mongoose.model("Campground", campgroundSchema);