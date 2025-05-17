const Listing = require("./models/listing"); // ✅ Add this line
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
      }
      next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; // optional cleanup
  }
  next();
};


module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params; // ✅ FIX: get id from URL
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  console.log("Review ID:", reviewId); // Debug log
  const review = await Review.findById(reviewId);
  console.log("Found Review:", review); // Debug log


  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to modify this review.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
