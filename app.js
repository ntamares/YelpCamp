var express      = require("express"),
    app          = express(),
    bodyParser   = require ("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment")
    seedDB       = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

////////////////////////////////
////  Campground Routes    ////
//////////////////////////////
app.get("/", function(req, res){
    res.render("landing");
});

// INDEX
//Shows campgrounds
app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW
// new campgrounds
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/newcampground");
});

// CREATE
app.post("/campgrounds", function(req,res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image:image, description: desc};
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

// SHOW
// shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
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

////////////////////////////////
////    Comment Routes     ////
//////////////////////////////

// NEW 
app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/newcomment", {campground: campground});
        }
    });
});

// CREATE
app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

///////////////////////////////

app.listen(3000, function(){
    console.log("YelpCamp app has started");
});