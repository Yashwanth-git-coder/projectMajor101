const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({ mergeParams: true });
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js")



const validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
      // return res.status(400).send(error.details[0].message);
    }else{
    next();
    }
  };

  


// Reviwes
// Post Route
router.post("/", validatereview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
   
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  
  }));
  
//Delete Review Route
  
router.delete("/:reviewId", wrapAsync(async (req, res) => {
let {id, reviewId} = req.params;

await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
await Review.findByIdAndDelete(reviewId);
req.flash("success", "Review Deleted!");
res.redirect(`/listings/${id}`);
}))

module.exports = router;