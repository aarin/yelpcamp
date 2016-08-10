/***********************************************************************************************/
/*****************************          Setup Server              ******************************/
/***********************************************************************************************/

var express                 = require("express"),                 // server-side
    app                     = express(),
    bodyParser              = require("body-parser"),             // how we get data out of a form
    mongoose                = require("mongoose"),                // how we interact with MongoDB
    passport				= require("passport"),				  // authentication middleware for Node.js
	LocalStrategy			= require("passport-local"),		  // authentication strategy
	passportLocalMongoose 	= require("passport-local-mongoose"), // mongoose plugin to implement passport
    expressSession          = require("express-session"),         // for sessions in express
    methodOverride          = require("method-override"),         // lets us use HTTP vers PUT and DELETE
    flash                   = require("connect-flash");           // flash for passing messages to next request display

/********** Module.Exports **********/
// notice ./ references current folder & .js is implicit

// require models
var Campground   = require("./models/campground"), 
    Comment      = require("./models/comment"),
    User         = require("./models/user");

// require seedDB to seed our database
var seedDB = require("./seeds");
    
// require routes 
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    

/********** App Config **********/

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";   // good practice to catch if env variable is undefine or empty
mongoose.connect(url);                                                  // mongoose connect to database url or default to localhost database
// Mongo Lab Database URL (for heroku & deployment):                    mongodb://aarin:baxter1001@ds145315.mlab.com:45315/yelp-camp-development"
// Local Host Database URL (for mongod & development):                  mongodb://localhost/yelp_camp

app.use(bodyParser.urlencoded({extended: true}));       // use bodyParser to extract from forms
app.set("view engine", "ejs");                          // set view engine
app.use(express.static(__dirname + "/public"));         // serve contents of /public directory (stylesheets, scripts)
app.use(methodOverride("_method"));                     // creates middleware to override a method
app.use(flash());                                       // uses flash package to display flash messages

// seedDB();                                             // call function to seed the database


/********** Passport Config **********/

app.use(expressSession({                                // use express-session
    secret: "My Baxter is the cutest dog!",             // secret string used to compute the hash
    resave: false,                                      // two lines we have to have
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));   // let app use passport-local-mongoose authenticate middleware
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());


/********** App Middleware **********/

// passes objects to to the templates
app.use(function(req, res, next){                       
    res.locals.currentUser  = req.user;                 // req.user available by passport to contain username and _id
    res.locals.error        = req.flash("error");       // req.flash available by flash-connect | error flash (alert red)
    res.locals.success      = req.flash("success");     // success flash (alert green)
    next();
});


/********** Routes Config **********/

// append common directories for shorter route declarations 
// (ie. in campgrounds.js and comments.js)
app.use("/", indexRoutes);                              // tell app to use these route files
app.use("/campgrounds", campgroundRoutes);              // uses "/campgrounds" in front of campgroundRoutes 
app.use("/campgrounds/:id/comments", commentRoutes);



/******************* IMPORTANT! ********************/
// listen for the port and host of environment on cloud9
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server has started.");
});