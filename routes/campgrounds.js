var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");

// INDEX
router.get("/", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// NEW
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/newcampground");
});

// CREATE
router.post("/", isLoggedIn, function(req,res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image:image, description: desc, author: author};
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

// SHOW
router.get("/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampGround){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampGround);
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampGround});
        }
    });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;