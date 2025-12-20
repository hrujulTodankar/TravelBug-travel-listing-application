// routes/listings.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schemas.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner ,validateListing } = require("../middleware.js");

// Validator middleware (assumes form uses `listing[...]` shape)

// INDEX - GET /listings
router.get("/", wrapAsync(async (req, res) => {
  const alllisting = await Listing.find({});
  return res.render("listings/index.ejs", { alllisting });
}));

// NEW - GET /listings/new
// IMPORTANT: path is "/new" (not "/listings/new") because router is mounted at /listings
router.get("/new",isLoggedIn, (req, res) => {
  return res.render("listings/new.ejs");
});

// CREATE - POST /listings
router.post("/", isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
  const listingData = req.body.listing ?? req.body;
  const newListing = new Listing({
    title: listingData.title,
    description: listingData.desc || listingData.description,
    image: listingData.image && listingData.image.url ? { url: listingData.image.url } : undefined,
    price: listingData.price,
    location: listingData.location,
    country: listingData.country
  });
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created");
  return res.redirect("/listings");
}));

// SHOW - GET /listings/:id
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  // defensive validation to avoid Mongoose CastError
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid listing id");
  }
  const onelisting = await Listing.findById(id).populate({path :"reviews" , populate: { path: "author" } }).populate("owner");
  if (!onelisting) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  console.log(onelisting);
  return res.render("listings/show.ejs", { onelisting });
}));

// EDIT - GET /listings/:id/edit
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid listing id");
  }
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you are trying to edit does not exist!");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing updated");
  return res.render("listings/edit.ejs", { listing });
}));

// UPDATE - PUT /listings/:id
router.put("/:id", isLoggedIn , isOwner, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid listing id");
  }
  const updates = req.body.listing ?? req.body;
  await Listing.findByIdAndUpdate(id, { ...updates }, { runValidators: true });
  req.flash("success", "Listing updated");
  return res.redirect(`/listings/${id}`);
}));

// DELETE - DELETE /listings/:id
router.delete("/:id", isLoggedIn ,isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid listing id");
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  return res.redirect("/listings");
}));

module.exports = router;
