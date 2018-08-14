var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds});
        }
    });
});

router.post("/", isLoggedIn, function(req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create({name: req.body.name, image: req.body.image, description: req.body.desc, author: author}, function(err, newGC) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }    
    res.redirect("/login");
}

module.exports = router;