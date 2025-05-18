const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({ mergeParams: true });
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")



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
router.post("/", isLoggedIn, validatereview, wrapAsync(reviewController.postReview));


  
//Delete Review Route  
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;

