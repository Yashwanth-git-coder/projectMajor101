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
  
  const data = req.body.listing;

  let image = data.image;

  if (typeof data.image === "string") {
    image = {
      url: data.image,
      filename: ""
    };
  }

  const newListing = new Listing({
    ...data,
    image: image  // ✅ Now using the correct, formatted image object
  });

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
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateRoute = async (req, res) => {
    let { id } = req.params;
  
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
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