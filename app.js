var express = require("express");
var app = express();
var bodyParser = require ("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// global array to be moved to db later
var campgrounds = [
    {name: "Campground 1", image: "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f1c67ba6e5b4bf_340.jpg"},
    {name: "Campground 2", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f1c67ba6e5b4bf_340.jpg"},
    {name: "Campground 3", image: "https://pixabay.com/get/e136b80728f31c22d2524518b7444795ea76e5d004b0144594f7c378afecb2_340.jpg"}
];

////////////////////////////////
////        Routes         ////
//////////////////////////////
app.get("/", function(req, res){
    res.render("landing");
});

//Shows campgrounds
app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds, campgrounds});
});

app.post("/campgrounds", function(req,res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image:image};
    campgrounds.push(newCampground);
    //redirect to same page
    res.redirect("/campgrounds")
});

// new campgrounds
app.get("/campgrounds/new", function(req, res){
    res.render("newcampground");
})

///////////////////////////////

app.listen(3000, function(){
    console.log("YelpCamp app has started");
});