const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require('joi');
const {listingSchema} = require("./schema.js");


const app = express();


main()
    .then(() => {
        console.log("connected to DB!");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));




app.get("/", (req, res) => {
    res.send("all working good!")
});

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
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  // console.log(listing.location);
  res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing.location);
  console.log(listing.image);
  res.render("listings/show.ejs", { listing });
}));


// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
  
  const data = req.body.listing;

  const newListing = new Listing({
    ...data,
    image: {
      url: data.image || "",  // Wrap the plain string into an object
      filename: ""
    }
  });

  await newListing.save();
  res.status(201).send("Listing created successfully");
}));


//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1220,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Samole was saved");
//     res.send("Succussfull testing!");

// });

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs", { err });
});

// Catch-all at the very end
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});


app.listen(8080, () => {
    console.log("Server is runing Successfully!")
});
