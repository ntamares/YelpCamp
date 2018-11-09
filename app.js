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
    image: String,
    description: String
});


var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create(
    {
        name: "Mission Hill", 
        image: "https://lh3.googleusercontent.com/KxmCQzt6nn8xg9RxmzZzOEOj5gxukjAKZH0QEQKYXY012NXcNucGkhCtvGsUoM8peYnSEeMN2ei9z3_GVvNYPTrsbV0nGgPYIpO3P_UcKkN20-r_xCxuN4ncrHM_kKE-CktXE_smqF57-fdT0g-wnSM77QMaQGFIfBTpfoXCQyfJdNnvQFhMGA2uxR9uGNRfVQfTz9dhnhhVnT0C8L6DkRFzCOPVs4nDOIowpFy-Jw9djXTojDEFAMtUISxNRWfMsMJBFW9AeYaX2a8YbIa02ueebGjzoavOKc6vgCYAr4DbZvcS_QfuJKnmpZT9mjS6Y0wyXqkFPub0edsKKg55WOm00Hxw3hwFKBc2GWpxL6Qkoa8QOMqdGOSn7Rnfju8_mvxIQmhW59UJp9Ed6zVcD1CAYT_HagQzb5Ma6tFlBxDQmJwjYCUdhcDhTu8G_zR5pH0wjcKgWYStFbQWToa6PDB0WukFVATpiXkqcWJnjSWTxMEbQZEFerJ4vHvUXI0Y6LPAkFmhWND4sxMR7IgYjBgpiWfDFzMlgQYHMAeZb-TVceI1cO3_Vzpicy4hkDpiSaC4-PDb9-xhE6HH7qXW0H8vfdjkharcZ1mm1NA9WB-HTKHxsWm35-CWPfKU0xmnY_RjAE1TwQ-NMgd9Rdd-wCQeAwG5-za4vCFQQbwPQJPW=w1127-h846-no",
        description: "Beautiful campground. Nice hikes nearby. No water, no bathrooms."
    } , function(err, campground){
        if(err){
            console.log(err);
        }
        else {
            console.log("Newly created cg");
            console.log(campground);
        }
});


////////////////////////////////
////        Routes         ////
//////////////////////////////
app.get("/", function(req, res){
    res.render("landing");
});

// INDEX ROUTE
//Shows campgrounds
app.get("/campgrounds", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW ROUTE
// new campgrounds
app.get("/campgrounds/new", function(req, res){
    res.render("newcampground");
})

// CREATE ROUTE
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

// SHOW ROUTE
// shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampGround){
        if(err){
            console.log(err);
        }
        else {
            res.render("show", {campground: foundCampGround});
        }
    });
    // render show template with that campground
});



///////////////////////////////

app.listen(3000, function(){
    console.log("YelpCamp app has started");
});