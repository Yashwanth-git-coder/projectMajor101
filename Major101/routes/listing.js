const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js")




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
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  // console.log(listing.location);
  res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  
  res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({path: "reviews", 
    populate: {
      path: "author",
    },
  })
  .populate("owner");

  if(!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings"); // ✅ Add `return` here
  }
  res.render("listings/show.ejs", { listing });
}));


// Create Route
router.post("/", validateListing, wrapAsync(async (req, res) => {
  
  const data = req.body.listing;

  const newListing = new Listing({
    ...data,
    image: {
      url: data.image || "",  // Wrap the plain string into an object
      filename: ""
    }
  });

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
}));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings"); // ✅ Add `return` here
  }
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));



module.exports = router;