const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js")

const listingController = require("../controllers/listing.js");

const multer  = require('multer');

const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
    // return res.status(400).send(error.details[0].message);
  }else{
  next();
  }
};



//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.rederNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListings));

// Create Route
router.post("/", isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createRoute));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editRoute));

//Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateRoute));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));



module.exports = router;