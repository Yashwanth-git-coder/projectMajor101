const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  // console.log(listing.location);
  res.render("listings/index.ejs", { allListings });
};

module.exports.rederNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
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
};

module.exports.createRoute = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;
  newListing.image = {url, filename};

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};



module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings"); // ✅ Add `return` here
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/h_300, w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateRoute = async (req, res) => {
  const { id } = req.params;
  
  // update text fields
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // if they did upload a file, overwrite the image
  if (req.file) {
    listing.image = {
      url:      req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


module.exports.deleteRoute =async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};