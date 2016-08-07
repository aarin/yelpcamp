/****** Schema and Model Configuration *******/
var mongoose = require("mongoose");

// comment Schema
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        // id comes from mongoose schema's object reference to User model
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});


// export the Comment Model
module.exports = mongoose.model("Comment", commentSchema);