var express      = require("express"),
    app          = express(),
    bodyParser   = require ("body-parser")
    mongoose     = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Campground 2", 
//         image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f1c67ba6e5b4bf_340.jpg"
//     } , function(err, campground){
//         if(err){
//             console.log(err);
//         }
//         else {
//             console.log("Newly created cg");
//             console.log(campground);
//         }
// });

// // global array to be moved to db later
// var campgrounds = [
//     {name: "Campground 1", image: "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f1c67ba6e5b4bf_340.jpg"},
//     {name: "Campground 2", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f1c67ba6e5b4bf_340.jpg"},
//     {name: "Campground 3", image: "https://pixabay.com/get/e136b80728f31c22d2524518b7444795ea76e5d004b0144594f7c378afecb2_340.jpg"}
// ];

////////////////////////////////
////        Routes         ////
//////////////////////////////
app.get("/", function(req, res){
    res.render("landing");
});

//Shows campgrounds
app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req,res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image:image};
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

// new campgrounds
app.get("/campgrounds/new", function(req, res){
    res.render("newcampground");
})

///////////////////////////////

app.listen(3000, function(){
    console.log("YelpCamp app has started");
});