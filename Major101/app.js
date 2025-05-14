const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require('joi');


const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")



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




app.use("/listings", listings);


app.use("/listings/:id/reviews", reviews);



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
